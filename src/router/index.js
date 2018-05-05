import Vue from 'vue'
import Router from 'vue-router'
import GMap from '@/components/home/GMap'
import Login from '@/components/auth/Login'
import Signup from '@/components/auth/Signup'
import ViewProfile from '@/components/profile/ViewProfile'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GMap',
      component: GMap,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/ViewProfile/:id',
      name: 'ViewProfile',
      component: ViewProfile,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    let user = firebase.auth().currentUser;

    if(user){
      next();
    }
    else{
      next({ name: 'Login' });
    }
  }
  else{
    next();
  }
})

export default router;