<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="app-display-1">ADD GAMES</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6" xl="4">
          <v-text-field
            label="Search for a game title"
            v-model="game"
            outlined
            clearable
            @keyup.enter="search"
          ></v-text-field>
          <v-btn
            text
            dark
            class="app-colour"
            @click="search"
            :block="$vuetify.breakpoint.smAndDown"
          >
            <v-icon left>mdi-magnify</v-icon>SEARCH
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="!searching">
        <v-col>
          <p>Found {{ results.length }} results (max 100)</p>
        </v-col>
      </v-row>

      <div v-if="!searching && results.length > 0">
        <v-row>
          <v-col cols="12" lg="6" xl="4" v-for="(result, i) in results" :key="result.id">
            <v-card>
              <v-img
                :src="result.image.original_url"
                :alt="`game-background-img-${result.name.replace(/\s/g)}`"
                :height="$vuetify.breakpoint.xs ? 150 : 300"
                :contain="false"
                style="width: 100%; position: absolute; filter: blur(3px) grayscale(70%)"
              ></v-img>
              <v-img
                :src="result.image.original_url"
                :height="$vuetify.breakpoint.xs ? 150 : 300"
                :contain="true"
                :alt="`game-img-${result.name.replace(/\s/g)}`"
              ></v-img>
              <v-card-title
                class="game-title"
                @click="route(`/game/${result.guid}`)"
              >{{ result.name }}</v-card-title>
              <v-card-text>
                <p>{{ result.original_release_date | showYearOnly }}</p>
                <v-chip
                  v-for="platform in result.platforms"
                  :key="platform.id"
                  small
                  label
                  color="indigo"
                  dark
                  class="ma-1"
                >{{ platform.name }}</v-chip>
                <br />
                <br />
                <p v-html="result.deck"></p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  dark
                  block
                  :class="{
                    'purple-btn': !results[i].added,
                    'green-btn': results[i].added
                  }"
                  @click="handleCollectionBtn(i)"
                >
                  <v-icon left v-if="!result.added">mdi-plus</v-icon>
                  <v-icon left v-else>mdi-check</v-icon>
                  <span v-if="!result.added">ADD</span>
                  <span v-else>ADDED</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <v-dialog v-model="platformSelect" max-width="600px" persistent>
      <v-card>
        <v-card-title>On which platforms do you own {{ selectedGame.name }}?</v-card-title>
        <v-container>
          <v-row>
            <v-col>
              <v-checkbox
                v-for="platform in selectedGame.platforms"
                :key="platform.id"
                :label="platform.name"
                v-model="platform.owned"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col>
              <v-checkbox label="I have played this game" v-model="havePlayed"></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="indigo" @click="platformSelect = false">CANCEL</v-btn>
          <v-btn text dark class="app-colour" @click="saveToCollection">ADD</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="saving" max-width="150px" persistent>
      <v-card>
        <v-container>
          <v-row>
            <v-col align="center">
              <p>Saving...</p>
              <v-progress-circular indeterminate color="indigo"></v-progress-circular>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="searching" max-width="150px" persistent>
      <v-card>
        <v-container>
          <v-row>
            <v-col align="center">
              <p>Searching...</p>
              <v-progress-circular indeterminate color="indigo"></v-progress-circular>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router/index";
export default {
  name: "AddGame",
  data: () => {
    return {
      game: "",
      havePlayed: true,
      results: [],
      searching: false,
      platformSelect: false, // Dialog flag
      selectedGame: {
        // For platform selection dialog, default to empty
        added: false,
        aliases: "",
        api_detail_url: "",
        date_added: "",
        date_last_updated: "",
        deck: "",
        description: "",
        expected_release_day: null,
        expected_release_month: null,
        expected_release_quarter: null,
        expected_release_year: null,
        guid: "",
        id: 0,
        image: {},
        image_tags: [],
        name: "",
        number_of_user_reviews: 0,
        original_game_rating: [],
        original_release_date: "",
        platforms: [],
        site_detail_url: ""
      },
      saving: false
    };
  },
  methods: {
    route(path) {
      router.push(path);
    },
    search() {
      this.searching = true;
      axios
        .post("/getGamesByName", {
          game: this.game
        })
        .then(response => {
          if (response && response.data && response.data.success) {
            this.results = response.data.data;

            // Get user's collection
            axios
              .post("/getUserCollection", {
                collection: "All",
                platform: "All"
              })
              .then(response => {
                if (response && response.data && response.data.success) {
                  let userCollection = response.data.data;

                  this.results.forEach((game, i) => {
                    // Check each result to see if it is in the user's library
                    game.added = false;
                    userCollection.forEach(gameInCollection => {
                      if (game.guid === gameInCollection.guid) {
                        game.added = true;
                      }
                    });
                    // Check each result for which platforms the user owns the game on
                    if (
                      game.hasOwnProperty("platforms") &&
                      Array.isArray(game.platforms) &&
                      game.platforms.length > 0
                    ) {
                      game.platforms.forEach(platform => {
                        platform.owned = false;
                      });
                    }
                    // Set the index of the game within the results array
                    game.clientIndex = i;
                  });
                  // Retrieval complete. Set searching to false.
                  this.searching = false;
                } else {
                  console.log(response.data.msg);
                }
              })
              .catch(err => console.log(err));
          }
        })
        .catch(err => (this.searching = false));
    },
    handleCollectionBtn(index) {
      if (!this.results[index].added) {
        // Trigger platform selection dialog
        this.selectedGame = this.results[index];
        this.platformSelect = true;
      }
    },
    saveToCollection() {
      this.saving = true;
      this.selectedGame.havePlayed = this.havePlayed;
      // Update DB
      axios
        .post("/addGameToCollection", {
          // we will get email from server session, no requirement for it to be passed in here
          // .clientIndex and .added will be removed from the game object by the server before sending to DB
          game: this.selectedGame
        })
        .then(response => {
          if (response && response.data && response.data.success) {
            // console.log("Promise returned.");
            this.saving = false;
          } else {
            this.saving = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.saving = false;
        });

      // Update client state
      let newArray = this.results;
      this.platformSelect = false; // Close dialog
      this.results = [];
      newArray[this.selectedGame.clientIndex] = this.selectedGame;
      newArray[this.selectedGame.clientIndex].added = true;
      this.results = newArray; // Update results state
      this.selectedGame = {
        // Reset selected game to empty state
        added: false,
        aliases: "",
        api_detail_url: "",
        date_added: "",
        date_last_updated: "",
        deck: "",
        description: "",
        expected_release_day: null,
        expected_release_month: null,
        expected_release_quarter: null,
        expected_release_year: null,
        guid: "",
        id: 0,
        image: {},
        image_tags: [],
        name: "",
        number_of_user_reviews: 0,
        original_game_rating: [],
        original_release_date: "",
        platforms: [],
        site_detail_url: ""
      };
      this.havePlayed = true;
    }
  },
  filters: {
    showYearOnly: function(date) {
      return date ? date.slice(0, 4) : "No release date available";
    }
  }
};
</script>

<style>
.purple-btn {
  background-color: #3f51b5;
  color: white;
}

.green-btn {
  background-color: #4caf50;
  color: white;
}

.v-card__title {
  word-break: normal !important; /* Fixes word-wrap bug in v-card component */
}

.game-title {
  color: #3f51b5;
  cursor: pointer;
}
</style>
