
import { ArrowRight, Search } from "@material-ui/icons"
import { Box, Button, Container, Paper, Typography, colors } from "@mui/material"
import { useSelector } from "react-redux"
import { Link, Navigate } from "react-router-dom"
import { getAuthInformation } from "../../model/tools/AuthReducer"

const NotFound = () => {
    const auth = useSelector(getAuthInformation)
    return (
       <>
       {
        auth?.user?.isLoggedIn
        ?
        <Navigate to={`/${auth?.user?.role}`}/>
        :
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} height={"100vh"}>

        <Container maxWidth="xs">
            <Paper elevation={0} className=" p-5 d-flex align-items-center justify-content-center flex-column">

                <Typography variant="h4" fontWeight={"light"} color={colors.grey[400]}>
                    404 | Not found
                </Typography>

                <Typography sx={{ my: 1 }}>
                    This page is not available on this server
                </Typography>

                <Link to={"/"}>

                    <Button variant="outlined" sx={{ mt: 3 }} endIcon={<ArrowRight />}>
                        Return to working page
                    </Button>

                </Link>

            </Paper>
        </Container>

    </Box>
       }
       </>
    )
}
export default NotFound