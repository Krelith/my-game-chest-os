<template>
  <div>
    <v-container>
      <v-row>
        <v-col align="center">
          <!-- <h1 class="app-logo">MY GAME CHEST</h1> -->
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" offset-md="4">
          <div class="login-inputs">
            <v-text-field v-model="email" outlined label="Email Address" type="email"></v-text-field>
            <v-text-field
              v-model="password"
              outlined
              label="Password"
              type="password"
              @keyup.enter="login"
            ></v-text-field>
            <v-btn block text dark class="app-colour" @click="login">LOGIN</v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" offset-md="4">
          <div class="login-inputs">
            <v-btn
              block
              text
              dark
              class="app-colour-inverted"
              @click="register"
            >REGISTER A NEW ACCOUNT</v-btn>
            <br />
            <v-btn
              block
              text
              dark
              class="app-colour-inverted"
              @click="resetDialog = true"
            >FORGOT MY PASSWORD</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="resetDialog" max-width="500px">
      <v-card>
        <v-container>
          <v-row>
            <v-col align="center">
              <p>A reset link will be sent to your account email address</p>
              <v-text-field
                label="Email address"
                outlined
                v-model="resetEmail"
                @keyup.enter="sendResetLink"
              ></v-text-field>
              <v-btn class="app-colour" dark block text @click="sendResetLink">SEND EMAIL</v-btn>
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
              <p>Logging in...</p>
              <v-progress-circular indeterminate color="indigo"></v-progress-circular>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import router from "../router/index";
import { mapActions } from "vuex";
import { bus } from "../main";
export default {
  name: "Home",
  data: () => {
    return {
      email: "",
      password: "",
      loading: false,
      resetDialog: false,
      resetEmail: ""
    };
  },
  methods: {
    ...mapActions(["toggleIsLoggedIn", "addMessage", "resetMessagesState"]),
    login() {
      this.loading = true;
      axios
        .post("/login", {
          email: this.email,
          password: this.password
        })
        .then(response => {
          if (response && response.data) {
            if (response.data.success) {
              this.toggleIsLoggedIn(true);
              router.push("/my-games");
            } else {
              this.loading = false;
              this.resetMessagesState();
              this.addMessage({ type: "error", msg: response.data.msg });
              console.log(response.data.data);
            }
          }
        })
        .catch(err => console.log(err));
    },
    register() {
      router.push("/register");
    },
    sendResetLink() {
      axios
        .post("/sendResetLink", {
          email: this.resetEmail
        })
        .then(response => {
          if (response && response.data && response.data.success) {
            this.resetDialog = false;
            this.addMessage({ type: "success", msg: response.data.msg });
          } else {
            this.resetDialog = false;
            this.addMessage({
              type: "error",
              msg: response.data.msg
                ? response.data.msg
                : "A server error occurred."
            });
          }
        })
        .catch(err =>
          this.addMessage({ type: "error", msg: "A server error occurred." })
        );
    }
  },
  mounted() {
    bus.$emit("userLoggedOut", true);
    console.log("emitted");
  }
};
</script>

<style scoped>
.login-inputs {
  padding: 20px;
}

.app-logo {
  font-size: 4em;
  color: #3f51b5;
}
</style>
