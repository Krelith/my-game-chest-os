<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="app-display-1">MY GAMES</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="5" md="4" lg="3" xl="2">
          <v-btn dark text class="app-colour" block @click="route('/add-game')">
            <v-icon left>mdi-plus</v-icon>
            <span>ADD GAMES</span>
          </v-btn>
        </v-col>
      </v-row>

      <div class="done-loading" v-if="!loading">
        <v-row>
          <v-col cols="12" sm="5" md="4" lg="3" xl="2">
            <v-select label="Collection" outlined v-model="collection" :items="collections"></v-select>
          </v-col>
          <v-col cols="12" sm="5" md="4" lg="3" xl="2">
            <v-select label="Platform" outlined v-model="platformFilter" :items="platformFilters"></v-select>
          </v-col>
        </v-row>

        <v-row v-if="!loading">
          <v-col>
            <p>Found {{ items.length }} results</p>
          </v-col>
        </v-row>

        <v-data-iterator
          :items="items"
          :items-per-page.sync="itemsPerPage"
          hide-default-footer
          :page="page"
        >
          <template v-slot:header>
            <!-- <v-row class="mt-2" align="center" justify="center"> -->
            <v-row>
              <v-col cols="12" sm="6">
                <span class="grey--text">Items per page</span>
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn dark text color="indigo" class="ml-2" v-on="on">
                      {{ itemsPerPage }}
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(number, index) in itemsPerPageArray"
                      :key="index"
                      @click="updateItemsPerPage(number)"
                    >
                      <v-list-item-title>{{ number }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
              <!-- <v-spacer></v-spacer> -->
              <v-col cols="12" sm="6" :align="!$vuetify.breakpoint.xs ? 'right' : ''">
                <span class="mr-4 grey--text">Page {{ page }} of {{ numberOfPages }}</span>
                <v-btn dark small elevation="0" color="indigo" class="mr-1" @click="formerPage">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn dark small elevation="0" color="indigo" class="ml-1" @click="nextPage">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>

          <template v-slot:default="props">
            <v-row>
              <v-col v-for="item in props.items" :key="item.name" cols="12" lg="6" xl="4">
                <v-card style="cursor: pointer; height: auto" @click="route(`/game/${item.guid}`)">
                  <v-img
                    :src="item.image.original_url"
                    :height="$vuetify.breakpoint.xs ? 150 : 300"
                    :contain="false"
                    :alt="`game-background-img-${item.name.replace(/\s/g)}`"
                    style="width: 100%; position: absolute; filter: blur(3px) grayscale(70%)"
                  ></v-img>
                  <v-img
                    :src="item.image.original_url"
                    :height="$vuetify.breakpoint.xs ? 150 : 300"
                    :contain="true"
                    :alt="`game-img-${item.name.replace(/\s/g)}`"
                  ></v-img>

                  <v-card-title>{{ item.name }}</v-card-title>
                  <v-card-text>
                    <p>{{ item.original_release_date | showYearOnly }}</p>
                    <v-chip
                      v-for="platform in item.platforms"
                      :key="platform.id"
                      small
                      :x-small="$vuetify.breakpoint.xs"
                      label
                      color="indigo"
                      dark
                      class="ma-1"
                      v-show="platform.owned"
                    >{{ platform.name }}</v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </div>
    </v-container>

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
  </div>
</template>

<script>
import router from "../router/index";
import axios from "axios";
import { bus } from "../main";
export default {
  name: "MyGames",
  data: () => {
    return {
      loading: true,
      items: [],
      itemsPerPage: 30,
      itemsPerPageArray: [30, 60, 90, 120],
      page: 1,
      collection: "Recently added",
      collections: ["Recently added", "All"],
      platformFilter: "All",
      platformFilters: []
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    }
  },
  methods: {
    route(path) {
      router.push(path);
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    }
  },
  created() {
    let checkReady = {
      collection: false,
      platforms: false
    };
    axios
      .post("/getUserCollection", {
        collection: "Recently added",
        platform: "All"
      })
      .then(response => {
        if (response && response.data && response.data.success) {
          this.items = response.data.data;
          checkReady.collection = true;
          if (checkReady.collection && checkReady.platforms) {
            this.loading = false;
          }
        } else {
          checkReady.collection = true;
          if (checkReady.collection && checkReady.platforms) {
            this.loading = false;
          }
        }
      })
      .catch(err => {
        console.log(err);
        checkReady.collection = true;
        if (checkReady.collection && checkReady.platforms) {
          this.loading = false;
        }
      });

    axios
      .get("/getUserPlatforms")
      .then(response => {
        if (response && response.data && response.data.success) {
          this.platformFilters = response.data.data.sort(function(a, b) {
            if (a === "All" || b === "All") return 1; // Ensure "All" is at the top
            if (a < b) return -1;
            else if (a > b) return 1;
            return 0;
          });
          checkReady.platforms = true;
          if (checkReady.collection && checkReady.platforms) {
            this.loading = false;
          }
        } else {
          checkReady.platforms = true;
          if (checkReady.collection && checkReady.platforms) {
            this.loading = false;
          }
        }
      })
      .catch(err => {
        console.log(err);
        checkReady.platforms = true;
        if (checkReady.collection && checkReady.platforms) {
          this.loading = false;
        }
      });
  },
  watch: {
    collection() {
      this.loading = true;
      axios
        .post("/getUserCollection", {
          collection: this.collection,
          platform: this.platformFilter
        })
        .then(response => {
          if (response && response.data && response.data.success) {
            if (this.collection === "Recently added"){
              this.items = response.data.data;
            } else {
              this.items = response.data.data.sort(function(a, b) {
              if (a.name < b.name) return -1;
              else if (a.name > b.name) return 1;
              return 0;
            });
            }
            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    platformFilter() {
      this.loading = true;
      axios
        .post("/getUserCollection", {
          collection: this.collection,
          platform: this.platformFilter
        })
        .then(response => {
          if (response && response.data && response.data.success) {
            this.items = response.data.data.sort(function(a, b) {
              if (a.name < b.name) return -1;
              else if (a.name > b.name) return 1;
              return 0;
            });
            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    }
  },
  filters: {
    showYearOnly: function(date) {
      return date ? date.slice(0, 4) : "No release date available";
    }
  }
};
</script>

<style></style>
