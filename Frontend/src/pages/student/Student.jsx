import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Index from "./Index"
import Navbar from '../../components/Navbar'
import Tuition from './TuitionComplaintForm'
import { Autocomplete, Button, Container, Dialog, DialogContent, LinearProgress, Fab, IconButton, TextField, Typography } from "@mui/material"
import MissingMarks from "./MissingMarksComplaintForm"
import Registration from "./RegistrationComplaintForm"
import Complaints from "./Complaints"
import { Home, Save } from "@material-ui/icons"
import { useDispatch, useSelector } from "react-redux"
import { getAuthInformation, logout, toggle_is_open, update_profile } from "../../model/tools/AuthReducer"
import { allProgrammes, getProgrammes } from "../../model/tools/ProgrammesReducer"
import { FaSignOutAlt } from "react-icons/fa"
import { useEffect, useState } from "react"
import {motion} from 'framer-motion'
const Student=()=>{
    const navigate = useNavigate()
    const location = useLocation()
    const [saving, setSaving] = useState(false)

    const dispatch = useDispatch()

    const auth = useSelector(getAuthInformation)

    const courses = useSelector(allProgrammes)

    const [profile, setProfile] = useState({
        registration_number: "",
        student_number: "",
        programme: 0,
    })

    const handleSubmit=async()=>{
        if(profile.registration_number && profile.student_number){
            setSaving(true)

            const response = await fetch(`${auth.URL}/update_profile/${auth?.user?.user_id}`,{
                method:"PATCH",
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(profile)
            })
            if(response.status == 202){
                    setSaving(false)
                    dispatch(update_profile(profile))
                    alert("update successful")
                    dispatch(toggle_is_open())

            }else{
                setSaving(false)
                alert("failed to update, try again")
            }
        }else{
            alert("Invalid input")
        }
    }

    

    useEffect(()=>{
dispatch(getProgrammes())
    },[])

    
    
    return(
       
        auth?.user?.role == "student" && auth?.user?.isLoggedIn 
        ?
        <>
        <Navbar/>
        <Container sx={{mt:12}}>
        <Routes>
        <Route path="/" Component={Index}/>
        <Route path="/tuition" Component={Tuition}/>
        <Route path="/missing" Component={MissingMarks}/>
        <Route path="/registration" Component={Registration}/>
        <Route path="/complaints/:category" Component={Complaints}/>
        </Routes>
        </Container>

        
        <motion.div 
        initial={{scale: 0, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0, opacity: 0}}
        >
        <Dialog open={!auth?.user?.has_profile}>
            <DialogContent sx={{minWidth: 450}}>

                <Typography textAlign={"center"} sx={{mt:2, mb:4}} fontFamily={"vivaldi"} variant="h4">
                    Complete setup!
                </Typography>

                <Typography sx={{mb:2}}>
                    Please select your course
                </Typography>

                <Autocomplete 
                options={courses.map(course => course?.name)} 
                onChange={(_, value)=>setProfile({...profile, programme: courses.find(course => course?.name == value)?.id })}  
                renderInput={(params)=><TextField label="Course" {...params}/>}
                />
                
                <Typography sx={{my:1}}>
                    Enter your Student Number
                </Typography>

                <TextField 
                label="Student No." 
                className="w-100 mt-2"
                value={profile?.student_number}
                onChange={(e)=>setProfile({...profile, student_number: e.target.value})}
                />

                <Typography sx={{my:1}}>
                    Enter your Registration Number
                </Typography>

                <TextField 
                label="Reg No." 
                className="w-100 mt-2"
                value={profile?.registration_number}
                onChange={(e)=>setProfile({...profile, registration_number: e.target.value})}
                />

                <Button className=" mt-3" onClick={()=>{navigate('/');dispatch(logout())}} color="secondary" variant="contained" sx={{mr:2}}  startIcon={<FaSignOutAlt size={14}/>}>
                    Logout
                </Button>
                <Button disabled={saving || !profile?.student_number || !profile?.registration_number} className=" mt-3" onClick={handleSubmit} variant="contained" color="primary" startIcon={<Save/>}>
                    Save progress
                </Button>
            </DialogContent>
            {
                saving && <LinearProgress/>
            }
        </Dialog> 
        </motion.div>
        {
            location.pathname != "/student" && <Fab color="primary"  sx={{position: "fixed", bottom: "10%", right: "5%"}}>
            <IconButton onClick={()=>navigate('/student')} className="text-light">
                <Home/>
            </IconButton>
        </Fab>
        }
        </>
       :
       <Navigate to={"/"}/>
    )
}
export default Student