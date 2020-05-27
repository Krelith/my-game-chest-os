import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index'; // Import vuex store
import axios from 'axios';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import ConfirmEmail from '../views/ConfirmEmail.vue';
import MyGames from '../views/MyGames.vue';
import AddGame from '../views/AddGame.vue';
import Game from '../views/Game.vue';
import Settings from '../views/Settings.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      axios.get('loginAuth').then((response) => {
        if (response && response.data && response.data.success) {
          router.push('/my-games');
        } else {
          store.dispatch('resetUsersState', { root: true });
          next();
        }
      });
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: (to, from, next) => {
      axios.get('loginAuth').then((response) => {
        if (response && response.data && response.data.success) {
          router.push('/my-games');
        } else {
          next();
        }
      });
    }
  },
  {
    path: '/confirm-email/:code',
    name: 'ConfirmEmail',
    component: ConfirmEmail,
    beforeEnter: (to, from, next) => {
      axios.get('loginAuth').then((response) => {
        if (response && response.data && response.data.success) {
          router.push('/my-games');
        } else {
          next();
        }
      });
    }
  },
  {
    path: '/my-games',
    name: 'MyGames',
    component: MyGames
  },
  {
    path: '/add-game',
    name: 'AddGame',
    component: AddGame
  },
  {
    path: '/game/:guid',
    name: 'Game',
    component: Game
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  // Logout
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: (to, from, next) => {
      // Send logout request to server and reset all state
      axios.get('/logout').then((response) => {
        if (response.data) {
          store.dispatch('resetUsersState', { root: true });
          router.push('/');
          localStorage.clear();
        }
      });
    }
  }
];

const router = new VueRouter({
  routes
});

// Execute on any route request
router.beforeEach((to, from, next) => {
  store.dispatch('resetMessagesState', true);
  // Check that the TO path is something other than the landing page or password reset
  if (
    to.path !== '/' &&
    to.path !== '/register' &&
    to.path.indexOf('confirm-email') === -1
  ) {
    // For any route requiring logged in status, check the user is logged in. If not, redirect to login
    axios.get('/loginAuth').then((response) => {
      if (response && response.data && response.data.success) {
        next();
      } else {
        next('/');
      }
    });
  } else {
    // Page always accessible, not gated by login auth
    next();
  }
});

export default router;
