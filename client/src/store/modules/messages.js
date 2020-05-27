const state = {
  // Custom messages, usually passed from a server response object
  messages: []
};

const getters = {
  getMessages: (state) => state.messages
};

const actions = {
  addMessage({ commit }, data) {
    commit('updateMessages', data);
  },
  resetMessagesState({ commit }) {
    commit('resetMessagesState', true);
  }
};

const mutations = {
  updateMessages: (state, data) => {
    state.messages.push(data);
  },
  resetMessagesState: (state) => {
    state.messages = [];
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
