import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Index from "./Index"
import Navbar from '../../components/Navbar'
import { Autocomplete, Button, Container, Dialog, DialogContent, Fab, IconButton, TextField, Typography } from "@mui/material"
import { Home, Save } from "@material-ui/icons"
import Complaints from "./Complaints"
import { useSelector } from "react-redux"
import { getAuthInformation } from "../../model/tools/AuthReducer"
const Student=()=>{
    
    const navigate = useNavigate()
    const location = useLocation()
    let courses = [
        {
            id: 1,
            name: "Bachelor Of Information Systems and Technology"
        },
        {
            id: 2,
            name: "Bachelor Of Science in Software Engineering"
        },
        {
            id: 3,
            name: "Bachelor Of Science in Computer Science"
        },
    ]
    const auth = useSelector(getAuthInformation)
    return(
        auth?.user?.role == "lecturer" && auth?.user?.isLoggedIn
        ?
        <>
        <Navbar/>
        <Container sx={{mt:12}}>
        <Routes>
        <Route path="/" Component={Index}/>
        <Route path="/complaints/:id" Component={Complaints}/>
        {/* <Route path="/:course" Component={MissingMarks}/> */}
        </Routes>
        </Container>

        
        
        {
            location.pathname != "/lecturer" && <Fab color="primary"  sx={{position: "fixed", bottom: "10%", right: "5%"}}>
            <IconButton onClick={()=>navigate('/lecturer')} className="text-light">
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