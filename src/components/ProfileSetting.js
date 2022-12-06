import React from 'react'
import { AiTwotoneEdit, AiOutlineQuestionCircle } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { GiNothingToSay } from 'react-icons/gi';

const ProfileSetting = () => {
  return (
    <div className='grouplist friendlist setting'>
      <h2>Profile Settings</h2>
        <div className='box'>
          <div className='img'>
            <img src='./assets/images/profile.png' alt='profile-pic'/>
          </div>
          <div className='name'>
            <h3>A B M Shawon Islam</h3>
            <h4> Stay home stay safe</h4>
          </div>

        </div>
        <div className='edit'>
          <div className='profilename'>
            <AiTwotoneEdit/>
            <p>Edit Profile Name.</p>
          </div>
          <div className='profilename'>
            <GiNothingToSay/>
            <p> Edit Profile Status Info.</p>
          </div>
          <div className='profilename'>
            <BiImageAdd/>
            <p>Edit Profile Photo.</p>
          </div>
          <div className='profilename'>
            <AiOutlineQuestionCircle/>
            <p>Help.</p>
          </div>
        </div>
        <h5>Chat App</h5>
    </div>
  )
}

export default ProfileSetting