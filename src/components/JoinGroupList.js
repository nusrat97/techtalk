import React,{ useEffect, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { getDatabase, ref, onValue } from "firebase/database";
import { TiMessages } from 'react-icons/ti';
import { HiUserGroup } from 'react-icons/hi';
import { getAuth } from "firebase/auth";
import { useDispatch } from 'react-redux'
import {activeChat} from "../slice/activeChatSlice"
import { Modal, Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Alert} from '@mui/material';


const JoinGroupList = () => {
  const auth = getAuth();
  const db = getDatabase();
  const dispatch = useDispatch();

  const [grouplist, setGrouplist] = useState([]);
  const [groupmemberlist, setGroupmemberlist] = useState([]);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
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
  
  useEffect (()=>{
    const groupsRef = ref(db, 'groups');
    onValue(groupsRef, (snapshot) => {
      let arr= []
      snapshot.forEach((item)=>{
        let groupinfo = {
          adminid: item.val().adminid,
          adminname: item.val().adminname,
          groupname: item.val().groupname,
          grouptagline: item.val().grouptagline,
          key: item.key,
        }
        arr.push(groupinfo)
      })
      setGrouplist(arr)
    });
  },[])

  let handleActiveChat=(item)=>{
    let userInfo = {
      name: item.groupname,
      groupid: item.key,
      groupadminid: item.adminid,
      status: "group",
    };
    dispatch(activeChat(userInfo))
  }

  let handleGroupMemberShow =(id)=>{
    setOpen(true)
    const groupsRef = ref(db, 'groupmembers');
    onValue(groupsRef, (snapshot) => {
      let arr= []
      snapshot.forEach((item)=>{
        if (id === item.val().groupid){
          let memberInfo = {
            adminid: item.val().adminid,
            groupid: item.val().groupid,
            userid: item.val().userid,
            username: item.val().username,
            userprofile: item.val().userprofile,
            key: item.key,
          }
          arr.push(memberInfo)
        }
      })
      setGroupmemberlist(arr)
    });
  }

  return (
    <div className='grouplist'>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <h2>Groups List</h2>
      </div>
        <div className='dotsicon'>
            <BiDotsVerticalRounded/>
        </div>

        {grouplist.map((item)=>(
          <div className='box' onClick={()=>handleActiveChat(item)}>
            <div className='img'>
              <img src="./assets/images/groupimg.png" alt='group-pic'/>
            </div>
            <div className='name'>
              <h1>{item.groupname}</h1>
              <h4> 
                {item.grouptagline}
                {item.adminid !== auth.currentUser.uid ? "" : "(Admin)"}
              </h4>
            </div>
            <div className='button'>
                <button style={{marginRight:"10px"}}><TiMessages/></button>
                <button onClick={()=>handleGroupMemberShow(item.key)}><HiUserGroup/></button>
            </div>
          </div>
      ))}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1>Total Member : {groupmemberlist.length}</h1>
          {groupmemberlist.map((item)=>(
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={item.userprofile} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.username}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                       {item.username}
                      </Typography>
                      {" — is a member of this group"}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          ))}
        </Box>
      </Modal>

      
    </div>
  )
}

export default JoinGroupList