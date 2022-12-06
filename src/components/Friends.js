import React, { useEffect, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import {Alert } from '@mui/material'
import { BiBlock } from 'react-icons/bi';
import { TiMessages } from 'react-icons/ti';
import { useDispatch } from 'react-redux'
import {activeChat} from "../slice/activeChatSlice"

const Friends = (props) => {
  const auth = getAuth();
  const db = getDatabase();
  const dispatch = useDispatch();
  
  let [friends,setFriends] = useState([])

  useEffect (()=>{
    const friendsRef = ref(db, 'friends');
    onValue(friendsRef, (snapshot) => {
      let friendsArray = []
      snapshot.forEach(item =>{
        if(auth.currentUser.uid === item.val().receiverid || auth.currentUser.uid === item.val().senderid){
          friendsArray.push({...item.val(), key:item.key})
        }
      })
      setFriends(friendsArray)
    });
  },[])

  let handleBlockFriend = (item)=>{
    console.log(item)
    auth.currentUser.uid === item.senderid
      ? set(push(ref(db, 'block')), {
          block: item.receivername,
          blockid: item.receiverid,
          blockby: item.sendername,
          blockbyid: item.senderid,
          date : `${new Date().getDate()} /${new Date().getMonth()+1} /${new Date().getFullYear()}`,
       }).then(() =>{
          remove(ref(db, "friends/" + item.key))
       })
      : set(push(ref(db, 'block')), {
          block: item.sendername,
          blockid: item.senderid,
          blockby: item.receivername,
          blockbyid: item.receiverid,
          date : `${new Date().getDate()} /${new Date().getMonth()+1} /${new Date().getFullYear()}`,
        }).then(() =>{
           remove(ref(db, "friends/" + item.key))
        })
  }

  let handleActiveChat=(item)=>{
    let userInfo = {};
    if(item.receiverid === auth.currentUser.uid){
      userInfo.id = item.senderid;
      userInfo.name = item.sendername;
      userInfo.status = "single";
    }else{
      userInfo.id = item.receiverid;
      userInfo.name = item.receivername;
      userInfo.status = "single";
    }
    dispatch(activeChat(userInfo))
  }
  

  return (
    <div className='grouplist friendlist'>
      <h2>{friends.length} {friends.length >1 ? 'Friends' : 'Friend'} </h2>
        <div className='dotsicon'>
            <BiDotsVerticalRounded/>
        </div>

      {friends.length === 0 &&
        <Alert style={{marginTop: "20px"}} severity="info">You Have No Friends!</Alert>
      }

      {friends.map(item=>(
        <div className='box' onClick={()=>handleActiveChat(item)}>
          <div className='img'>
            <img src='./assets/images/friends.png' alt='friends-pic'/>
          </div>
          <div className='name'>
            {auth.currentUser.uid === item.senderid
            ?
            <h1>{item.receivername}</h1>
            :
            <h1>{item.sendername}</h1>
            }
            <h4> Sure!</h4>
          </div>
          
          
          <div className='button'>
            {props.item==="date"
            ?
            <div className='block'>
              <p>{item.date}</p>
              <button onClick={()=>handleBlockFriend(item)}>Block</button>
            </div>
            :
            <div className='button'>
                <button><TiMessages/></button>
            </div>
            }
          </div>
        
          
          

        </div>
      ))}
      

    </div>
  )
}

export default Friends