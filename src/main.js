import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import 'uikit';

import "@/firebaseConfig.js"

Vue.config.productionTip = false
Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createPersistedState({ paths: ['user'] })],
  state: {
    user: {}
  },
  mutations: {
    setCurrentUser(state, payload) {
      state.user = payload.user;
    },

    logout(state, router) {
      state.user = {};
      router.push("/login");
    }
  }
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = store.state.user;

  if (requiresAuth && !currentUser.email) {
    next('/login')
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
