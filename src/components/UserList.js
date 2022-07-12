import React, { useEffect, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { getDatabase, ref, onValue} from "firebase/database";
import { getAuth } from "firebase/auth";

const UserList = () => {
  const auth = getAuth();
  const db = getDatabase();

  let [userlist,setUserlist] = useState([])

  useEffect(()=>{
    let userArr = []
    const userRef = ref(db, 'users');
    onValue(userRef, (snapshot) => {
      snapshot.forEach((item)=>{
        userArr.push({
          username :item.val().username,
          email :item.val().email,
          id :item.key
        })
      })
      setUserlist(userArr)
    });
  },[])

  return (
    <div className='grouplist friendlist userlist'>
      <h2>User List</h2>
        <div className='dotsicon'>
            <BiDotsVerticalRounded/>
        </div>
      
    {userlist.map(item =>(
      auth.currentUser.uid !== item.id &&
      <div className='box'>
        <div className='img'>
          <img src='./assets/images/user.png'/>
        </div>
        <div className='name'>
          <h1>{item.username}</h1>
          <h4>{item.email}</h4>
        </div>
        <div className='button'>
          <button>+</button>
        </div>
      </div>
    ))}
        
        
    
      
    </div>
  )
}

export default UserList