<template>
  <div>
    <div
      v-if="login_show_alert"
      class="alert text-center font-weight-bold mb-4"
      :class="login_alert_variant"
      role="alert"
    >
      {{ login_alert_msg }}
    </div>

    <Form :validation-schema="schema" @submit="login">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <Field
          id="email"
          type="email"
          name="email"
          class="form-control"
          placeholder="Enter your email"
        />
        <ErrorMessage name="email" class="form-text text-danger" />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <Field
          id="password"
          type="password"
          name="password"
          class="form-control"
          placeholder="Enter your password"
        />
        <ErrorMessage name="password" class="form-text text-danger" />
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="login_in_submission">
        Submit
      </button>
    </Form>
  </div>
</template>

<script>
import loginSchema from '@/schemas/loginSchema'
import useAuthStore from '@/stores/auth'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { mapStores } from 'pinia'

export default {
  name: 'LoginForm',
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      schema: loginSchema,
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: 'alert-primary',
      login_alert_msg: 'Please wait! We are logging you in.',
    }
  },
  computed: {
    ...mapStores(useAuthStore),
  },
  methods: {
    async login(values) {
      this.login_show_alert = true
      this.login_in_submission = true
      this.login_alert_variant = 'alert-primary'
      this.login_alert_msg = 'Please wait! We are logging you in.'

      try {
        await this.authStore.login(values)
      } catch (error) {
        console.log(error)
        this.login_in_submission = false
        this.login_alert_variant = 'alert-danger'
        this.login_alert_msg = 'An unexpected error occurred. Please try again later.'
        return
      }

      this.login_alert_variant = 'alert-success'
      this.login_alert_msg = 'Success! You are now logged in.'
    },
  },
}
</script>
