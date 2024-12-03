<template>
  <div
    v-if="reg_show_alert"
    class="alert text-center font-weight-bold mb-4"
    :class="reg_alert_variant"
    role="alert"
  >
    {{ reg_alert_msg }}
  </div>

  <Form :validation-schema="schema" @submit="register" :initial-values="userData">
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <Field id="name" type="text" name="name" class="form-control" placeholder="Enter your name" />
      <ErrorMessage name="name" class="form-text text-danger" />
    </div>

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
      <label for="age" class="form-label">Age</label>
      <Field id="age" type="number" name="age" class="form-control" placeholder="Enter your age" />
      <ErrorMessage name="age" class="form-text text-danger" />
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <Field type="password" name="password" :bails="false" v-slot="{ field, errors }">
        <input
          id="password"
          type="password"
          class="form-control"
          placeholder="Enter your password"
          v-bind="field"
        />
        <div class="form-text text-danger" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </Field>
    </div>

    <div class="mb-3">
      <label for="confirm_password" class="form-label">Confirm Password</label>
      <Field
        id="confirm_password"
        type="password"
        name="confirm_password"
        class="form-control"
        placeholder="Confirm your password"
      />
      <ErrorMessage name="confirm_password" class="form-text text-danger" />
    </div>

    <div class="form-check mb-3">
      <Field type="checkbox" name="tos" value="1" class="form-check-input" id="tos" />
      <label for="tos" class="form-check-label">Accept terms of service</label>
      <ErrorMessage name="tos" class="form-text text-danger" />
    </div>

    <button type="submit" class="btn btn-primary w-100" :disabled="reg_in_submission">
      Submit
    </button>
  </Form>
</template>

<script>
import registerSchema from '@/schemas/registerSchema'
import useAuthStore from '@/stores/auth'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { mapActions } from 'pinia'

export default {
  name: 'RegisterForm',
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      schema: registerSchema,
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'alert-primary',
      reg_alert_msg: 'Please wait! Your account is being created.',
    }
  },
  computed: {
    ...mapActions(useAuthStore, ['signIn']),
  },
  methods: {
    async register(values) {
      this.reg_show_alert = true
      this.reg_in_submission = true
      this.reg_alert_variant = 'alert-primary'
      this.reg_alert_msg = 'Please wait! Your account is being created.'

      try {
        await this.authStore.signup(values)
      } catch (error) {
        console.log(error)
        this.reg_in_submission = false
        this.reg_alert_variant = 'alert-danger'
        this.reg_alert_msg = 'An unexpected error occurred. Please try again later.'
        return
      }

      this.reg_alert_variant = 'alert-success'
      this.reg_alert_msg = 'Success! Your account has been created.'
    },
  },
}
</script>
