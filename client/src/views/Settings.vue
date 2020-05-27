<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="app-display-1">Settings</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h2 class="app-title">Change Password</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <!-- Info -->
          <v-alert type="info">
            Your password must be at least 8 characters long. Make it more secure by
            including uppercase and lowercase characters, numbers, and special
            characters like '$' or '%'
          </v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <v-text-field v-model="current" label="Current Password" outlined type="password"></v-text-field>
          <v-text-field v-model="password" label="New Password" outlined type="password"></v-text-field>
          <v-text-field
            v-model="confirm"
            label="Confirm New Password"
            outlined
            type="password"
            @keyup.enter="changePassword"
          ></v-text-field>
          <v-btn
            :block="$vuetify.breakpoint.xs"
            class="app-colour"
            dark
            text
            @click="changePassword"
          >CHANGE MY PASSWORD</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
export default {
  name: "Settings",
  data: () => {
    return {
      current: "",
      password: "",
      confirm: ""
    };
  },
  methods: {
    ...mapActions(["addMessage", "resetMessagesState"]),
    changePassword() {
      this.resetMessagesState(); // Reset any previous errors/messages

      // Validate all fields have been completed
      if (!(this.current && this.password && this.confirm)) {
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

      axios
        .post("/changePassword", {
          currentPassword: this.current,
          newPassword: this.password
        })
        .then(response => {
          if (response && response.data && response.data.success) {
            this.current = "";
            this.password = "";
            this.confirm = "";
            this.addMessage({
              type: "success",
              msg: response.data.msg
            });
          } else {
            this.current = "";
            this.password = "";
            this.confirm = "";
            this.addMessage({
              type: "error",
              msg: "An error occurred while attempting to change your password."
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.current = "";
          this.password = "";
          this.confirm = "";
          this.addMessage({
            type: "error",
            msg: "An error occurred while attempting to change your password."
          });
        });
    }
  },
  created() {
    window.scrollTo({
      top: 0,
      left: 0
    });
  }
};
</script>

<style>
</style>