<template>
  <div>
    <!-- Banner needs to be above the container -->
    <v-img
      v-if="!loading"
      :src="gameData.image.original_url"
      :height="$vuetify.breakpoint.xs ? 150 : 350"
      alt="game-img"
      style="position: relative"
    >
      <h1 v-if="!$vuetify.breakpoint.xs" class="app-display-1 game-title">{{ gameData.name }}</h1>
    </v-img>

    <v-container>
      <div class="content" v-if="!loading">
        <v-row>
          <v-col>
            <h1 v-if="$vuetify.breakpoint.xs" class="app-display-1">{{ gameData.name }}</h1>
          </v-col>
        </v-row>

        <v-row v-if="gameData.screenshots && gameData.screenshots.length > 0">
          <v-col v-for="(screenshot, i) in gameData.screenshots" :key="i" cols="12" lg="4">
            <v-img contain :src="screenshot.fullRes"></v-img>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" lg="8">
            <v-card v-if="!$vuetify.breakpoint.lgAndUp" style="margin-bottom: 10px">
              <v-card-title>OpenCritic Average</v-card-title>
              <v-card-text>
                <div class="scoremeter-container" v-if="gameData.averageScore">
                  <div
                    class="scoremeter-value"
                    :style="{width: `${gameData.averageScore}%`}"
                    :class="{ 'score-high': parseInt(gameData.averageScore) > 69, 'score-mid': parseInt(gameData.averageScore) > 39 && parseInt(gameData.averageScore) < 70, 'score-low': parseInt(gameData.averageScore) < 40 }"
                  ></div>
                </div>
                <br />
                <h2 class="app-title" v-if="gameData.averageScore">{{ gameData.averageScore }} / 100</h2>
                <p class="app-title" v-else>No reviews available.</p>
              </v-card-text>
              <v-img :src="gameData.image.original_url" contain width="100%"></v-img>
            </v-card>

            <p v-html="gameData.deck"></p>
            <!-- use v-html in case the deck has things like &nbsp; or &amp; -->
            <div class="trailer-container" v-if="gameData.trailers && gameData.trailers.length > 0">
              <p>
                <b>Trailer</b>
              </p>
              <iframe
                :width="$vuetify.breakpoint.smAndUp ? 560 : '100%'"
                :height="$vuetify.breakpoint.smAndUp ? 315 : 200"
                :src="gameData.trailers[0].externalUrl.replace('watch?v=', 'embed/')"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
              <br />
              <br />
            </div>
            <p>
              <b>Original release</b>
              <br />
              {{ gameData.original_release_date | showYearOnly }}
            </p>
            <p>
              <b>Platforms</b>
              <span
                style="margin-left: 10px; color: #3f51b5; cursor: pointer"
                @click="editPlatforms"
                v-if="owned"
              >Edit</span>
              <br />
              <span v-for="platform in gameData.platforms" :key="platform.id">
                {{ platform.name }}
                <v-chip
                  v-if="platform.owned"
                  x-small
                  label
                  color="indigo"
                  dark
                  style="margin-left: 10px"
                >OWNED</v-chip>
                <br />
              </span>
            </p>
            <p>
              <b>Developer</b>
              <br />
              <span v-for="developer in gameData.developers" :key="developer.id">
                {{ developer.name }}
                <br />
              </span>
            </p>
            <p>
              <b>Publisher</b>
              <br />
              <span v-for="publisher in gameData.publishers" :key="publisher.id">
                {{ publisher.name }}
                <br />
              </span>
            </p>
            <p>
              <b>Genre</b>
              <br />
              <span v-for="genre in gameData.genres" :key="genre.id">
                {{ genre.name }}
                <br />
              </span>
            </p>
            <v-btn
              class="app-colour"
              dark
              text
              @click="goToWiki"
              :block="$vuetify.breakpoint.xs ? true : false"
            >
              <v-icon left>mdi-open-in-new</v-icon>WIKI ARTICLE
            </v-btn>
            <br />
            <br />
            <v-btn
              v-if="owned"
              color="red"
              dark
              elevation="0"
              @click="confirmDelete = true"
              :block="$vuetify.breakpoint.xs ? true : false"
            >
              <v-icon left>mdi-delete</v-icon>REMOVE FROM CHEST
            </v-btn>
          </v-col>

          <v-col cols="12" lg="4" v-if="$vuetify.breakpoint.lgAndUp">
            <v-card>
              <v-card-title>OpenCritic Average</v-card-title>

              <v-card-text>
                <div class="scoremeter-container" v-if="gameData.averageScore">
                  <div
                    class="scoremeter-value"
                    :style="{width: `${gameData.averageScore}%`}"
                    :class="{ 'score-high': parseInt(gameData.averageScore) > 69, 'score-mid': parseInt(gameData.averageScore) > 39 && parseInt(gameData.averageScore) < 70, 'score-low': parseInt(gameData.averageScore) < 40 }"
                  ></div>
                </div>
                <br />
                <h2 class="app-title" v-if="gameData.averageScore">{{ gameData.averageScore }} / 100</h2>
                <p class="app-title" v-else>No reviews available.</p>
              </v-card-text>
              <v-img :src="gameData.image.original_url" contain width="100%"></v-img>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <v-dialog v-model="platformSelect" max-width="600px" persistent>
      <v-card>
        <v-card-title>On which platforms do you own {{ gameData.name }}?</v-card-title>
        <v-container>
          <v-row>
            <v-col>
              <v-checkbox
                v-for="platform in gameData.platforms"
                :key="platform.id"
                :label="platform.name"
                v-model="platform.owned"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="indigo" @click="cancelEditPlatforms">CANCEL</v-btn>
          <v-btn text class="app-colour" dark @click="updatePlatforms">SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDelete" max-width="300px" persistent>
      <v-card>
        <v-container>
          <v-row>
            <v-col align="center">
              <p>Remove {{ gameData.name }}?</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col align="center">
              <v-btn color="red" dark elevation="0" @click="deleteGame">REMOVE</v-btn>
            </v-col>
            <v-col align="center">
              <v-btn color="indigo" text dark @click="confirmDelete = false">CANCEL</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleting" max-width="150px" persistent>
      <v-card>
        <v-container>
          <v-row>
            <v-col align="center">
              <p>Removing...</p>
              <v-progress-circular indeterminate color="indigo"></v-progress-circular>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="loading" max-width="150px" persistent>
      <v-card>
        <v-container>
          <v-row>
            <v-col align="center">
              <p>Loading...</p>
              <v-progress-circular indeterminate color="indigo"></v-progress-circular>
            </v-col>
          </v-row>
        </v-container>
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
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
export default {
  name: "Game",
  data: () => {
    return {
      loading: true,
      confirmDelete: false,
      deleting: false,
      platformSelect: false,
      saving: false,
      cachedPlatforms: [],
      gameData: {
        deck: "",
        guid: "",
        image: {},
        name: "",
        original_release_date: "",
        platforms: [],
        developers: [],
        publishers: [],
        genres: [],
        trailers: [],
        screenshots: [],
        averageScore: ""
      }
    };
  },
  computed: {
    owned() {
      let platforms = [];
      this.gameData.platforms.forEach(platform => {
        if (platform.owned) {
          platforms.push(platform.id);
        }
      });
      if (platforms.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions(["addMessage", "resetMessagesState"]),
    goToWiki() {
      window.open(`https://giantbomb.com/game/${this.gameData.guid}/`);
    },
    refreshData() {
      axios
        .post("/getGameByGUID", {
          guid: this.$route.params.guid
        })
        .then(response => {
          if (response && response.data && response.data.success) {
            let dataGb = response.data.data;
            // Check to see if OpenCritic has data for this game
            axios
              .post("/getOpenCriticData", {
                game: dataGb.name
              })
              .then(response => {
                if (response && response.data && response.data.success) {
                  dataGb = Object.assign(dataGb, response.data.data);
                }
                axios
                  .post("/getGameByGUIDLocal", {
                    guid: this.$route.params.guid
                  })
                  .then(response => {
                    if (response && response.data && response.data.success) {
                      // Got game from user collection
                      let gameData = Object.assign(dataGb, response.data.data);
                      this.gameData = gameData;
                      this.loading = false;
                    } else {
                      // User does not have this game in their collection
                      this.gameData = dataGb;
                      this.gameData.platforms.forEach(platform => {
                        platform.owned = false;
                      });
                      this.loading = false;
                    }
                  })
                  .catch(err => {
                    console.log(err);
                    this.addMessage({ type: "error", msg: "Database error." });
                    this.loading = false;
                  });
              })
              .catch(err => console.log(err));
          } else {
            // Couldn't find game in GB API
            this.addMessage({ type: "error", msg: "Unable to find game." });
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.addMessage({ type: "error", msg: "Database error." });
          this.loading = false;
        });
    },
    updatePlatforms() {
      this.platformSelect = false;
      this.saving = true;
      axios
        .post("/updatePlatforms", {
          guid: this.gameData.guid,
          platforms: this.gameData.platforms
        })
        .then(response => {
          if (response && response.data && response.data.success) {
            this.saving = false;
            this.resetMessagesState();
            this.addMessage({ type: "success", msg: response.data.msg });
          } else {
            this.saving = false;
            this.addMessage({ type: "error", msg: response.data.msg });
          }
        })
        .catch(err => {
          this.addMessage({ type: "error", msg: "Server error." });
        });
    },
    cancelEditPlatforms() {
      this.gameData.platforms = [];
      this.cachedPlatforms.forEach((platform, i) => {
        this.gameData.platforms[i] = {};
        Object.entries(platform).forEach(prop => {
          this.gameData.platforms[i][prop[0]] = prop[1];
        });
      });
      this.platformSelect = false;
    },
    deleteGame() {
      this.confirmDelete = false;
      this.deleting = true;
      axios
        .post("/removeGameFromCollection", {
          guid: this.gameData.guid
        })
        .then(response => {
          if (response && response.data && response.data.success) {
            this.addMessage({ type: "success", msg: response.data.msg });
            this.deleting = false;

            // Now run same script as previously run during created() to reload the page
            this.loading = true;
            this.refreshData();
          } else {
            this.addMessage({ type: "error", msg: response.data.msg });
            this.deleting = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.addMessage({ type: "error", msg: "Database error." });
          this.deleting = false;
        });
    },
    editPlatforms() {
      this.platformSelect = true;
      this.cachedPlatforms = [];
      this.gameData.platforms.forEach((platform, i) => {
        this.cachedPlatforms[i] = {};
        Object.entries(platform).forEach(prop => {
          this.cachedPlatforms[i][prop[0]] = prop[1];
        });
      });
    }
  },
  created() {
    this.resetMessagesState();
    this.refreshData();
  },
  filters: {
    showYearOnly: function(date) {
      return date ? date.slice(0, 4) : "No release date available";
    }
  }
};
</script>

<style scoped>
.game-title {
  color: #fff;
  position: absolute;
  bottom: 0;
  padding: 10px 20px;
  background-color: #3f51b5;
}

.scoremeter-container {
  display: block;
  width: 100%;
  height: 12px;
  border-radius: 5px;
}

.scoremeter-value {
  display: block;
  height: 10px;
  border-radius: 5px;
}

.score-high {
  background-color: green;
}

.score-mid {
  background-color: orange;
}

.score-low {
  background-color: red;
}
</style>