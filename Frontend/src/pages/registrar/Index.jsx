import { Box , Paper, TextField, Dialog, DialogContent, Typography,Grid, Button, CircularProgress, Alert} from "@mui/material"
import { PlusOne,Save, Close, ArrowRight } from "@material-ui/icons"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { AddProgramme, allProgrammes } from "../../model/tools/ProgrammesReducer"
import { getAuthInformation } from "../../model/tools/AuthReducer"
const Index =()=>{
    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    const auth = useSelector(getAuthInformation)

    const [name, setName] = useState("")

    const [error, setError] = useState(false)

    const [NOY, setNOY] = useState(3)

    const courses = useSelector(allProgrammes)

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const addProgramme = async()=>{
        setLoading(true)
        const response = await fetch(`${auth.URL}/programmes/`,{
            method: "POST",
            headers:{
                'Content-type': 'application/json'
            },
            body:JSON.stringify({
                name: name,
                number_of_years: NOY
            })
        })

        if(response.status == 201){
            const data = await response.json()
            dispatch(AddProgramme(data))
            setLoading(false)
            setOpen(false)
        }
        else{
            setLoading(false)
            setError(true)
        }
    }
    return(
        <Box>
            <Paper sx={{ p: 5 }} elevation={0} className="custom-shadow">
                <Typography variant="h4" fontWeight={"bold"}>Hello, {auth?.user?.username}</Typography>
                <Typography sx={{ mt: 1 }}>welcome to your dashboard</Typography>
            </Paper>


            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant="caption" letterSpacing={2} textTransform={"uppercase"}>Programs</Typography>
                <Button onClick={() => setOpen(true)} variant="contained" startIcon={<PlusOne />} color="primary">
                    add a programme
                </Button>
            </Box>

            <Grid container sx={{ my: 3 }}>
                {
                    courses.length == 0
                        ?
                        <Typography sx={{ mt: 3 }}>
                            No courses available
                        </Typography>
                        :
                        courses.map(course => (
                            <Grid key={course?.name} item lg={4}>
                                <Paper elevation={0} sx={{ p: 4, mt:1 }} className="mx-0 mx-lg-1">
                                    <Typography sx={{mb:4}}>{`${course.name}`}</Typography>
                                    <Button onClick={()=>navigate(`/registrar/complaints/${course.id}`)} endIcon={<ArrowRight />} className="w-100" variant="contained" >
                                        view complaints
                                    </Button>
                                </Paper>
                            </Grid>
                        ))
                }
            </Grid>

            <Dialog open={open}>
                <DialogContent sx={{ minWidth: 400 }}>
                    <Typography textAlign={"center"} sx={{ mt: 2, mb: 4 }}  variant="h6">
                        Add a Programme
                    </Typography>
                    

                    <TextField value={name} onChange={(e)=>setName(e.target.value)} sx={{ mb: 2 }} label="Programme name" className="w-100 mt-2" />
                    <TextField value={NOY} type="number" onChange={(e)=>setNOY(e.target.value)} sx={{ mb: 2 }} label="Number of years" className="w-100 mt-2" />

                    <Button className=" mt-3" sx={{ mr: 1 }} variant="contained" onClick={() => setOpen(false)} color="secondary" startIcon={<Close />}>
                        cancel
                    </Button>
                    <Button disabled={name.length < 4 || loading || !NOY } onClick={addProgramme} className=" mt-3" variant="contained" color="primary" startIcon={<Save />}>
                        {
                            loading
                            ?
                            <CircularProgress size={14}/>
                            :
                            "Save"
                        }
                    </Button>
                    {
                        error && <Alert severity="error" sx={{my:3}}>
                        <Typography>Something went wrong, try again</Typography>
                        </Alert>
                    }
                </DialogContent>
            </Dialog>

        </Box>
    )
}

export default Index