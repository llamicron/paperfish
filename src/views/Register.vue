<template>
  <div id="fullContainer" class="uk-background-primary">
    <div id="loginCard" class="uk-position-center">
      <div class="uk-card uk-card-default uk-card-body">

        <h2 class="uk-header">Register</h2>

        <div class="uk-margin">
          <div class="uk-inline inline-width-fix">
            <span class="uk-form-icon" uk-icon="icon: user"></span>
            <input type="text" v-model="displayName" class="uk-input" placeholder="Display Name" />
          </div>
        </div>

        <div class="uk-margin">
          <div class="uk-inline inline-width-fix">
            <span class="uk-form-icon" v-if="!validEmail()" uk-icon="icon: close"></span>
            <span class="uk-form-icon" v-if="validEmail()" uk-icon="icon: check"></span>
            <input :class="{ 'uk-form-success': validEmail() }" type="text" v-model="email" class="uk-input" placeholder="Email" />
          </div>
        </div>

        <div class="uk-margin">
          <div class="uk-inline inline-width-fix">
            <span class="uk-form-icon" v-if="!validPassword()" uk-icon="icon: close"></span>
            <span class="uk-form-icon" v-if="validPassword()" uk-icon="icon: check"></span>
            <!-- <input :class="{ 'uk-form-success': validEmail() }" type="text" v-model="email" class="uk-input" placeholder="Email" /> -->
            <input :class="{ 'uk-form-success': validPassword() }" type="password" v-model="password" class="uk-input" placeholder="Password" />
          </div>
        </div>

        <div class="uk-margin">
          <div class="uk-inline inline-width-fix">
            <span class="uk-form-icon" v-if="!passwordsMatch()" uk-icon="icon: close"></span>
            <span class="uk-form-icon" v-if="passwordsMatch()" uk-icon="icon: check"></span>
            <input :class="{ 'uk-form-success': passwordsMatch(), }" type="password" v-model="passwordConfirm" class="uk-input" placeholder="Confirm Password" />
          </div>
        </div>

        <i>Password must be 8 characters or longer, and it can't be your email</i>

        <div class="uk-margin">
          <button @click="register()" class="uk-button uk-button-primary">Register</button>
          &nbsp;
          <div v-if="loading" uk-spinner></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data() {
    return {
      email: '',
      displayName: '',
      password: '',
      passwordConfirm: '',
      loading: false,
    }
  },

  mounted() {
    window.firebase = firebase;
  },

  methods: {
    validEmail() {
      if (this.email.indexOf('@') == -1) {
        return false;
      }
      let parts = this.email.split('@');
      return (parts[0].length > 0 && parts[1].length > 0);
    },

    passwordsMatch() {
      return this.validPassword() && (this.password == this.passwordConfirm);
    },

    validPassword() {
      if (this.password.length >= 8 && this.password != this.email) {
        return true;
      }
      return false;
    },

    setDisplayName() {
      firebase.auth().currentUser.updateProfile({
        displayName: this.displayName
      })
    },

    register() {
      this.loading = true;

      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          // Success
          firebase.auth().currentUser.sendEmailVerification();
          this.setDisplayName();
          this.$parent.notify("Account created. Please verify your email.", 'success');
          this.$router.push('/');
        })
        .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          this.$parent.notify('The password is too weak.', 'danger');
        } else {
          this.$parent.notify(errorMessage, 'danger');
        }
        console.log(error);
        this.loading = false;
      });

    }
  }
}
</script>


<style scoped>
  #fullContainer {
    height: 100vh;
    width: 100vw;
  }

  #loginCard {
    width: 25vw;
  }

  .inline-width-fix {
    width: 100%;
  }
</style>
