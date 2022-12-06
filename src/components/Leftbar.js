import React,{useEffect, useState} from 'react'
import { AiOutlineHome,AiOutlineCloudUpload } from 'react-icons/ai';
import { AiFillMessage } from 'react-icons/ai';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { FiSettings } from 'react-icons/fi';
import { TbLogout } from 'react-icons/tb';
import { getAuth, signOut,onAuthStateChanged, updateProfile } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom'
import {Modal,Box,Typography} from '@mui/material'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { notification } from '../slice/notificationSlice'
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as nref, onValue } from "firebase/database";
import { useDispatch, useSelector } from 'react-redux'


const Leftbar = (props) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const storage = getStorage();
    const db = getDatabase();
    let dispatch = useDispatch();
    let data = useSelector((state) => state)

    const[name,setName] = useState('')
    const[email,setEmail] = useState('')
    const[id,setId] = useState('')
    const[createtime,setcreatetime] = useState('')
    const[open,setOpen] = useState(false)
    const[open2,setOpen2] = useState(false)
    const[loading,setLoading] = useState(false)
    const[check,setCheck] = useState(false)
    let [notificationlist,setNotificationlist] = useState([]);


    const [image, setImage] = useState();
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState();

    let handleModalOpen = ()=>{
        setOpen(true)
    }
    let handleClose = ()=>{
        setOpen(false)
    }

    let handleModalOpen2 = ()=>{
        setOpen2(true)
    }
    let handleClose2 = ()=>{
        setOpen2(false)
    }

    let handleSignout = ()=>{
        signOut(auth).then(() => {
            console.log("Log Out")
            navigate('/login')
          }).catch((error) => {
            console.log(error)
          });
    }

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setName(user.displayName)
            setEmail(user.email)
            setId(user.uid)
            setcreatetime(user.metadata.creationTime)
          } 
        });
    },[check])

    let handleProfileUpload =(e) =>{
        // console.log(e.target.files[0])
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
        setLoading(true)
        if (typeof cropper !== "undefined") {
            const storageRef = ref(storage, auth.currentUser.uid)
            // console.log(cropper.getCroppedCanvas().toDataURL());
            const message4 = cropper.getCroppedCanvas().toDataURL();
            uploadString(storageRef, message4, 'data_url').then((snapshot) => {
                setLoading(false)
                setOpen2(false)
                setImage("")
                // console.log('Uploaded a data_url string!');
                // console.log(snapshot)
                getDownloadURL(storageRef)
                    .then((url) => {
                        // console.log(url)
                        updateProfile(auth.currentUser, {
                            photoURL: url
                          }).then(() => {
                            console.log("upload")
                            setCheck(!check)
                          }).catch((error) => {
                            console.log(error)
                          });
                    })
            });
        }
    };

    useEffect(()=>{
        onValue(nref(db, 'notification'), (snapshot) => {
          let msgarr = []
          snapshot.forEach((item)=>{
              msgarr.push(item.val())
          });
          setNotificationlist(msgarr)
          dispatch(notification(msgarr.length))
        });
    },[])


  return (
    <div className='leftbar'>
        <div className='profilepicbox'>
            {!auth.currentUser.photoURL
                ?
                <img className='profilepic' src="./assets/images/avatar.jpg" alt='profile-pic'/>
                :
                <img className='profilepic' src={auth.currentUser.photoURL} alt='profile-pic'/>
            }
            <div className='overlay' onClick={handleModalOpen2}>
                <AiOutlineCloudUpload/>
            </div>
        </div>
        
        <h5 onClick={handleModalOpen}>{name}</h5>
        <div className='icons'>
            <ul>
                <li className={props.active === 'home' && 'active'}>
                    <Link to = "/home">
                        <AiOutlineHome className='icon'/>
                    </Link>
                </li>
                <li className={props.active === 'msg' && 'active'}>
                    <Link to = "/message">
                        <AiFillMessage style={{color: '#BAD1FF'}} className='icon'/>
                    </Link>
                </li>
                <li className={props.active === 'notification' && 'active'}>
                    <Link to = "/notification">
                        <IoMdNotificationsOutline className='icon'/>
                        <span className='notification'>{data.notification.amount}</span>
                    </Link>
                </li>
                <li className={props.active === 'setting' && 'active'}>
                    <Link to = "/setting">
                        <FiSettings className='icon'/>
                    </Link>
                </li>
                <li onClick={handleSignout}>
                    <TbLogout className='icon'/>
                </li>
            </ul>
        </div>

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='leftbarmodal'
        >
        <Box className='leftbarbox'>
            <Typography id="modal-modal-title" variant="h6" component="h2">
               Account Information
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
               <ul className='userinfo'>
                 <li><span>Your ID: </span>{id}</li>
                 <li><span>Your Email: </span>{email}</li>
                 <li><span>Account Create Time: </span>{createtime}</li>
               </ul>
            </Typography>
        </Box>
        </Modal>


        <Modal
            open={open2}
            onClose={handleClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='leftbarmodal'
        >
        <Box className='leftbarbox'>
            <Typography id="modal-modal-title" variant="h6" component="h2">
               Change Profile Picture
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <div className='profilepicbox'>
                {!auth.currentUser.photoURL
                    ?
                    image
                        ?
                        <div className='img-preview'></div>
                        :
                        <img className='profilepic' src="./assets/images/avatar.jpg" alt='profile-pic' />
                    :
                    image
                        ?
                        <div className='img-preview'></div>
                        :
                        <img className='profilepic' src={auth.currentUser.photoURL} alt='profile-pic'/>
                }
                </div>

                <input type="file" onChange={handleProfileUpload}/>

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
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                    guides={true}
                />

                {image
                    ?
                    loading
                        ?
                        <button>
                            Uploading...
                        </button>
                        :
                        <button onClick={getCropData}>
                            Upload Profile Picture
                        </button>
                    :
                    ""
                }

            </Typography>
        </Box>
        </Modal>
    </div>
  )
}

export default Leftbar