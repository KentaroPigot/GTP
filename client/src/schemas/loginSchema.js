import * as yup from 'yup'

export default {
  data() {
    return {
      schema: yup.object().shape({
        email: yup.string().required('Email is required').email('Must be a valid email'),
        password: yup
          .string()
          .required('Password is required')
          .min(5, 'Password must be at least 5 characters')
          .max(100, 'Password cannot exceed 100 characters'),
      }),
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: 'alert-primary',
      login_alert_msg: 'Please wait! We are logging you in.',
    }
  },
}
