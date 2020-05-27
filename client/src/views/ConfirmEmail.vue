<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" offset-md="4">
        <h1 class="app-display-1">CHANGE PASSWORD</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" offset-md="4">
        <!-- Info -->
        <v-alert type="info">
          Your password must be at least 8 characters long. Make it more secure by
          including uppercase and lowercase characters, numbers, and special
          characters like '$' or '%'
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" offset-md="4">
        <v-text-field v-model="password" label="Password" outlined type="password"></v-text-field>
        <v-text-field
          v-model="confirm"
          label="Confirm Password"
          outlined
          type="password"
          @keyup.enter="reset"
        ></v-text-field>
        <v-btn block class="app-colour" dark text @click="reset">CHANGE PASSWORD</v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="awaitingResponse" max-width="150px" persistent>
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
  </v-container>
</template>

<script>
import axios from "axios";
import router from "../router/index";
import { mapActions } from "vuex";
export default {
  name: "ConfirmEmail",
  data: () => {
    return {
      password: "",
      confirm: "",
      awaitingResponse: false
    };
  },
  methods: {
    ...mapActions(["addMessage", "resetMessagesState"]),
    reset() {
      this.resetMessagesState(); // Reset any previous errors/messages

      // Validate all fields have been completed
      if (!(this.password && this.confirm)) {
        this.addMessage({
          type: "error",
          msg: "All fields are required."
        });
        return;
      }

      // Validate new password is at least 8 characters
      if (this.password.length < 8) {
        this.addMessage({
          type: "error",
          msg: "New password must be at least 8 characters long."
        });
        return;
      }

      // Validate proposed new password matches with confirmation
      if (this.password !== this.confirm) {
        this.addMessage({
          type: "error",
          msg: "Your new and confirmed passwords do not match."
        });
        return;
      }

      this.awaitingResponse = true;

      axios
        .post("/resetPassword", {
          code: this.$route.params.code,
          password: this.password
        })
        .then(response => {
          // Check for confirmation status
          if (response && response.data && response.data.success) {
            // password has been reset
            this.awaitingResponse = false;
            router.push("/");
            this.addMessage({ type: "success", msg: response.data.msg });
          } else {
            this.awaitingResponse = false;
            router.push("/");
            this.addMessage({ type: "error", msg: response.data.msg });
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style>
</style>