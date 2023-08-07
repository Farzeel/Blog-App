import React, { useState,useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate ,useParams} from 'react-router-dom';
import { createComment, DeleteBlog, getBlogById, getCommentById } from '../../api/internal';
import styles from "./BlogDetail.module.css"
import {BiSolidEdit} from "react-icons/bi"
import{MdDelete} from "react-icons/md"
import Comment from '../../components/comments/Comment';
import { TailSpin } from 'react-loader-spinner';
import swal from 'sweetalert'
const BlogDetail = () => {
    const [blogdetail, setblogdetail] = useState([]);
    const [comments, setcomments] = useState([]);
    const [ownblog, setownblog] = useState(false);
    const [newcomment, setnewcomment] = useState("");
    const [reload, setreload] = useState(false);
    const [commentloading, setcommentloading] = useState(false);
    const [blogdetailoading, setblogdetailoading] = useState(false);
  

    const param = useParams();
    const blogId = param.id;
    const authorId = useSelector(state =>state.user._id);
    const username = useSelector(state =>state.user.username);
    const navigate = useNavigate();

    useEffect(() => {
     
        setcommentloading(true)
       const getcommentdetails =  async ()=>{

         const commentbyid = await getCommentById(blogId);
         if(commentbyid.status === 200){
            setcomments(commentbyid.data.data.reverse());
            setcommentloading(false)
            
         }   
         else if(commentbyid.code === "ERR_BAD_REQUEST"){
              
            swal({
              title: commentbyid.response.data.message,
              icon: "error",
              timer: 2000,
              buttons: false,
             
            });
            setcommentloading(false)
    
      }
          
          
       }
       getcommentdetails();
    }, [reload] );
    useEffect(() => {
       
        const getblogdetails =  async ()=>{
            setblogdetailoading(true)
            let blogdetails = await getBlogById(blogId);
            if(blogdetails.status === 200) {
                setownblog(username === blogdetails.data.blog.Author_UserName && true)
                setblogdetail(blogdetails.data.blog) 
                setblogdetailoading(false)
                
            }
            else if(blogdetails.code === "ERR_BAD_REQUEST"){
              
                swal({
                  title: blogdetails.response.data.message,
                  icon: "error",
                  timer: 2000,
                  buttons: false,
                 
                });
                setblogdetailoading(false)
        
          }
            
        }
        getblogdetails();
    }, []);
    const postHandler = async()=>{
       setcommentloading(true)
        
        const data = {
            content:newcomment,
            author:authorId,
            blog:blogId
        };
        let createcomment = await createComment(data)
        if(createcomment.status === 201) {
                        setnewcomment("")
                        setreload(!reload)
                    }
    };
    const deleteblogbyid = async()=>{
    const response = await DeleteBlog(blogId); 
    if(response.status === 200) {
        navigate("/blog")
    }
    };
    const postcomment = (e)=>{
        if(e.key==="Enter") {
            postHandler()
    }
}
  return (
    <>
 <div className={styles.wraper}>
   {blogdetailoading ? <div className={styles.rightcenter}><TailSpin height={28}/></div>:<div className={styles.right}>
    <h1 className={styles.title}>{blogdetail.title}</h1>
    <p className={styles.date}>{new Date(blogdetail.createdAt).toLocaleString()}</p>
    <p className={styles.author}>@{blogdetail.Author_Name}</p>
    {ownblog &&<div className={styles.twobtn}>
         <button onClick={()=>navigate(`/blog-update/${blogId}`)} className={styles.edit}><BiSolidEdit className={styles.editicon} size={20}/>Edit This Post</button>
        <button onClick={deleteblogbyid} className={styles.delete}><MdDelete className={styles.deleteicon} size={20}/>Delete Post</button>
    </div>}
    <img src={blogdetail.photo} alt="" />
    <p className={styles.content} dangerouslySetInnerHTML = {{__html:blogdetail.content}}/>
        
   </div>}
   <div className={styles.left}>
    <div className={styles.comenthandle}> 
        <input onKeyUp={postcomment} value={newcomment} onChange={(e)=>setnewcomment(e.target.value)} placeholder="write Comment Here"/>
        <button disabled={newcomment===""} onClick={postHandler} className={styles.post}>post</button>
        </div>
   
    {commentloading?<div className={styles.leftcenter}><TailSpin height={28}/></div>:<Comment comments={comments}/>}
   
 
 

   </div>
    </div>
    </>
  )
}

export default BlogDetail
