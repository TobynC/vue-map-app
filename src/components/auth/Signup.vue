<template>
<div>
    <div class="signup container">
        <form @submit.prevent="signup()" class="card-panel">
            <h2 class="center deep-purple-text">Signup</h2>
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
                <label for="alias">Alias</label>
                <input autocomplete="off" v-model="alias" type="text" name="alias">
                <div v-if="aliasFeedback" class="feedback">{{ aliasFeedback }}</div>
            </div>
            <div class="field center">
                <button class="btn deep-purple">Signup</button>
            </div>
        </form>
    </div>
</div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    data() {
        return {
            email: null,
            emailFeedback: null,
            password: null,
            passwordFeedback: null,
            alias: null,
            aliasFeedback: null,
            slug: null,
            firebaseFeedback: null
        }
    },
    methods: {
        signup() {
            if (this.alias && this.email && this.password) {
                this.slug = this.generateSlug(this.alias);

                let reference = db.collection('users').doc(this.slug);
                reference.get().then(doc => {
                    if(doc.exists)
                        this.aliasFeedback = 'This alias already exists'
                    else{
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                        .then(user => {
                            reference.set({
                                alias: this.alias,
                                geolocation: null,
                                userId: user.uid                                
                            })
                        }).then(() => this.$router.push({ name: 'GMap' }))
                        .catch(error => {
                            this.firebaseFeedback = error.message
                            this.aliasFeedback = this.emailFeedback = this.passwordFeedback = null;
                        })
                    }                        
                })
            } else {
                if(!this.alias) this.aliasFeedback = 'You must enter an alias.'; else this.aliasFeedback = null;
                if(!this.email) this.emailFeedback = 'You must enter an email.'; else this.emailFeedback = null;
                if(!this.password) this.passwordFeedback = 'You must enter an password.'; else this.passwordFeedback = null;
            }
        },
        generateSlug(data) {
            return data.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
    }
}
</script>

<style scoped>
.signup {
    max-width: 30rem;
    margin-top: 5rem;
}

.signup h2 {
    font-size: 2.4rem;
}

.signup .field {
    margin-bottom: 1rem;
}
.feedback{
    color:red;
    margin: 0.5 0 rem;
}
</style>
