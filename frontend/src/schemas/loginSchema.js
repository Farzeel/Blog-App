import * as yup from "yup"

const logginSchema = yup.object().shape({
    username: yup.string().required("username is required"),
    password: yup.string().required("password is required"),
});

export default logginSchema;