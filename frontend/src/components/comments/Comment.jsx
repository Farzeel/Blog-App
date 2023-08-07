import React from 'react'
import styles from "./Comment.module.css"

const Comment = ({comments}) => {

  return (
    comments.length===0 ? <div><p>No comments yet</p></div>
        :comments.map(comment=><div key={comment._id} className={styles.comentwraper}>
          <h3 className={styles.name}>{comment.AuthorUserName}</h3>
          <p className={styles.content}>{comment.content}</p>
          <p className={styles.date}>{new Date(comment.createdAt).toLocaleString()}</p>
        </div>)
  )
}

export default Comment

