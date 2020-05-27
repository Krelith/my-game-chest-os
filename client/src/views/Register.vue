<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="4" offset-md="4">
          <h1 class="app-display-1">REGISTER</h1>
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
          <v-text-field v-model="email" label="Email Address" outlined type="email"></v-text-field>

          <v-text-field v-model="password" label="Password" outlined type="password"></v-text-field>

          <v-text-field
            v-model="confirm"
            label="Confirm Password"
            outlined
            type="password"
            @keyup.enter="registerUser"
          ></v-text-field>

          <v-btn block class="app-colour" dark text @click="registerUser">REGISTER MY ACCOUNT</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router/index";
import { mapActions } from "vuex";
export default {
  name: "Register",
  data: () => {
    return {
      email: "",
      password: "",
      confirm: ""
    };
  },
  methods: {
    ...mapActions(["addMessage", "resetMessagesState"]),
    registerUser() {
      this.resetMessagesState(); // Reset any previous errors/messages

      // Validate all fields have been completed
      if (!(this.email && this.password && this.confirm)) {
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
        .post("/registerUser", {
          email: this.email,
          password: this.password
        })
        .then(response => {
          // console.log(response);
          if (response && response.data) {
            if (response.data.success) {
              router.push("/");
              this.addMessage({ type: "success", msg: response.data.msg });
            } else {
              this.addMessage({ type: "error", msg: response.data.msg });
            }
          }
        })
        .catch(err => console.log(`ERROR: ${err}`));
    }
  }
};
</script>

<style></style>
