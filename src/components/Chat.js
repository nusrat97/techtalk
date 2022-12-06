import React, { useEffect, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { FaRegPaperPlane } from 'react-icons/fa';
import { AiOutlineCamera } from 'react-icons/ai';
import { useSelector } from 'react-redux'
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import {Modal,Box,Typography, Button, LinearProgress} from '@mui/material'
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import moment from 'moment/moment';
import {Alert } from '@mui/material'

const Chat = () => {
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();

  const user = useSelector((state) => state.activeChat.active);
//   console.log(user);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let [msg,setMsg] = useState("");
  let [msglist,setMsglist] = useState([]);
  let [msggrouplist,setMsggrouplist] = useState([]);
  let [file,setFile] = useState(null);
  let [progress,setProgress] = useState(null);
  let [member,setMember] = useState(true);

  let handleMsg = (e)=>{
    setMsg(e.target.value)
  }

  let handleMsgSend= ()=> {
    if (msg !== ""){
        if(user.status === "group"){
            set(push(ref(db, 'groupmsg')), {
                whosendid: auth.currentUser.uid,
                whosendname: auth.currentUser.displayName,
                whoreceive: user.groupid,
                msg: msg,
                date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`
            })
        }else{
            set(push(ref(db, 'singlemsg')), {
                whosendid: auth.currentUser.uid,
                whosendname: auth.currentUser.displayName,
                whoreceive: user.id,
                whoreceivename: user.name,
                msg: msg,
                date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`
            }).then(()=>{
                setMsg("")
            })
        }
    }
  }

  useEffect(()=>{
      onValue(ref(db, 'singlemsg'), (snapshot) => {
        let msgarr = []
        snapshot.forEach((item)=>{
            if(
                (item.val().whosendid === auth.currentUser.uid && item.val().whoreceive === user.id) ||
                (item.val().whosendid === user.id && item.val().whoreceive === auth.currentUser.uid)
            )
            msgarr.push(item.val())
        });
        setMsglist(msgarr)
    });
  },[user.id])

  useEffect(()=>{
    onValue(ref(db, 'groupmsg'), (snapshot) => {
      let msgarr = []
      snapshot.forEach((item)=>{
        if(item.val().whoreceive === user.groupid)
          msgarr.push(item.val())
      });
      setMsggrouplist(msgarr)
  });
},[user.groupid])

  let handleSingleImageUpload =(e)=>{
    setFile(e.target.files[0])
  }

  let handleImageUpload = ()=>{
    const singleImageRef = sref(storage, 'singleimage/+file.name');
    const uploadTask = uploadBytesResumable(singleImageRef, file);
    uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            setProgress(progress)
        }, 
        (error) => {
            console.log(error)
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            if (file !== ""){
                if(user.status === "group"){
                    console.log("aita group")
                }else{
                    console.log("aita single")
                    set(push(ref(db, 'singlemsg')), {
                        whosendid: auth.currentUser.uid,
                        whosendname: auth.currentUser.displayName,
                        whoreceive: user.id,
                        whoreceivename: user.name,
                        img: downloadURL,
                        date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`
                    }).then (()=>{
                        setFile("")
                        setOpen(false)
                        setProgress(null)
                    })
                }
            }
            });
        }
    );
  }

  useEffect(()=>{
    if(user.status === "group"){
        const groupsRef = ref(db, 'groupmembers');
        onValue(groupsRef, (snapshot) => {
            snapshot.forEach((item)=>{
                if (
                    (auth.currentUser.uid === item.val().userid && item.val().groupid === user.groupid) || (auth.currentUser.uid === item.val().adminid && item.val().groupid === user.groupid)
                ){
                    setMember(user.groupid)
                }
            })
        });
    }
  },[user])

  return (
    <>
        <div className='chat'>
            {user.status === "group" ? (
                user.groupid === member ? (
                    <div>
                        <div className='toparea'>
                            <div className='info'>
                                <div className='img'>
                                    <img src="./assets/images/profile.png" alt='group-pic'/>
                                    <div className='round'></div>
                                </div>
                                <div className='id'>
                                    <h2>{user.name}</h2>
                                    <p>Online</p>
                                </div>
                            </div>
                            <div className='dotsicon'>
                                <BiDotsVerticalRounded/>
                            </div>
                        </div>
                        <div className='chatarea'>
                            {user.status === "group"
                            ?
                            msggrouplist.map((item)=>
                                item.whosendid === auth.currentUser.uid
                                    ? (

                                        <div className='msg' style={alignRight}>
                                            <p className='name' style={dateReceive}>
                                                {item.whosendname}
                                            </p>
                                            <h3 style={msgSend}>{item.msg}</h3>
                                            <p className='date' style={dateReceive}>
                                                {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                            </p>
                                        </div>
                                      )  
                                    
                                    : (

                                        <div className='msg' style={alignLeft}>
                                            <p className='name' style={dateSend}>
                                                {item.whosendname}
                                            </p>
                                            <h5 style={msgReceive}>{item.msg}</h5>
                                            <p className='date' style={dateSend}>
                                                {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                            </p>
                                        </div>
                                      )  
                            )
                            :
                            msglist.map((item)=>
                            item.whosendid === auth.currentUser.uid
                                ?
                                    item.msg
                                    ?
                                    <div className='msg' style={alignRight}>
                                        <h3 style={msgSend}>{item.msg}</h3>
                                        <p className='date' style={dateReceive}>
                                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                        </p>
                                    </div>
                                    :
                                    <div className='msg' style={alignRight}>
                                        <div className='chatimg' style={msgSend}>
                                            <img src={item.img} alt='chat-img'></img>
                                            <p className='date' style={dateReceive}>
                                                {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                            </p>
                                        </div>
                                    </div> 
                                
                                :
                                    item.msg
                                    ?
                                    <div className='msg' style={alignLeft}>
                                        <h5 style={msgReceive}>{item.msg}</h5>
                                        <p className='date' style={dateSend}>
                                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                        </p>
                                    </div>
                                    :
                                    <div className='msg' style={alignLeft}>
                                        <div className='chatimg' style={msgReceive}>
                                            <img src={item.img} alt='chat-img'></img>
                                            <p className='date' style={dateSend}>
                                                {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                            </p>
                                        </div>
                                    </div>
                            )
                            }
                            
                        </div>
                        <div className='bottomarea'>
                            <div className='inputbox'>
                                <input onChange={handleMsg} type="text" placeholder='Message' value={msg}/>
                                <AiOutlineCamera onClick={handleOpen} className='camera'/>
                                <button onClick={handleMsgSend}>
                                    <FaRegPaperPlane/>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Alert style={{marginTop: "70px"}} variant="filled" severity="warning">You are not a member of {user.name} groups!</Alert>
                )
            ) :(
                <div>
                    <div className='toparea'>
                        <div className='info'>
                            <div className='img'>
                                <img src="./assets/images/profile.png" alt='group-pic'/>
                                <div className='round'></div>
                            </div>
                            <div className='id'>
                                <h2>{user.name}</h2>
                                <p>Online</p>
                            </div>
                        </div>
                        <div className='dotsicon'>
                            <BiDotsVerticalRounded/>
                        </div>
                    </div>
                    <div className='chatarea'>
                            {user.status === "group"
                            ?
                            msggrouplist.map((item)=>
                                item.whosendid === auth.currentUser.uid
                                    ? (

                                        <div className='msg' style={alignRight}>
                                            <p className='name' style={dateReceive}>
                                                {item.whosendname}
                                            </p>
                                            <h3 style={msgSend}>{item.msg}</h3>
                                            <p className='date' style={dateReceive}>
                                                {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                            </p>
                                        </div>
                                      )  
                                    
                                    : (

                                        <div className='msg' style={alignLeft}>
                                            <p className='name' style={dateSend}>
                                                {item.whosendname}
                                            </p>
                                            <h5 style={msgReceive}>{item.msg}</h5>
                                            <p className='date' style={dateSend}>
                                                {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                            </p>
                                        </div>
                                      )  
                            )
                            :
                            msglist.map((item)=>
                            item.whosendid === auth.currentUser.uid
                                ?
                                    item.msg
                                    ?
                                    <div className='msg' style={alignRight}>
                                        <h3 style={msgSend}>{item.msg}</h3>
                                        <p className='date' style={dateReceive}>
                                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                        </p>
                                    </div>
                                    :
                                    <div className='msg' style={alignRight}>
                                        <div className='chatimg' style={msgSend}>
                                            <img src={item.img} alt='chat-img'></img>
                                            <p className='date' style={dateReceive}>
                                                {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                            </p>
                                        </div>
                                    </div> 
                                
                                :
                                    item.msg
                                    ?
                                    <div className='msg' style={alignLeft}>
                                        <h5 style={msgReceive}>{item.msg}</h5>
                                        <p className='date' style={dateSend}>
                                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                        </p>
                                    </div>
                                    :
                                    <div className='msg' style={alignLeft}>
                                        <div className='chatimg' style={msgReceive}>
                                            <img src={item.img} alt='chat-img'></img>
                                            <p className='date' style={dateSend}>
                                                {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                                            </p>
                                        </div>
                                    </div>
                            )
                            }
                            
                        </div>
                    <div className='bottomarea'>
                        <div className='inputbox'>
                            <input onChange={handleMsg} type="text" placeholder='Message' value={msg}/>
                            <AiOutlineCamera onClick={handleOpen} className='camera'/>
                            <button onClick={handleMsgSend}>
                                <FaRegPaperPlane/>
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
            
            {/* {user.status === "group" ? (
                user.groupid === member ? (
                    <div className='bottomarea'>
                        <div className='inputbox'>
                            <input onChange={handleMsg} type="text" placeholder='Message' value={msg}/>
                            <AiOutlineCamera onClick={handleOpen} className='camera'/>
                            <button onClick={handleMsgSend}>
                                <FaRegPaperPlane/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <Alert style={{marginTop: "20px"}} variant="filled" severity="warning">You are not a member of {user.name} groups!</Alert>
                )
            ) :(
                <div className='bottomarea'>
                    <div className='inputbox'>
                        <input onChange={handleMsg} type="text" placeholder='Message' value={msg}/>
                        <AiOutlineCamera onClick={handleOpen} className='camera'/>
                        <button onClick={handleMsgSend}>
                            <FaRegPaperPlane/>
                        </button>
                    </div>
                </div>
            )
            } */}
            

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Send Image
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <input type="file" onChange={handleSingleImageUpload}/>
                </Typography>
                    {progress > 0 &&
                      <>
                        <LinearProgress variant="determinate" value={progress}/>
                        <p>{progress}%</p>
                      </>
                    }
                <Button onClick={handleImageUpload} style={{marginTop:"10px",background:"#5F35F5"}} variant="contained">Contained</Button>
                </Box>
            </Modal>
        </div>
    </>
  )
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

let msgReceive ={
    background:"#F1F1F1"
}

let msgSend ={
    background:"#5F35F5",
    color:"#fff"
}

let alignLeft ={
    justifyContent: "flex-start",
}

let alignRight ={
    justifyContent: "flex-end",
}

let dateReceive ={
    right: "0"
}

let dateSend ={
    left: "0"
}

export default Chat
