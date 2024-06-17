import { Alert, Box, Button, CircularProgress, Container, IconButton, Paper, TextField, Typography } from "@mui/material"
import Logo from '../../assets/svgs/muk.svg'
import { ArrowRight, Close } from "@material-ui/icons"
import { useEffect, useState } from "react"
import {useSelector} from 'react-redux'
import {Navigate, useNavigate} from 'react-router-dom'
import { getAuthInformation } from "../../model/tools/AuthReducer"
import {AnimatePresence, motion} from 'framer-motion'
const Login = () => {

    const [webmail, setWebmail] = useState("") //webmail input storage
    const [loading, setLoading] = useState(false) //loading status
    const [error, setError] = useState(false) //error status

    const auth = useSelector(getAuthInformation)

    const navigate = useNavigate()

    const handleSubmit = async() => {
        setLoading(true)
        const response = await fetch(`${auth.URL}/signup/`,{
            method: "POST",
            body:JSON.stringify({
                email: webmail,
                password: webmail
            }),
            headers:{
                'Content-type': 'application/json'
            }
        })
        if(response.status == 201){
            setLoading(false)
            navigate('/verify')
        }
        else{
            setError(true)
            setLoading(false)
        }
    }

    useEffect(()=>{
console.log(auth)
    },[])

    return (
        // container 
      <>
      {
          
            auth?.user?.isLoggedIn
            ?
            <Navigate to={`/${auth?.user?.role}`}/>
            :
            <AnimatePresence mode="popLayout">
                <Box height={"100vh"} width={"100vw"} display={"flex"} alignItems={"center"} justifyContent={"center"}>

{/* div containing login components */}
<Container maxWidth={"sm"}>
<motion.div
initial={{scale: 0, opacity:0}}
animate={{scale: 1, opacity: 1}}
exit={{scale: 0, opacity:0}}
>
<Paper className="p-5 rounded shadow-sm text-center" elevation={0}>
    <img width={250} src={Logo} />

    

    {/* text input for webmail  */}
    <TextField value={webmail} onChange={(e) => setWebmail(e.target.value)} helperText="please provide your webmail" label="webmail" className="w-100 mt-5" />
    {/* end text input for webmail  */}

    {/* container for request button  */}
    <Box sx={{ mt: 5 }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>

        <Typography>
            &copy;
            2024
        </Typography>

        <Button disabled={loading} onClick={handleSubmit} variant="contained" endIcon={<ArrowRight />}>
            {
                loading
                ?
                <CircularProgress size={14} className="text-dark" />
                    :
                    "request OTP"
            }
        </Button>

    </Box>
    {/* end container for request button  */}

    {/* if anything goes wrong */}
    {
        error
        &&
        <Alert severity="error" sx={{ mt: 2 }} action={<IconButton onClick={() => setError(!error)}><Close /></IconButton>}>
            <Typography>
                Invalid webmail, please try again with a valid webmail
            </Typography>

        </Alert>
    }
    {/* end if anything goes wrong */}

</Paper>
</motion.div>
</Container>
{/* div containing login components */}

</Box>
            </AnimatePresence>
      }
      </>
    )
}
export default Login