
import React, { useState } from 'react'
import signUpSchema from '../../schemas/signupSchema'
import { Link } from 'react-router-dom'
import Textfield from '../../components/TextField/Textfield'
import styles from "./Signup.module.css"
import { useFormik } from 'formik'
import { signup } from '../../api/internal'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../../store/userSlice'
import { useDispatch } from 'react-redux'
import swal from 'sweetalert'
import { TailSpin } from 'react-loader-spinner'


const Signup = () => {
 
    const dispatch = useDispatch()
    const navigate = useNavigate()
  
    const [loading, setloading] = useState(false);
  
    const handlesignUp = async () => {
        const data = {
            name:values.name,
            username:values.username,
            email:values.email,
            password:values.password,
            confirmPassword:values.confirmPassword
        }
        const response = await signup(data)
      
        if(response.status === 201){
            setloading(true)
          const user = {
            _id : response.data.user._id,
            email : response.data.user.email,
            username : response.data.user.username,
            auth: response.data.auth
          }
          dispatch(setUser(user))
          setloading(false)
         await swal({
            title: response.data.message,
            icon: "success",
            timer: 2000,
            buttons: false,
           
          });
          navigate('/login')
        }
      else if(response.code === "ERR_BAD_REQUEST"){
              
              swal({
                title: response.response.data.message,
                icon: "error",
                timer: 2000,
                buttons: false,
               
              });
  
        }
    }
   
  
    
      const {values, errors, touched, handleChange, handleBlur} = useFormik({
          initialValues:{
              name:"",
              username:"",
              email:"",
              password:"",
              confirmPassword:""
          },
          validationSchema:signUpSchema
      });
      const signupbyenter = (e) => {
        if(e.key === "Enter"){
            handlesignUp()
        }
      }
    return (
      <div className={`${styles.signupwraper} ${styles.zoom}`}>
          <div className={styles.signupheading}>
              <h1>Create Your Account</h1>
          </div>
          <Textfield
         name="name"
         value = {values.name}
         onChange={handleChange}
         onBlur={handleBlur}
         error={touched.name && errors.name}
         type="text"
         errormessage={errors.name}
         onKeyUp={signupbyenter}
         />

        <Textfield
         name="username"
         value = {values.username}
         onChange={handleChange}
         onBlur={handleBlur}
         error={touched.username && errors.username}
         type="text"
         errormessage={errors.username}
         onKeyUp={signupbyenter}
  
         />
        <Textfield
         name="email"
         value = {values.email}
         onChange={handleChange}
         onBlur={handleBlur}
         error={touched.email && errors.email}
         type="email"
         errormessage={errors.email}
         onKeyUp={signupbyenter}
  
         />
        <Textfield
        name="password"
        value = {values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && errors.password}
        type="password"
        errormessage={errors.password}
        onKeyUp={signupbyenter}
        />
        <Textfield
        name="confirmPassword"
        value = {values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.confirmPassword && errors.confirmPassword}
        type="password"
        errormessage={errors.confirmPassword}
        onKeyUp={signupbyenter}
        />
        <div className={styles.signup}>
         {loading?<div className={styles.loader}><TailSpin height={30}/></div>: <button
          onClick={handlesignUp}
          className={styles.signupbtn}
        disabled = {!values.username ||!values.password ||errors.username ||errors.password
                            ||!values.email ||!values.confirmPassword || errors.confirmPassword
                            ||!values.name ||errors.name ||errors.email}>
    
          Sign up
          </button>}
        </div>
        <div className={styles.newacountsign}>
          <p><span  className={styles.text}>Already have an Account?</span>  <Link className={styles.loginlink} to={"/login"}><span className={styles.login}>Login</span></Link></p>
        </div>
       
      </div>
    )
  
}

export default Signup
