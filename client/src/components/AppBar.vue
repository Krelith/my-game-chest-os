<template>
  <div>
    <v-app-bar app class="app-colour" dark elevation="0">
      <span
        v-if="!$vuetify.breakpoint.smAndDown"
        @click="route('/')"
        style="cursor: pointer"
      >MY GAME CHEST</span>
      <v-app-bar-nav-icon v-if="$vuetify.breakpoint.smAndDown && getIsLoggedIn" @click="openDrawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <div v-if="$vuetify.breakpoint.mdAndUp && getIsLoggedIn">
        <v-btn v-for="nav in navItems" :key="nav.name" text dark @click="route(nav.route)">
          <v-icon left>{{ nav.icon }}</v-icon>
          {{ nav.name }}
        </v-btn>
        <v-btn text dark @click="logout">
          <v-icon left>mdi-exit-to-app</v-icon>LOGOUT
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app v-if="$vuetify.breakpoint.smAndDown">
      <div class="arrow-container">
        <v-icon class="arrow" @click="drawer = false">mdi-arrow-left</v-icon>
      </div>
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item v-for="nav in navItems" :key="nav.name" @click="route(nav.route)">
            <v-list-item-icon>
              <v-icon>{{ nav.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ nav.name }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-title>LOGOUT</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-dialog v-model="loggingOut" max-width="150px" persistent>
      <v-card>
        <v-container>
          <v-row>
            <v-col align="center">
              <p>Logging out...</p>
              <v-progress-circular indeterminate color="indigo"></v-progress-circular>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import router from "../router/index";
import { mapState, mapGetters, mapActions } from "vuex";
import { bus } from "../main";
export default {
  name: "AppBar",
  data: () => {
    return {
      loggingOut: false, // progress circle for logging out process
      drawer: false,
      navItems: [
        {
          name: "MY GAMES",
          route: "/my-games",
          icon: "mdi-gamepad-variant-outline"
        },
        {
          name: "SETTINGS",
          route: "/settings",
          icon: "mdi-cog-outline"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["getIsLoggedIn"])
  },
  methods: {
    route(path) {
      this.drawer = false;
      // Check if the requested route is duplicating the current route
      if (this.$route.path !== path) {
        router.push(path);
      }
    },
    logout() {
      this.loggingOut = true;
      router.push("/logout");
    },
    openDrawer() {
      this.drawer = true;
    }
  },
  created() {
    window.scrollTo({
      top: 0,
      left: 0
    });
  },
  updated() {
    bus.$on("userLoggedOut", data => {
      this.loggingOut = false;
    });
  }
};
</script>

<style scoped>
.arrow-container {
  display: block;
  width: 100%;
  height: 45px;
  background-color: #3f51b5;
}

.arrow {
  color: #ffffff;
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
