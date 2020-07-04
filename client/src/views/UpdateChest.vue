<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="app-display-1">UPDATE MY GAME CHEST</h1>
        </v-col>
      </v-row>
      <HavePlayed v-if="editHavePlayed && !editPcLaunchers" />
    </v-container>
  </div>
</template>

<script>
import HavePlayed from "../components/updaters/HavePlayed.vue";
export default {
  name: "UpdateChest",
  components: {
    HavePlayed
  },
  data: () => {
    return {
      editHavePlayed: false,
      editPcLaunchers: false
    };
  },
  created() {
    switch (this.$route.params.type) {
      case "have-played":
        this.editHavePlayed = true;
        this.editPcLaunchers = false;
        break;
      case "pc-launchers":
        this.editHavePlayed = false;
        this.editPcLaunchers = true;
        break;
      default:
        break;
    }
  }
};
</script>

<style>
</style>