import React, { useEffect, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import {Alert } from '@mui/material'

const BlockUser = () => {
  const auth = getAuth();
  const db = getDatabase();

  let [blocklist,setBlocklist] = useState([])

  useEffect(()=>{
    const blockRef = ref(db, 'block/');
    onValue(blockRef, (snapshot) => {
      let blockArr = []
      snapshot.forEach((item)=>{
        if(item.val().blockbyid === auth.currentUser.uid){
          blockArr.push({
            id : item.key,
            block :item.val().block,
            blockid :item.val().blockid,
            date : item.val().date
          });
        }else if(item.val().blockid === auth.currentUser.uid){
          blockArr.push({
            id : item.key,
            blockby :item.val().blockby,
            blockbyid :item.val().blockbyid,
            date : item.val().date
          });
        }
        
      })
      setBlocklist(blockArr)
    });
  },[])

  let handleUnblock =(item)=>{
    set(push(ref(db, 'friends')), {
      sendername :item.block,
      senderid :item.blockid,
      receiverid :auth.currentUser.uid,
      receivername :auth.currentUser.displayName,
      date :`${new Date().getDate()} /${new Date().getMonth()+1} /${new Date().getFullYear()}`     
    }).then (()=>{
      remove(ref(db,'block/' + item.id))
    })
  }

  return (
    <div className='grouplist friendlist mygroup'>
      <h2>Block Users </h2>
        <div className='dotsicon'>
                <BiDotsVerticalRounded/>
        </div>
        
      {blocklist.map(item=>(
          <div className='box'>
            <div className='img'>
              <img src='./assets/images/friends.png' alt='friends' />
            </div>
            <div className='name'>
              <h1>{item.block}</h1>
              <h1>{item.blockby}</h1>
              <h4> Sure!</h4>
            </div>

            {item.blockbyid 
            ?
            <div className='button'>
              <div className='block'>
                <p>{item.date}</p>
              </div>
            </div>
            :
            <div className='button'>
              <div className='block'>
                <p>{item.date}</p>
                <button onClick={()=>handleUnblock(item)}>Unblock</button>
              </div>
            </div>
            }
            
          </div>
      ))}

      {blocklist.length === 0 &&
         <Alert style={{marginTop: "20px"}} severity="info">No Block User Here!</Alert>
      }
        
      
    </div>


  )
}

export default BlockUser