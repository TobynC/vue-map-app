<template>
<div class="view-profile container">
    <div v-if="profile" class="card">
        <h2 class="deep-purple-text center">{{ profile.alias }}'s Wall</h2>
        <ul class="comments collection">
            <li v-for="(comment, index) in comments" :key="index">
                <div class="deep-purple-text">{{ comment.from }}</div>
                <div class="grey-text text-darken-2">{{ comment.content }}</div>
            </li>
        </ul>
        <form @submit.prevent="addComment()">
            <div class="field">
                <label for="comment">Add a comment</label>
                <input v-model="newComment" name="comment" type="text" />
                <p class="feedback" v-if="feedback">{{ feedback }}</p>
            </div>
        </form>
    </div>
</div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'ViewProfile',
    data() {
        return {
            profile: null,
            newComment: null,
            feedback: null,
            comments: []
        }
    },
    methods: {
        addComment() {
            if (this.newComment) {
                let user = firebase.auth().currentUser;
                db.collection('users').where('userId', '==', user.uid).get()
                    .then(users => {
                        users.forEach(u => {
                            db.collection('comments').add({
                                content: this.newComment,
                                to: this.$route.params.id,
                                from: u.data().alias,
                                time: Date.now()
                            })
                        });
                    }).then(() => this.newComment = null)
                this.feedback = null;
            } else {
                this.feedback = "You must enter a comment."
            }
        }
    },
    created() {
        let reference = db.collection('users');

        reference.doc(this.$route.params.id).get().then(user => {
            this.profile = user.data();
            this.profile.id = user.id;
            db.collection('comments').where('to', '==', this.profile.id)
            .onSnapshot(snapshot => {
                snapshot.docChanges.forEach(change => {
                    if(change.type == 'added'){
                        this.comments.unshift({
                            from: change.doc.data().from,
                            content: change.doc.data().content
                        })
                    }
                })
            })
        })
    }
}
</script>

<style scoped>
.view-profile .card{
    padding: 1.2rem;
    margin-top: 5rem;
}
.view-profile h2{
    font-size: 2.5rem;
    margin-top: 0;
}
.view-profile li {
    padding: 1rem;
    border-bottom: 1px solid #eee;
}
.feedback {
    color: red;
    text-align: center;
}
</style>
