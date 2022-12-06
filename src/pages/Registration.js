import React, { useState } from 'react'
import {Grid,TextField,Button,Collapse,Alert,IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { Link,useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword,sendEmailVerification,updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {
    const auth = getAuth();
    const db = getDatabase();
    let navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    
    let [name,setName] = useState("")
    let [email,setEmail] = useState("")
    let [password,setPassword] = useState("")
    let [confirmpass,setConfirmpass] = useState("")

    let [nameerr,setNameerr] = useState("")
    let [emailerr,setEmailerr] = useState("")
    let [passworderr,setPassworderr] = useState("")
    let [confirmpasserr,setConfirmpasserr] = useState("")
    let [passwordlengtherr,setPasswordlengtherr] = useState("")
    let [matchpassword,setMatchpassword] = useState("")

    let [exitsemailerr,setExitsemailerr] = useState("")


    let handleClick = ()=>{
        if(!name){
            setNameerr('Please Enter Your Name')
        }else if(!email){
            setEmailerr('Please Enter Your Email')
            setNameerr('')
        }else if(!password){
            setPassworderr('Please Enter Your Password')
            setEmailerr('')
        }else if(password.length < 8){
            setPasswordlengtherr('Password must greater than or equal to 8 digit')
            setPassworderr('')
        }else if(!confirmpass){
            setConfirmpasserr('Please Enter Your Confirm Password')
            setPasswordlengtherr('')
        }else if(password !== confirmpass){
            setConfirmpasserr('') 
            setMatchpassword('Password not matched')     
        }else{
            setMatchpassword('')
            createUserWithEmailAndPassword(auth,email,password).then((user)=>{
                sendEmailVerification(auth.currentUser)
                .then(() => {
                    updateProfile(auth.currentUser, {
                        displayName: name
                      }).then(() => {
                        console.log('name set')
                        set(ref(db, 'users/' + auth.currentUser.uid), {
                            username: name,
                            email: email,
                          });
                      }).catch((error) => {
                        console.log(error)
                      });
                });           
                
                navigate('/login')
            }).catch((error)=>{
                const errorCode = error.code;
                if (errorCode.includes('email')){
                    setExitsemailerr('Email Already in Use .Please Try Another Email')
                    setOpen(true)
                }
            })
        }
    }


  return (
    <section className='registration-part'>
        <Grid container spacing={2}>
        <Grid item xs={6}>
            <div className='box'>
                <div className='left'>
                    <h2>Get started with easily register</h2>
                    <p>Free register and you can enjoy it</p>
                    <Collapse style={{marginTop: '20px',marginBottom: '-15px'}} in={open}>
                        <Alert
                        variant="filled" severity="error"
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        >
                        {exitsemailerr}
                        </Alert>
                    </Collapse>

                    <TextField
                        helperText={nameerr}
                        id="demo-helper-text-misaligned"
                        label="Full Name"
                        style={{width: '360px',marginTop: '30px'}}
                        type='text'
                        onChange={(e)=> setName(e.target.value)}
                    /> <br/>
                    <TextField
                        helperText={emailerr}
                        id="demo-helper-text-misaligned"
                        label="Enter Email"
                        style={{width: '360px',marginTop: '20px'}}
                        type='email'
                        onChange={(e)=> setEmail(e.target.value)}
                    /> <br/>
                    <TextField
                        helperText={passworderr ? passworderr : passwordlengtherr ? passwordlengtherr : ""}
                        id="demo-helper-text-misaligned"
                        label="Password"
                        style={{width: '360px',marginTop: '20px'}}
                        type='password'
                        onChange={(e)=> setPassword(e.target.value)}
                    /> <br/>
                    <TextField
                        helperText={confirmpasserr ? confirmpasserr : matchpassword ? matchpassword : ""}
                        id="demo-helper-text-misaligned"
                        label="Confirm Password"
                        style={{width: '360px',marginTop: '20px'}}
                        type='password'
                        onChange={(e)=> setConfirmpass(e.target.value)}
                    /> <br/>
                    <Button onClick={handleClick} style={{marginTop: '20px',padding: '10px 0',width: '360px',borderRadius:'86px',background: '#5F35F5'}} variant="contained">Sign Up</Button>

                    <p className='msg'>Already have an account ? <Link to="/login">Login</Link> </p>
                </div>
            </div>
        </Grid>
        
        <Grid item xs={6}>
            <img style={{width:'100%', height:'100vh'}} src='./assets/images/registration.png' alt='registration-pic'/>
        </Grid>
        </Grid>
    </section>
  )
}

export default Registration