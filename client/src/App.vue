<template>
  <v-app>
    <AppBar />
    <v-content>
      <v-alert
        v-for="(message, i) in getMessages"
        :key="i"
        :type="message.type"
        dismissible
      >{{ message.msg }}</v-alert>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import AppBar from "@/components/AppBar.vue";
import { mapGetters } from "vuex";
export default {
  name: "App",
  components: {
    AppBar
  },
  data: () => {
    return {};
  },
  computed: {
    ...mapGetters(["getMessages"])
  },
  watch: {
    // If a message is fired, scroll to top of page so user can clearly see it
    getMessages: data => {
      if (data.length > 0) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      }
    }
  }
};
</script>

<style>
* {
  font-family: "Lato", "Roboto", sans-serif !important;
}

.app-colour {
  background-color: #3f51b5 !important;
}

.app-colour-inverted {
  background-color: #fff !important;
  color: #3f51b5 !important;
}

.app-display-1 {
  font-family: "Lato", "Roboto", sans-serif !important;
  font-weight: 300;
}

.app-title {
  font-family: "Lato", "Roboto", sans-serif !important;
  font-weight: 400;
}

.v-alert {
  margin-bottom: 0 !important;
}
</style>
