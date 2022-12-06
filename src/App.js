import React, { useState,useEffect } from 'react';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import { BsToggleOff,BsToggleOn } from 'react-icons/bs';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ResetPassword from './pages/ResetPassword';
import Message from './pages/Message';
import Notification from './pages/Notification';
import Setting from './pages/Setting';

function App() {
  const auth = getAuth();
  let [dl,setDl] = useState(false)
  let [show,setShow] = useState(false)

  let handleDarkLight = ()=>{
    setDl(!dl)
    console.log(dl)
  }

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setShow(true)
      } else {
        setShow(false)
        setDl(false)
      }
    });
  },[])

  return (
    <>
      <div className={dl?"dark":"light"}>
        {show &&
          <div className="dlmode" onClick={handleDarkLight}>
            {dl
            ?
            <>
              <span className='off'><BsToggleOff/></span>
              <span className='text'>Switch To Light</span>
            </>
            :
            <>
              <span className='on'><BsToggleOn/></span>
              <span className='text'>Switch To Dark</span>
            </>
            }
          </div>
        }
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Registration/>}></Route>
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/home" element={<Home/>}></Route>
              <Route path="/reset" element={<ResetPassword/>}></Route>
              <Route path="/message" element={<Message/>}></Route>
              <Route path="/notification" element={<Notification/>}></Route>
              <Route path="/setting" element={<Setting/>}></Route>
            </Routes>
          </BrowserRouter>
      </div>
      
    </>
  );
}

export default App;
