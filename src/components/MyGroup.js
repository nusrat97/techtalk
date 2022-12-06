import React,{ useEffect, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { getDatabase, ref, onValue, remove, set, push} from "firebase/database";
import { getAuth } from "firebase/auth";
import {Box, Modal, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Alert, Button} from '@mui/material';
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

const MyGroup = () => {
  const auth = getAuth();
  const db = getDatabase();

  const [grouplist, setGrouplist] = useState([]);
  const [groupreqlist, setGroupreqlist] = useState([]);
  const [open, setOpen] = useState(false);

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
          date : `${new Date().getDate()} /${new Date().getMonth()+1} /${new Date().getFullYear()}`
        }
        arr.push(groupinfo)
      })
      setGrouplist(arr)
    });
  },[])

  
  const handleClose = () => setOpen(false);

  const handleOpen = (group) =>{
    setOpen(true)
    const groupsRef = ref(db, "groupsjoinrequest");
    onValue(groupsRef, (snapshot) => {
      let arr2= []
      snapshot.forEach((item)=>{
        if(item.val().adminid === auth.currentUser.uid && item.val().groupid === group.key){
          let groupinfo = {
            adminid: item.val().adminid,
            groupid: item.val().groupid,
            userid: item.val().userid,
            username: item.val().username,
            userprofile: item.val().userprofile,
            key: item.key,
            date : `${new Date().getDate()} /${new Date().getMonth()+1} /${new Date().getFullYear()}`
          }
          arr2.push(groupinfo)
        }
      })
      setGroupreqlist(arr2)
    });
  };

  let handleGroupReject =(item)=>{
    remove(ref(db, "groupsjoinrequest/" + item.key));
  };

  let handleGroupAccept =(item)=>{
    set(push(ref(db, 'groupmembers')), {
      adminid: item.adminid,
      groupid: item.groupid,
      userid: item.userid,
      username: item.username,
      userprofile: item.userprofile,
      key: item.key,
    }).then(() =>{
      remove(ref(db, "groupsjoinrequest/" + item.key))
    })
  }


  return (
    <div className='grouplist friendlist mygroup'>
      <h2>My Groups </h2>
        <div className='dotsicon'>
            <BiDotsVerticalRounded/>
        </div>

        {grouplist.map((item)=>(
          item.adminid === auth.currentUser.uid &&
            <div className='box'>
              <div className='groupimgbox'>
                <img className='groupimg' src="./assets/images/groupimg.png" alt='group-pic'/>
              </div>
              <div className='name'>
                <h1>{item.groupname}</h1>
                <h4> {item.grouptagline}</h4>
              </div>
              <div className='button'>
                <div className='block'>
                  <p>{item.date}</p>
                  <button onClick={()=>handleOpen(item)}>Join info</button>
                </div>

                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    {groupreqlist.length === 0 &&
                      <Alert style={{marginTop: "20px"}} severity="info">No Group Request here!</Alert>
                    }
                    {groupreqlist.map((item)=>(
                      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar style={{width:"60px", height:"60px",marginRight: "20px"}} alt="Remy Sharp" src={item.userprofile} />
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
                              {" — Wants to join this group"}
                              <Button style={{marginRight: "10px",marginTop: "10px"}} variant="contained" onClick={()=>handleGroupAccept(item)}>Accept</Button>
                              <Button style={{marginRight: "10px",marginTop: "10px"}} variant="contained" color="error" onClick={()=>handleGroupReject(item)}>Reject</Button>
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
              
            </div>
        ))} 

    </div>
    


  )
}

export default MyGroup