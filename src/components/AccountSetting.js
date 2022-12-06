import React from 'react'
import { AiTwotoneEdit, AiOutlineQuestionCircle } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { GiNothingToSay } from 'react-icons/gi';
import { FaKey } from 'react-icons/fa';
import { WiMoonAltFirstQuarter } from 'react-icons/wi';
import { RiDeleteBin5Fill } from 'react-icons/ri';

const AccountSetting = () => {
  return (
    <div className='grouplist friendlist setting account'>
      <h2>Profile Settings</h2>
        
        <div className='edit'>
          <div className='profilename'>
            <FaKey/>
            <p>Change Password.</p>
          </div>
          <div className='profilename'>
            <WiMoonAltFirstQuarter/>
            <p> Theme.</p>
          </div>
          <div className='profilename'>
            <RiDeleteBin5Fill/>
            <p>Delete Account.</p>
          </div>
        </div>
        <h5>Chat App</h5>
    </div>
  )
}

export default AccountSetting