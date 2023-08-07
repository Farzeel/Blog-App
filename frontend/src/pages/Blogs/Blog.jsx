import React, { useEffect, useState } from 'react'
import { getAllBlogs } from '../../api/internal';
import styles from "./Blog.module.css"
import { TailSpin } from 'react-loader-spinner';
import { useNavigate ,useParams} from 'react-router-dom';
import swal from 'sweetalert';


const Blog = () => {
  const param = useParams();
  const blogId = param.id;
  const navigate = useNavigate();
 
    const [blogs, setblogs] = useState([]);
    const [loading, setloading] = useState(false);

    useEffect(() => {
        (async () => {
          setloading(true);
            const response = await getAllBlogs()
            if(response.status ===200){

                setblogs(response.data.blogs.reverse()) 
                setloading(false)
                console.log(blogs)
            }
            else if(response.code === "ERR_BAD_REQUEST"){
              
              swal({
                title: response.response.data.message,
                icon: "error",
                timer: 2000,
                buttons: false,
               
              });
              setloading(false)
        }
          
        })();
        setblogs([]);
    }, []);
  return (
    <>
    {loading?<div className={styles.spinner}><TailSpin height={30}/></div>:
    blogs.length===0?<div className={styles.center}>No Blogs to show</div>:<div className={styles.blogwrapper}>
      { blogs.map(blog => 
      <div title='click to see detail' key={blog._id} className={styles.blogcart} onClick={()=>navigate(`/blog/${blog._id}`)}>
        <div className={styles.photo}><img src={blog.photo} alt="" /></div>
<div className={styles.titleandsummary}>
      <p ><span className={styles.bold}>Title:</span> <span className={styles.spantitle}>{blog.title}</span></p>
      <p ><span className={styles.bold}>published on:</span> <span className={styles.spantitle}>{new Date(blog.createdAt).toLocaleDateString()} at {new Date(blog.createdAt).toLocaleTimeString()} </span></p>
      <p><span  className={styles.bold}>Summary:</span> <span className={styles.spantitle}>{blog.summary}</span> </p></div>
      
    
      </div>    
)}
    </div>}
        
    </>
  )
}

export default Blog
