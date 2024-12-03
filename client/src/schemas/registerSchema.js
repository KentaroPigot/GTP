import * as yup from 'yup'

export default yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Name must contain only letters and spaces'),
  email: yup.string().required('Email is required').email('Must be a valid email'),
  age: yup
    .number()
    .required('Age is required')
    .min(18, 'You must be at least 18 years old')
    .max(130, 'Age cannot exceed 130'),
  password: yup
    .string()
    .required('Password is required')
    .min(5, 'Password must be at least 5 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .notOneOf(['password'], 'Password cannot be "password"'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  country: yup
    .string()
    .required('Country is required')
    .notOneOf(['Canada'], 'Registrations from Canada are not allowed'),
  tos: yup.boolean().oneOf([true], 'You must accept the terms of service'),
})
