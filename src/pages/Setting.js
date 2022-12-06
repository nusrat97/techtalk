import React from 'react'
import { Grid} from '@mui/material'
import Leftbar from '../components/Leftbar';
import Search from '../components/Search';
import ProfileSetting from '../components/ProfileSetting';
import AccountSetting from '../components/AccountSetting';

const Setting = () => {
  return (
    <Grid container spacing={2}>
        <Grid item xs={2}>
            <Leftbar active='setting'/>
        </Grid>
        <Grid item xs={10}>
            <Search/>
            <Grid container columns={{ xs: 12 }} spacing={2}>
              <Grid item xs={6}>
                  <ProfileSetting/>
              </Grid>
              <Grid item xs={6}>
                  <AccountSetting/>
              </Grid>
            </Grid>
        </Grid>
        
        
    </Grid>
  )
}

export default Setting