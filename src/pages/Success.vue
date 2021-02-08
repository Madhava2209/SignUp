<template>
    <div class="column q-pa-md">
        <h3 class="text-center">Success</h3>
        <q-file color="grey-3"
         outlined label-color="orange"
          v-model="picture"
           label="upload a picture"
           accept="image/*"
           max-file-size="5120000"
           >
        <template v-slot:append>
          <q-icon name="attachment" color="orange" />
        </template>
      </q-file>
      <q-btn @click="imageUpload" color="secondary" class="q-mb-md q-mt-md" label="Upload"/>
        <q-btn @click="logoutUser" color="primary" style="float:right" label="Logout"/>
    </div>
</template>

<script>
import {firebaseAuth, firebaseDB} from 'boot/firebase'
import 'firebase/storage'
import firebase from 'firebase/app'
export default {
    data() {
      return {
        picture: []
      }
    },
    methods: {
     logoutUser () {
      firebaseAuth.signOut()
      this.$router.replace('/')
    },
    imageUpload () {
      const userId = firebaseAuth.currentUser.uid
      firebase.storage().ref('images/' + userId + '/' + this.picture.name).put(this.picture).then(res => {
          console.log(res)
          this.picture = []
          this.showNotif('Uploaded')
      }).catch(err => {
          console.log(err)
      })
    },
    showNotif (message) {
      this.$q.notify({
        message: message,
        timeout: 2500
      })
    }
    }
}
</script>