import { Close, NotificationImportant, Person } from '@material-ui/icons'
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Container, Popover, Alert, Button } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { FaGraduationCap, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {getAuthInformation, logout, toggle_is_open} from '../model/tools/AuthReducer'
import { allProgrammes, getProgrammes } from '../model/tools/ProgrammesReducer'
import { getRelativeTime } from '../utils/getRelativeTime'
const Navbar = () => {
  const anchor = useRef()
  const personAnchor = useRef()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  const dispatch = useDispatch()

  const auth = useSelector(getAuthInformation)

  const [notSeen, setNotSeen] = useState(0)

  const programmes = useSelector(allProgrammes)

  const navigate = useNavigate()

  const SignOut=()=>{
    let ok = confirm("Are you sure you want to logout?")
    if(ok){
      dispatch(logout())
      navigate("/")
    }
  }

  const getNotifications = async()=>{
    const response = await fetch(`${auth.URL}/notifications/${auth?.user?.user_id}`)
    if(response.status == 200){
      const data = await response.json()
      setNotifications(data)
    }
  }
  
  const viewNotifications = async()=>{
    setOpen(true)
    const response = await fetch(`${auth.URL}/view_notifications/${auth?.user?.user_id}`)
    if(response.status != 202){
      console.log('failed to update DB')
    }
    else{
      setNotifications(notifications.map(notification => ({...notification, is_viewed: true})))
    }
  }


  useEffect(()=>{
dispatch(getProgrammes())
getNotifications()
  },[])


  useEffect(()=>{
if(notifications.length != 0){
  setNotSeen(notifications.filter(notification => !notification?.is_viewed)?.length)
}
  },[notifications])


  return (
    <AppBar className='bg-dark ' sx={{ boxShadow: "none", py: 1.5 }}>
      <Container>


        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} >
          {/* brand logo  */}
          <Typography role = "button" onClick={()=>navigate('/')} textTransform={"uppercase"} fontWeight={900} className='text-secondary' letterSpacing={1}>
            WBCMS
          </Typography>
          {/* end brand logo  */}

          <Box>
            {/* profile */}
            {
              auth?.user?.role == "student" && <IconButton ref={personAnchor} onClick={()=>dispatch(toggle_is_open())}>
              <Person className='text-light' />
            </IconButton>
            }
            {/* end profile */}

            {/* Notifications button */}
            <IconButton ref={anchor} className='mx-2' onClick={viewNotifications}>
              <Badge badgeContent={notSeen} color='error'>
                <NotificationImportant className='text-light' />
              </Badge>
            </IconButton>
            {/* end Notifications button */}

            {/* logout  */}
            <IconButton onClick={SignOut}>
              <FaSignOutAlt className='text-light'/>
            </IconButton>
            {/* end logout  */}
          </Box>

        </Box>

      </Container>


      {/* popover for notifications  */}
      <Popover sx={{maxWidth: "90%"}} anchorEl={anchor.current} open={open} anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}>
        
        {/* notifications header  */}
        <Box display={"flex"}  sx={{minWidth: 350, px:3, pt:1}} justifyContent={"space-between"} alignItems={"center"}>
          <Typography>notifications</Typography>
          <IconButton onClick={()=>setOpen(false)}>
            <Close/>
          </IconButton>
        </Box>
        {/* end notifications header  */}
        <Box sx={{px:3, pb:3}}>
        {
          notifications.length == 0
          ?
          <Typography className='my-3'>
            No notifications found
          </Typography>
          :
          notifications?.map((notification)=>(
            <Alert severity={notification?.severity} sx={{mt:1, py:1}}>
              {notification?.body}
              <br/>
              <br/>
              <Typography variant='caption'>
                sent {getRelativeTime(notification.sent)}
              </Typography>
            </Alert>
          ))
        }
        </Box>


      </Popover>
      {/* end popover for notifications  */}

      <Popover open={auth?.is_open} anchorEl={personAnchor.current} anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}>
         {/* profile header  */}
         <Box display={"flex"}  sx={{minWidth: 350, px:2, pt:1}} justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="caption" className='text-secondary' textTransform={"uppercase"}>Profile</Typography>
          <IconButton onClick={()=>dispatch(toggle_is_open())}>
            <Close/>
          </IconButton>
        </Box>
        {/* end profile header  */}

        <Box sx={{px:2, pt:3, pb:2}}>
        <Button startIcon={<FaGraduationCap/>} sx={{mb:2}} variant="contained" color='primary'>
        <Typography >
          {
            programmes.length > 0
            ?
            programmes?.find(programme => programme.id == auth?.user?.programme)?.name
            :
            "Course not found"
          }
        </Typography>
        </Button>
       <div className="shadow-md p-4">
       <Typography sx={{mb:2}}>
          <b >webmail:</b> {auth?.user?.email}
        </Typography>
       <Typography sx={{mb:2}} >
          <b>Student Number:</b> {auth?.user?.student_number}
        </Typography>
        <Typography>
          <b >Registration Number:</b> {auth?.user?.registration_number}
        </Typography>
       </div>
        </Box>
<br /><br />
      </Popover>


      
    </AppBar>
  )
}

export default Navbar