<template>
  <q-page class="flex">
      <q-card class="full-width">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="login" />
          <q-tab name="register" label="register" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login">
            <q-form @submit.prevent="onSubmit">
            <q-input filled type="email" v-model="email" label="Email" class="q-mb-md" required />
            <q-input filled type="password" v-model="password" label="Password" class="q-mb-md" required />
            <q-btn type="submit" color="primary" style="float:right" :label="tab === 'login' ? 'login' : 'register'"/>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="register">
            <q-form @submit.prevent="onSubmit">
              <q-input filled type="text" v-model="firstName" label="First Name" class="q-mb-md" required />
              <q-input filled type="text" v-model="lastName" label="Laste Name" class="q-mb-md" required />
              <q-input filled type="tel" v-model="phoneNumber" label="Phone Number" class="q-mb-md" required />
              <q-input filled type="email" v-model="email" label="Email" class="q-mb-md" required />
              <q-input filled type="password" v-model="password" label="Password" class="q-mb-md" required />
              <q-btn type="submit" color="primary" style="float:right" :label="tab === 'login' ? 'login' : 'register'"/>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
          <p style="color:red;padding: 10px;text-align:center">{{errorMessage}}</p>
        <p color='primary' style="text-align:center; color:blue; font-size:large">Or</p>
        <p style="text-align: center">Login/Register with Google <q-btn rounded style="font-size:20px" pointer @click="googleSignUp">G</q-btn></p>
      </q-card>
  </q-page>
</template>
<script>
import {firebaseAuth, firebaseDB} from 'boot/firebase'
import firebase from 'firebase'
export default {
  data () {
    return {
      tab: 'login',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber:'',
      error: ''
    }
  },
  computed: {
    errorMessage() {
      return this.error
    }
  },
  methods: {
    onSubmit() {
      if (this.tab === 'login') {
        const email_valid = this.emailValidation()
        if (email_valid) {
          this.error = ''
          this.loginUser()
        } else {
          this.error = 'Invalid email address'
        }
      } else {
        const email_valid = this.emailValidation()
        const password_valid = this.passwordValidation()
        if (!email_valid) {
          this.error = 'Invalid email address'
        } else if (!password_valid) {
          this.error = 'Password must contain atleast 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character and atleast 8 characters'
        }
        else {
          this.error = ''
          this.registerUser()
        }   
      }
    },
    emailValidation() {
      if (/^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/.test(this.email))
        {
          return true
        } else {
          return false
        }
    },
    passwordValidation() {
      const password = this.password
        if (password.match(/[a-z]/g) && password.match( 
                    /[A-Z]/g) && password.match( 
                    /[0-9]/g) && password.match( 
                    /[^a-zA-Z\d]/g) && password.length >= 8
                    ) {
                      return true
                    }
      return false
    },
    registerUser () {
    firebaseAuth.createUserWithEmailAndPassword(this.email, this.password)
      .then(res => {
        console.log(res)
        const userId = firebaseAuth.currentUser.uid
        firebaseDB.ref('users/' + userId).set({
          firstName: this.firstName,
          email: this.email,
          lastName: this.lastName
        })
        this.$router.push('/success')
      })
      .catch(err => {
        this.error = err
        alert(err)
      })
  },
  loginUser () {
    firebaseAuth.signInWithEmailAndPassword(this.email, this.password)
      .then(res => {
        console.log(res)
        this.$router.push('/success')
      })
      .catch(err => {
        this.error = err
      })
  },
  googleSignUp () {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebaseAuth.signInWithPopup(provider).then(res => {
      console.log(res)
      if (res.additionalUserInfo.isNewUser) {
        const userId = firebaseAuth.currentUser.uid
        firebaseDB.ref('users/' + userId).set({
          fullName: res.additionalUserInfo.profile.name,
          email: res.additionalUserInfo.profile.email
        })
        this.$router.push('/success')
      } else {
        this.$router.push('/success')
      }
    }).catch(err => {
      this.error = err
    })
  }
  }
}
</script>
