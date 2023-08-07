import React from 'react'
import { useState } from 'react'
import { TailSpin } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../../api/internal';
import styles from "./Createblog.module.css"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import sawl from "sweetalert"




const Createblog = () => {
    const [title, setTitle] = useState("");
    const [content, setcontent ] = useState ("");
    const [photo, setphoto] = useState("");
    const [summary, setsummary] = useState("");
    const [loading, setloading] = useState(false);
    const author = useSelector(state =>state.user._id)
    const navigate = useNavigate();

    const handleSubmit =async () => {
        setloading(true);
        const data = {
            title: title,
            content: content,
            photo: photo,
            summary: summary,
            author: author
        }
        let response  =await createBlog(data)
        setloading(false);
        if(response.status ===201){
               navigate("/blog")
        }
        else if(response.code === "ERR_BAD_REQUEST"){
          sawl({
            title: response.response.data.message,
            icon: "error",
            timer: 2000,
            buttons: false,
           
          });
          console.log(response.response.data.message)
        }
          
        
        
    }

    const handlephoto=(e)=>{
           const file = e.target.files[0];
           const reader = new FileReader();
           reader.readAsDataURL(file);
           reader.onload = () => {
               setphoto(reader.result);
           }
    }
    const handlecontent = (value) => {
      
        setcontent(value);
    }

    
  return (
    <div className={`${styles.wraper} ${styles.zoom}`}>
      <div className={styles.blogHeading}>
        <h1>Create Blog</h1>
      </div>
      <div className={styles.blogtitle}>
        <label htmlFor="title">Title</label>
        <input onChange={(e)=>setTitle(e.target.value)} type="text" id="title" placeholder='Title....' />
      </div>
      <div className={styles.blogsummary}>
        <label htmlFor="summary">Summary</label>
        <textarea onChange={(e)=>setsummary(e.target.value)} type="summary" id="summary" placeholder='Summary....' />
      </div>
      <div className={styles.blogcontent}>
        <label htmlFor="content">Content</label>
       {/* <textarea onChange={(e)=>setcontent(e.target.value)} type="content" id="content" placeholder='content....' /> */}
       <ReactQuill className={styles.borderquill}  theme="snow" value={content} onChange={handlecontent}/>
      </div>
      <div className={styles.blogphoto}>
      <label htmlFor="photo">Photo</label>
      <div className={styles.straight}>
      <input onChange={handlephoto} accept="image/jpg,image/jpeg,image/png"  type="file" />
      {photo? <img src={photo} className={styles.imgs} alt="photo" /> : null}
      </div>
     
      </div>
      <div className={styles.blogbutton}>
        {loading?<div className={styles.loader}><TailSpin height={30}/></div>:
        <button disabled = {title==="" || content=="" || photo=="" || summary==""} 
        onClick={handleSubmit}>Submit</button>}
      </div>
    </div>
  )
}

export default Createblog
