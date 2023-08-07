import React from 'react'
import getNews from '../../api/external'
import { useState,useEffect } from 'react'
import { TailSpin } from 'react-loader-spinner'
import styles from './Home.module.css'
import swal from 'sweetalert'
const Home = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    
    (async ()=>{
      setLoading(true)
      try {
      const response = await getNews()
      setNews(response)
        
      } catch (error) {
        swal({
          title: "error occured please try again later", 
          icon: "error",
          timer: 2000,
          buttons: false,
         
        });
      }
      
     setLoading(false)
    })();
    // cleanup
    setNews([])
    
  }, []);

const handlelink = (url) => {
  window.open(url,"_blank")
}

  return (
    <>
    {loading?<div className={styles.articleloader}>Article laoding.....<TailSpin height={30} color="gold"/></div>:
     <> <div className={styles.articleheading}>
      <h1>Top Articles</h1>
    </div>
    <div className={styles.grid}>
      {news && news.map((item)=>
      <div onClick={()=>handlelink(item.url)} className={styles.cart} key={item.url}>
        <img src={item.urlToImage} alt={item.title} />
        <h3>{item.title}</h3>
      </div>
      )}
    </div>
    </>
    }
    </>
  )
}

export default Home
