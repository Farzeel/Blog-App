import * as yup from 'yup';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/
const message = ' at least 1 uppercase letter,1 lowercase letter and 1 number';

const signUpSchema = yup.object().shape({
    name: yup.string().min(3).max(20).required('Name is required'),
    username: yup.string().min(5).max(30).required("username is required"),
    email: yup.string().email("enter a valid email").required('Email is required'),
    password: yup.string().min(8).max(20).matches(passwordPattern,{message:message}).required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match').required('Confirm password is required')
});

export default signUpSchema;