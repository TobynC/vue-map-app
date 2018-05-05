<template>
<div class="login container">
    <form @submit.prevent="login()" class="card-panel">
        <h2 class="center deep-purple-text">Login</h2>
        <div v-if="firebaseFeedback" class="feedback">{{ firebaseFeedback }}</div>
        <div class="field">
            <label for="email">Email</label>
            <input autocomplete="off" v-model="email" type="email" name="email" />
            <div v-if="emailFeedback" class="feedback">{{ emailFeedback }}</div>
        </div>
        <div class="field">
            <label for="password">Password</label>
            <input autocomplete="off" v-model="password" type="password" name="password">
            <div v-if="passwordFeedback" class="feedback">{{ passwordFeedback }}</div>
        </div>
        <div class="field">
            <button class="btn deep-purple">Login</button>
        </div>
    </form>
</div>
</template>

<script>
import firebase from 'firebase'

export default {
    data() {
        return {
            email: null,
            emailFeedback: null,
            password: null,
            passwordFeedback: null,
            firebaseFeedback: null
        }
    },
    methods:{
        login(){
            if(this.email && this.password){
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(user => {
                    this.$router.push({ name: 'GMap' })
                })
                .catch(error => {
                    this.firebaseFeedback = error.message
                    this.emailFeedback = this.passwordFeedback = null;
                })                
            }
            else{
                if(!this.email) this.emailFeedback = 'You must enter your email.'; else this.emailFeedback = null;
                if(!this.passwrod) this.passwordFeedback = 'You must enter your password'; else this.passwordFeedback = null;
            }
        }
    }
}
</script>

<style scoped>
.login {
    max-width: 30rem;
    margin-top: 5rem;
}

.login h2 {
    font-size: 2.4rem;
}

.login .field {
    margin-bottom: 1rem;
}

.feedback {
    color: red;
    margin: 0.5 0 rem;
}
</style>
