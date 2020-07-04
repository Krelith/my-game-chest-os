<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Game</th>
                  <th class="text-left">I have played it</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in games" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td>
                    <v-checkbox v-model="item.havePlayed"></v-checkbox>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn text dark class="app-colour" @click="saveChanges">SAVE CHANGES</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import router from "../../router/index";
export default {
  name: "HavePlayed",
  data: () => {
    return {
      games: []
    };
  },
  methods: {
    saveChanges() {
      axios
        .post("/updateCollection", {
          games: this.games
        })
        .then(response => {
          console.log("got a response");
          router.push("/my-games");
        })
        .catch(err => console.log(err));
    }
  },
  created() {
    axios
      .post("getUserCollection", {
        collection: "All",
        platform: "All"
      })
      .then(response => {
        if (response && response.data && response.data.success) {
          this.games = response.data.data;
          this.games.sort(function(a, b) {
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            return 0;
          });
          for (let i = 0; i < this.games.length; i++) {
            if (!this.games[i].hasOwnProperty("havePlayed")) {
              this.games[i].havePlayed = true;
            }
          }
        }
      })
      .catch(err => console.log(err));
  }
};
</script>

<style>
</style>