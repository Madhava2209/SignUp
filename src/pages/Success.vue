<template>
    <div class="column">
        <h3 class="text-center">Success</h3>
        <q-btn @click="logoutUser" color="primary" style="float:right" label="Logout"/>
    </div>
</template>

<script>
import {firebaseAuth} from 'boot/firebase'
export default {
    methods: {
     logoutUser () {
      firebaseAuth.signOut()
      this.$router.replace('/')
    }   
    }
}
</script>