import React, { useState } from 'react'
import { TextField,Button } from '@mui/material';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  let [email,setEmail] =useState("")

  let handlePasswordReset=()=>{
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // console.log("Email send")
        navigate('/login',{
          state:{ msg : "Check Your Email For Reset Password"}
        })
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // console.log(error)
      });

  }

  return (
    <div className='forgotpassword'>
      <div className='box'>
          <h2>Reset Password</h2>
          <div className='forgot'>
            <h2>Forgot Password</h2>
            <p>For reset your password, enter your email address below</p>

            <TextField 
              id="outlined-basic" 
              label="Enter Email" 
              variant="outlined" 
              style={{width:"100%"}}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <Button  
              style={{
                marginTop: '20px',
                padding: '15px 0',
                width: '100%',
                borderRadius:'8px',
                background: '#5F35F5'
                }} 
                variant="contained"
                onClick={handlePasswordReset}
            >Reset Password</Button>
          </div>
      </div>
    </div>
  )
}

export default ResetPassword