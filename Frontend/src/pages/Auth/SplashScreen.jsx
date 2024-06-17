import { ArrowRight } from "@material-ui/icons"
import { Button, Container, Paper, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { getAuthInformation } from "../../model/tools/AuthReducer"
import { motion } from "framer-motion"
const SplashScreen=()=>{
    const navigate = useNavigate()
    const auth = useSelector(getAuthInformation)
    return(
      <>
      {
        auth?.user?.isLoggedIn
        ?
        <Navigate to={`/${auth?.user?.role}`}/>
        :
        <Container maxWidth={"xs"} className=" py-5">
        <motion.div 
        initial={{y: 200, opacity:0}}
        animate={{y: 0, opacity: 1}}
        exit={{y: 100, opacity:0}}
        >
        <Typography variant="h4" sx={{mt:5}} textTransform={"uppercase"} textAlign={"center"}  fontFamily={"serif"}>Welcome!</Typography>
        <Paper sx={{p:4, my:3}} elevation={0}>
            <Typography textAlign={"center"} textTransform={"uppercase"} lineHeight={4} fontWeight={"bold"}>Web-based Complaint Monitoring system</Typography>
            <Typography className="text-secondary" variant="caption" lineHeight={2} textAlign={"justify"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam fugit at saepe porro. Praesentium minus alias nam, nemo neque et recusandae magnam, unde eveniet delectus, ipsa ad exercitationem accusantium? Adipisci ab temporibus totam fuga sed ullam ratione exercitationem dolorem laborum ipsum quis placeat et, quam inventore maxime praesentium quos autem assumenda dolore nobis recusandae aperiam perspiciatis. Magnam laboriosam 
            </Typography>
        </Paper>
        <Button onClick={()=>navigate('/login')} color="primary" variant={"contained"} className="w-100" endIcon={<ArrowRight/>}>
            Proceed to site
        </Button>
        </motion.div>
    </Container>
      }
      </>
    )
}
export default SplashScreen