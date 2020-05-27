const state = {
  isLoggedIn: false
};

const getters = {
  getIsLoggedIn: (state) => state.isLoggedIn
};

const actions = {
  toggleIsLoggedIn({ commit }, bool) {
    commit('updateIsLoggedIn', bool);
  },
  resetUsersState({ commit }) {
    commit('resetUsersState', true);
  }
};

const mutations = {
  updateIsLoggedIn: (state, bool) => {
    state.isLoggedIn = bool;
  },
  resetUsersState: (state) => {
    state.isLoggedIn = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
