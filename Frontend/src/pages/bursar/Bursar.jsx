import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Index from "./Index"
import Navbar from '../../components/Navbar'
import { Autocomplete, Button, Container, Dialog, DialogContent, Fab, IconButton, TextField, Typography } from "@mui/material"
import { Home, Save } from "@material-ui/icons"
import { useSelector } from "react-redux"
import { getAuthInformation } from "../../model/tools/AuthReducer"
const Bursar=()=>{
    
    const navigate = useNavigate()
    const location = useLocation()
    const auth = useSelector(getAuthInformation)
    return(
        auth?.user?.role == "bursar" && auth?.user?.isLoggedIn 
        ?
        <>
        <Navbar/>
        <Container sx={{mt:12}}>
        <Routes>
        <Route path="/" Component={Index}/>
        </Routes>
        </Container>

        
        
        {
            location.pathname != "/bursar" && <Fab color="primary"  sx={{position: "fixed", bottom: "10%", right: "5%"}}>
            <IconButton onClick={()=>navigate('/bursar')} className="text-light">
                <Home/>
            </IconButton>
        </Fab>
        }
        </>
        :
        <Navigate to={"/"}/>
    )
}
export default Bursar