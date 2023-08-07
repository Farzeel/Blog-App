import React from 'react'
import styles from "./Navbar.module.css"
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signout } from '../../api/internal'
import { resetUser } from '../../store/userSlice'


const Navbar = () => {
const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.user.auth)
const dispatch = useDispatch()
  const handleSignout = async () => {
     await signout()
    
     dispatch(resetUser())
     navigate("/login")
     
  }
  return (
   
      <>
      <nav className={styles.navbar}>
        <div>
         <NavLink to={"/"} className={styles.navlink}> <img className={styles.logo} src="https://altcoinsbox.com/wp-content/uploads/2023/02/bitcoin-gold-coin-with-BTC-logo.webp" alt="" />
         </NavLink>
        </div>
        <div className={styles.links}>
          <NavLink  className={({ isActive }) => isActive ? styles.isActive : styles.isNotActive }   to="/">Home</NavLink>
          <NavLink className={({ isActive }) => isActive ? styles.isActive : styles.isNotActive }  to="/cryptocurrency">CryptoCurrencies</NavLink>
          <NavLink className={({ isActive }) => isActive ? styles.isActive : styles.isNotActive }  to="/blog">Blogs</NavLink>
          <NavLink className={({ isActive }) => isActive ? styles.isActive : styles.isNotActive }  to="/createblog">Create New Blog</NavLink>
        </div>
        {isAuthenticated?<button onClick={handleSignout} className={styles.logout}>Log out</button>
        :<div className={styles.buttons}>
          <NavLink to={"/login"}><button className={styles.signInbtn}>Log In</button></NavLink>
          <NavLink to={"/signup"}><button className={styles.signUpbtn}>Sign Up</button></NavLink>
        </div>}
      </nav>
      <div className={styles.separator}></div>
      </>
    
  )
}

export default Navbar
