import Vue from 'vue';
import Vuex from 'vuex';
import users from './modules/users';
import messages from './modules/messages';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    users,
    messages
  },
  // Ensure state persists on browser refresh
  plugins: [createPersistedState({ key: 'appState' })]
});
