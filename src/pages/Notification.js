import React, { useEffect, useState } from 'react'
import { Grid} from '@mui/material'
import Leftbar from '../components/Leftbar';
import Search from '../components/Search';
import { List, ListItem, IconButton, ListItemText } from '@mui/material';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { getDatabase, ref, onValue } from "firebase/database";
import { useDispatch } from 'react-redux'
import { notification } from '../slice/notificationSlice'
import { Height } from '@mui/icons-material';

const Notification = () => {
    const db = getDatabase();
    let dispatch = useDispatch();
    let [notificationlist,setNotificationlist] = useState([]);

    useEffect(()=>{
        onValue(ref(db, 'notification'), (snapshot) => {
          let msgarr = []
          snapshot.forEach((item)=>{
              msgarr.push(item.val())
          });
          setNotificationlist(msgarr)
        });
        dispatch(notification(0))
    },[])
  
  return (
    <Grid container spacing={2}>
        <Grid item xs={2}>
            <Leftbar active='notification'/>
        </Grid>
        <Grid item xs={10}>
            <Search/>

            <List sx={{ width: '100%', maxWidth: 1045, bgcolor: 'background.paper', marginTop:'20px', boxShadow:'0px 5px 8px -2px rgba(0,0,0,0.15)', borderRadius:'15px', paddingLeft:'30px', paddingRight:'30px',height:'602px'}}>
            {notificationlist.map((item) => (
                <ListItem
                disableGutters
                secondaryAction={
                    <IconButton aria-label="comment">
                        <IoMdNotificationsOutline className='icon'/>
                    </IconButton>
                }
                >
                <ListItemText sx={{ borderBottom:'1px solid rgba(0, 0, 0, 0.23)', paddingBottom:'10px', marginBottom:'20px'}} primary={`Notification : ${item.username} Wants To Join ${item.groupname} Group`} />
                </ListItem>
            ))}
            </List>
        </Grid>
    </Grid>
  )
}

export default Notification