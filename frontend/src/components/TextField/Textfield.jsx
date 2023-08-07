import React from 'react'
import styles from "./Textfield.module.css"
const Textfield = (props) => {
  return (
    <div className={styles.textfiledWraper}>
      <div className={styles.inputLabel}>
     
        <label htmlFor="name">{props.name}</label>
        <input {...props} />
         {props.error && <div className={styles.paragraph}><p className={styles.errorMessage}>{props.errormessage}</p></div> }
      
      </div>
    </div>
  )
}

export default Textfield
