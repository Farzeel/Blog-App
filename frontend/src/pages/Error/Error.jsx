import React from 'react'
import styles from "./Error.module.css"
import {Link} from "react-router-dom"

const Error = () => {
  return (
    
      <div className={styles.error}>
        
        <h2>Error 404 : Page not found</h2>
        <Link className={styles.link} to="/"><span>Go to Home</span> </Link>
  
    </div>
  )
}

export default Error
