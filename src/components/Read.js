

// import React,{ useEffect, useState } from 'react'
// import { BiDotsVerticalRounded } from 'react-icons/bi';
// import { getDatabase, ref, onValue } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { AiOutlineCloudUpload } from 'react-icons/ai';
// import {Modal,Box,Typography} from '@mui/material'
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import { getStorage, uploadString, } from "firebase/storage";

// const MyGroup = () => {
//   const auth = getAuth();
//   const db = getDatabase();
//   const storage = getStorage();

//   const [image, setImage] = useState();
//   const [cropData, setCropData] = useState("#");
//   const [cropper, setCropper] = useState();

//   const [grouplist, setGrouplist] = useState([]);
//   const[open,setOpen] = useState(false)

//   let handleModalOpen = ()=>{
//     setOpen(true)
//   }
//   let handleClose = ()=>{
//     setOpen(false)
//   }

//   const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
//   };

//   useEffect (()=>{
//     let arr= []
//     const groupsRef = ref(db, 'groups');
//     onValue(groupsRef, (snapshot) => {
//       // const data = snapshot.val();
//       // console.log(data)
//       snapshot.forEach((item)=>{
//         console.log(item.val())
//         arr.push(item.val())
//       })
//       setGrouplist(arr)
//     });
//   },[])

//   let handleGroupUpload = (e)=>{
//     console.log(e.target.files)
//     console.log(e.target.files[0])
//     e.preventDefault();
//     let files;
//     if (e.dataTransfer) {
//       files = e.dataTransfer.files;
//     } else if (e.target) {
//       files = e.target.files;
//     }
//     const reader = new FileReader();
//     reader.onload = () => {
//       setImage(reader.result);
//     };
//     reader.readAsDataURL(files[0]);
//   }

//   const getCropData = () => {
//     if (typeof cropper !== "undefined") {
//       const storageRef = ref(storage, auth.currentUser.uid);
//       // console.log(cropper.getCroppedCanvas().toDataURL());
//       const message4 = cropper.getCroppedCanvas().toDataURL();
//       uploadString(storageRef, message4, 'data_url').then((snapshot) => {
//         console.log('Uploaded a data_url string!');
//         console.log(snapshot)
//       });
//     }
//   };

//   return (
//     <div className='grouplist friendlist mygroup'>
//       <h2>My Groups </h2>
//         <div className='dotsicon'>
//             <BiDotsVerticalRounded/>
//         </div>

//         {grouplist.map((item)=>(
//           item.adminid === auth.currentUser.uid &&
//             <div className='box'>
//               <div className='groupimgbox'>
//                 {!auth.currentUser.photoURL
//                 ?
//                 <img className='groupimg' src="./assets/images/avatar.jpg" alt='group-pic' />
//                 :
//                 <img className='groupimg' src="./assets/images/avatar.jpg" alt='group-pic'/>
//                 }
//                 <div className='overlay' onClick={handleModalOpen}>
//                     <AiOutlineCloudUpload/>
//                 </div>
//               </div>
//               <div className='name'>
//                 <h1>{item.groupname}</h1>
//                 <h4> {item.grouptagline}</h4>
//               </div>
//               <div className='button'>
//                 <p>{item.date}</p>
//               </div>
              
//             </div>
//         ))} 

//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         className='groupmodal'
//       >
//         <Box sx={style}>
//           <Typography id="modal-modal-title" variant="h6" component="h2">
//             Change Group Image
//           </Typography>
//           <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//             <div className='picbox'>
//               {!auth.currentUser.photoURL
//                 ?
//                 image
//                   ?
//                   <div className='img-preview'></div>
//                   :
//                   <img className='pic' src="./assets/images/avatar.jpg" alt='group-pic'/>
//                 :
//                 <img className='pic' src={image} alt='group-img'/>
//               }
//             </div>

//             <input type="file" onChange={handleGroupUpload}/>

//             <Cropper
//               style={{ height: 150, width: "50%" }}
//               zoomTo={0.5}
//               initialAspectRatio={1}
//               preview=".img-preview"
//               src={image}
//               viewMode={1}
//               minCropBoxHeight={10}
//               minCropBoxWidth={10}
//               background={false}
//               responsive={true}
//               autoCropArea={1}
//               checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
//               onInitialized={(instance) => {
//                 setCropper(instance);
//               }}
//               guides={true}
//             /> 
//             {image &&
//               <button onClick={getCropData}>
//                 Upload Group Image
//               </button>
//             }

//           </Typography>
//         </Box>
//       </Modal>

//     </div>
    


//   )
// }

// export default MyGroup
