
import styles from './App.module.css';
import Navbar from './components/Navbar/Navbar';

import { BrowserRouter as Router, Routes, Route } from'react-router-dom';
import Home from './pages/Home/Home';
// import Footer from './components/Footer/Footer';
import Protected from './protected/Protected';
import Error from './pages/Error/Error';
import Login from './pages/Login/Login';
import { useSelector } from 'react-redux';
import Signup from './pages/Signup/Signup';
import Crypto from './pages/Crypto/Crypto';
import Blog from './pages/Blogs/Blog';
import Createblog from './pages/Createblog/Createblog';
import BlogDetail from './pages/blogdetail/BlogDetail';
import Updateblog from './pages/Updateblog/Updateblog';

import useAutoLogin from './hooks/useAutoLogin';
import { TailSpin } from 'react-loader-spinner';


function App() {
  const isAuth= useSelector(state =>state.user.auth);
 
 const loading =  useAutoLogin()
  return loading ?(<div className={styles.center}>...<TailSpin/></div>): (
    <div className={styles.container}>
     <Router>
      <div className={styles.layout}>
     <Navbar/>
       <Routes>
        
        <Route exact path="/"  element= {<div className={styles.main}><Home/></div>}/> 
         <Route exact path="/cryptocurrency"  element= {<div className={styles.main}><Crypto/></div>}/>
   
         <Route exact path="/blog"  element=
         {<Protected isAuth={isAuth}><div className={styles.main}><Blog/></div> </Protected>}/>
         <Route exact path="/blog/:id"  element=
         {<Protected isAuth={isAuth}><div className={styles.main}><BlogDetail/></div> </Protected>}/>
       
         <Route exact path="blog-update/:id"  element=
         {<Protected isAuth={isAuth}><div className={styles.main}><Updateblog/></div> </Protected>}/>
       
        <Route exact path="/createblog"  element= 
        {<Protected isAuth={isAuth}><div className={styles.main}><Createblog/></div>  </Protected>}/>
      
        
        <Route exact path="/login"  element= {<div className={styles.main}><Login/> </div>}/>
        <Route exact path="/signup"  element= {<div className={styles.main}><Signup/></div>}/>
        <Route path="*"  element= {<div className={styles.main}><Error/></div>}/>
       
       </Routes>
       {/* <Footer/> */}
      </div>

  </Router>
    </div>
  );
}

export default App;
