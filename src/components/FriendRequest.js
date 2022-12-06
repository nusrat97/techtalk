import React, { useEffect, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { getDatabase, ref, set, onValue, push, remove  } from "firebase/database";
import { getAuth } from "firebase/auth";
import {Alert } from '@mui/material'

const FriendRequest = () => {
  const auth = getAuth();
  const db = getDatabase();

  let [friendRequest,setFriendRequest] = useState ([])
  console.log(friendRequest)

  useEffect (()=>{
    const friendRequestRef = ref(db, 'friendrequest/');
    onValue(friendRequestRef, (snapshot) => {
      let friendRequestArr = []
      snapshot.forEach((item)=>{
        console.log('random id',item.key)
      if(item.val().receiverid === auth.currentUser.uid){
        friendRequestArr.push({
          id : item.key,
          sendername :item.val().sendername,
          senderid :item.val().senderid,
          receiverid :item.val().receiverid,
          receivername :item.val().receivername
        })
      }
      })
      setFriendRequest(friendRequestArr)
    });
  },[])

  let handleAcceptFriend = (friend) =>{
    set(push(ref(db, 'friends')), {
      id : friend.id,
      sendername :friend.sendername,
      senderid :friend.senderid,
      receiverid :friend.receiverid,
      receivername :friend.receivername ,
      date :`${new Date().getDate()} /${new Date().getMonth()+1} /${new Date().getFullYear()}`     
    }).then (()=>{
      remove(ref(db,'friendrequest/' + friend.id))
    })
  }

  return (
    <div className='grouplist friendrequest'>
      <h2>Friend  Request</h2>
        <div className='dotsicon'>
            <BiDotsVerticalRounded/>
        </div>
      {friendRequest.map(item =>(
        <div className='box'>
          <div className='img'>
            <img src='./assets/images/friendrequest.png' alt='friendrequest'/>
          </div>
          <div className='name'>
            <h1>{item.sendername}</h1>
            <h4> Hi Guys, Whatup!</h4>
          </div>
          <div className='button'>
            <button onClick={() => handleAcceptFriend(item)}>Accept</button>
          </div>
        </div>
      ))}
      {friendRequest.length === 0 &&
         <Alert style={{marginTop: "20px"}} severity="info">No Friend Request Here!</Alert>
      }
      

    </div>
  )
}

export default FriendRequest