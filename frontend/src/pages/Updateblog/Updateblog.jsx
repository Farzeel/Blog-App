import React from 'react'
import { useState ,useEffect} from 'react'
import { TailSpin } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { blogUpdate,getBlogById } from '../../api/internal';
import styles from "./Updateblog.module.css"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import sawl from "sweetalert"

const Updateblog = () => {

    const [title, setTitle] = useState("");
    const [content, setcontent ] = useState ("");
    const [photo, setphoto] = useState("");
    const [summary, setsummary] = useState("");
    const [loading, setloading] = useState(false);
    const author = useSelector(state =>state.user._id)
    const navigate = useNavigate();
    const param = useParams()
    const blogId = param.id;
   

    useEffect(() => {
        const getblogdetails = async () => {
            let response = await getBlogById(blogId)
            if (response.status ===200){
                setTitle(response.data.blog.title)
                setcontent(response.data.blog.content)
                setphoto(response.data.blog.photo)
                setsummary(response.data.blog.summary)
            }
        }
        getblogdetails()
    }, []);
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
    const UpdatetheBlog = async ()=>{
    
        setloading(true);

        let  data;
        if(photo.includes("http")){

            data = {
               title: title,
               content: content,
               summary: summary,
               author: author,
               blogId: blogId
           }
        }
        else{
            data = {
               title: title,
               content: content,
               summary: summary,
               author: author,
               blogId: blogId,
               photo: photo
           }
        };
        try {
            let response  =await blogUpdate(data)
          
              if(response.status ===200){
                setloading(false)
                  navigate("/blog")
              }
              else if(response.status ===400) {
                  sawl({
                    title: response.response.data.message,
                    icon: "error",
                    timer: 2000,
                    buttons: false,
                   
                  });
                  console.log(response.response.data.message)
                }
        } catch (error) {
            setloading(false)
            console.log(error)
        }
      
    }

  return (
    <div className={styles.wraper}>
      <div className={styles.blogHeading}>
        <h1>Update Blog</h1>
      </div>
      <div className={styles.blogtitle}>
        <label htmlFor="title">Title</label>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" id="title" placeholder='Title....' />
      </div>
      <div className={styles.blogsummary}>
        <label htmlFor="summary">Summary</label>
        <textarea value={summary} onChange={(e)=>setsummary(e.target.value)} type="summary" id="summary" placeholder='Summary....' />
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
        <button  onClick={UpdatetheBlog}>Update</button>}
      </div>
    </div>
  )
}

export default Updateblog
