<template>
<div class="navbar">
    <nav class="deep-purple darken-1">
        <div class="container">
            <a class="brand-logo left">
                <router-link :to="{ name: 'GMap' }">Map View App</router-link>
            </a>
            <ul class="right">
                <li v-if="user">
                    <router-link :to="{ name: 'ViewProfile', params: { id: user.id } }">{{ user.email }}</router-link>
                </li>
                <li v-if="user" class="signout" @click="signOut()">Signout</li>
                <li v-if="!user">
                    <router-link :to="{ name: 'Signup' }">Signup</router-link>
                </li>
                <li v-if="!user">
                    <router-link :to="{ name: 'Login' }">Login</router-link>
                </li>
            </ul>
        </div>
    </nav>
</div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    data() {
        return {
            user: null
        }
    },
    methods: {
        signOut() {
            firebase.auth().signOut().then(() => this.$router.push({
                name: 'Login'
            }))
        }
    },
    created() {
        firebase.auth().onAuthStateChanged((userAuth) => {
            if (userAuth) {
                db.collection('users').where('userId', '==', userAuth.uid).get()
                    .then(snapshot => {
                        snapshot.forEach(document => {
                            this.user = document.data();
                            this.user.email = userAuth.email;
                            this.user.id = document.id;
                        });
                    })
            } else
                this.user = null
        })
    }
}
</script>

<style scoped>
.signout {
    cursor: pointer;
}

.navbar li {
    margin: 0 1rem;
}
</style>
