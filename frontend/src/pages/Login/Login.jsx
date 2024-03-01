import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Textfield from '../../components/TextField/Textfield'
import styles from "./Login.module.css"
import { useFormik } from 'formik'
import logginSchema from '../../schemas/loginSchema'
import { login } from '../../api/internal'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../../store/userSlice'
import { useDispatch } from 'react-redux'
import swal from 'sweetalert'
import { TailSpin } from 'react-loader-spinner'


const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState("")
 const [loading, setloading] = useState(false);

      const handleLogin = async () => {
        setloading(true)
      const data = {
        username:values.username,
        password:values.password
      }
      const response = await login(data)
      
      if(response.status === 200){
        
        const user = {
          _id : response.data.user._id,
          email : response.data.user.email,
          username : response.data.user.username,
          auth: response.data.auth
        }
        dispatch(setUser(user))
         setloading(false)
        navigate('/')
      }
      else if(response.code === "ERR_BAD_REQUEST"){
              
        swal({
          title: "invalid credentials",
          icon: "error",
          timer: 2000,
          buttons: false,
         
        });
        setloading(false)

  }
    }
 
    const {values, errors, touched, handleChange, handleBlur} = useFormik({
        initialValues:{
            username:"",
            password:""
        },
        validationSchema:logginSchema
    });
    const loginbyenter = (e)=>{
      if(e.key==="Enter") {
        handleLogin()
  }
}
  return (
    <div className={`${styles.loginwraper} ${styles.zoom}`}>
        <div className={styles.heading}>
            <h1>Login To Your Account</h1>
        </div>
        
      <Textfield
       name="username"
       value = {values.username}
       onChange={handleChange}
       onBlur={handleBlur}
       error={touched.username && errors.username}
       type="text"
       errormessage={errors.username}
       onKeyUp={loginbyenter}

       />
      <Textfield
      name="password"
      value = {values.password}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.password && errors.password}
      type="password"
      errormessage={errors.password}
      onKeyUp={loginbyenter}
      />
      <div className={styles.login}>
       {loading?<div className={styles.loader}><TailSpin height={30}/></div>: <button 
        onClick={handleLogin} 
        className={styles.loginbtn}
        disabled = {!values.username ||!values.password ||errors.username ||errors.password}
        >
        Login
        </button>}
      </div>
      <div className={styles.newacount}>
        <p><span  className={styles.text}>Dont have an Account</span>  <Link className={styles.registerlink} to={"/signup"}><span className={styles.register}>Register</span></Link></p>
      </div>
     
    </div>
  )
}

export default Login
