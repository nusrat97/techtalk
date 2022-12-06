import React,{ useEffect, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Modal, TextField } from '@mui/material';
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const GroupList = () => {
  const auth = getAuth();
  const db = getDatabase();

  const [open, setOpen] = useState(false);
  const [groupname, setGroupName] = useState("");
  const [grouptagline, setGroupTagline] = useState("");
  const [grouplist, setGrouplist] = useState([]);
  const [groupmemberlist, setGroupmemberlist] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

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

  const inputstyle = {
    width: "100%",
    margin: "10px 0",
  };

  let handleCreateGroup = ()=>{
    set(push(ref(db, 'groups')), {
      groupname : groupname,
      grouptagline : grouptagline,
      adminid : auth.currentUser.uid,
      adminname : auth.currentUser.displayName,
      date : `${new Date().getDate()} /${new Date().getMonth()+1} /${new Date().getFullYear()}`
    }).then (()=>{
      setOpen(false)
    })
  }

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

  let handleGroupJoin = (id,g,gn,gt)=>{
    set(push(ref(db, 'groupsjoinrequest')), {
      adminid: id,
      groupid: g,
      groupname: gn,
      grouptagline: gt,
      userid: auth.currentUser.uid,
      username: auth.currentUser.displayName,
      userprofile: auth.currentUser.photoURL,
    })
    set(push(ref(db, 'notification')), {
      adminid: id,
      groupid: g,
      groupname: gn,
      grouptagline: gt,
      userid: auth.currentUser.uid,
      username: auth.currentUser.displayName,
      userprofile: auth.currentUser.photoURL,
    })
  }

  useEffect (()=>{
    const groupsRef = ref(db, 'groupmembers');
    onValue(groupsRef, (snapshot) => {
      let arr= []
      snapshot.forEach((item)=>{
        if(item.val().userid === auth.currentUser.uid){
          arr.push(item.val().groupid)
        }
      })
      setGroupmemberlist(arr)
    });
  },[])

  let handleGroupUpload =(e)=>{
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  }

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };


  return (
    <div className='grouplist'>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <h2>Groups List</h2>
        <div className='button'>
          <button onClick={handleOpen}>Creat Group</button>
        </div>
      </div>
        <div className='dotsicon'>
            <BiDotsVerticalRounded/>
        </div>

      {grouplist.map((item)=>(
        item.adminid !== auth.currentUser.uid &&
          <div className='box'>
            <div className='img'>
              <img src="./assets/images/groupimg.png" alt='group-pic'/>
            </div>
            <div className='name'>
              <h1>{item.groupname}</h1>
              <h4> {item.grouptagline}</h4>
            </div>

            {groupmemberlist.indexOf(item.key) === -1 
              ?
                <div className='button'>
                  <button onClick={()=>handleGroupJoin(item.adminid,item.key,item.groupname,item.grouptagline)}>Join</button>
                </div>
              :
              <div className='button'>
                <button>Member</button>
              </div>
            }
            
          </div>
      ))}
      
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Choose Group Image
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <div className='grouppicbox'>
                 <img className='pic' src="./assets/images/avatar.jpg" alt='group-pic'/>
                  {/* {!auth.currentUser.photoURL
                    ?
                    image
                      ?
                      <div className='img-preview'></div>
                      :
                      <img className='pic' src="./assets/images/avatar.jpg" alt='group-pic'/>
                    :
                    <img className='pic' src={image} alt='group-img'/>
                  } */}
                </div>

                <input type="file" onChange={handleGroupUpload}/>

                <Cropper
                  style={{ height: 150, width: "50%" }}
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false} 
                  onInitialized={(instance) => {
                    setCropper(instance);
                  }}
                  guides={true}
                /> 
                {image &&
                  <button onClick={getCropData}>
                    Upload Group Image
                  </button>
                }

              </Typography><br/>

          <Typography id="modal-modal-title" variant="h6" component="h2">
            Fill the field with proper information
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField 
              id="outlined-basic" 
              label="Group Name" 
              variant="outlined" 
              sx = {inputstyle}
              onChange= {(e)=>setGroupName(e.target.value)}
            />
            <TextField 
              id="outlined-basic" 
              label="Group TagLine" 
              variant="outlined" 
              sx = {inputstyle}
              onChange= {(e)=>setGroupTagline(e.target.value)}
            />
            <div className='groupbutton'>
              <button onClick={handleCreateGroup}>Create Group</button>
            </div>
          </Typography>
        </Box>
      </Modal>

    </div>
  )
}

export default GroupList