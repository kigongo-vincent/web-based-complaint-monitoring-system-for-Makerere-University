import { Autocomplete, Box, Button, Container, Dialog, DialogContent, IconButton, Paper, Select, TextField, Typography } from "@mui/material"
import { Add, AlarmOff, ArrowRight, Bookmark, CheckBoxOutlineBlank, Close } from '@material-ui/icons'
import StatisticsContainer from '../../components/StatisticsContainer'
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { getAuthInformation } from "../../model/tools/AuthReducer"
const Index = () => {
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState([
        {
            path: "missing",
            name: "missing marks"
        },
        {
            path: "registration",
            name: "Registration issues"
        },
        {
            name: "Tuition issues",
            path: "tuition"
        }])

        const [statistics, setStatistics] = useState(null)

        const getStatistics = async()=>{
            const response = await fetch(`${auth.URL}/student_statistics/${auth?.user?.user_id}`)
            if(response.status == 200){
                const data = await response.json()
                setStatistics(data)
            }
        }
        
    const [option, setOption] = useState(null)
    const navigate = useNavigate()

    const auth = useSelector(getAuthInformation)

    useEffect(()=>{
getStatistics()
    },[])
    
    return (
        <Container>
            <Paper sx={{ p: 5 }} elevation={0} className="custom-shadow">
                <Typography variant="h4" fontWeight={"bold"}>Hello, {auth?.user?.username}</Typography>
                <Typography sx={{ mt: 1 }}>welcome to your dashboard</Typography>
            </Paper>

            <Box display={"flex"} alignItems={"center"}>

                <Link className="nav-link" to={`/student/complaints/all`}>
                <StatisticsContainer figure={statistics ? statistics.total: 0} bgcolor={"white"} label={"Total Complaints made"} icon={<Bookmark />} />
                </Link>

                <Link className="nav-link"  to={`/student/complaints/pending`}>
                <StatisticsContainer figure={statistics ? statistics.pending: 0} bgcolor={"white"} label={"Pending complaints"} icon={<AlarmOff />} />
                </Link>

                <Link className="nav-link"  to={`/student/complaints/resolved`}>
                <StatisticsContainer figure={statistics ? statistics.total - statistics.pending: 0} bgcolor={"white"} label={"Addressed complaints"} icon={<CheckBoxOutlineBlank />} />
                </Link>
            </Box>

            <Button onClick={() => setOpen(true)} sx={{ mt: 3 }} startIcon={<Add />} variant="contained" color="secondary">
                add a complaint
            </Button>

            <Dialog open={open}>
                <DialogContent>
                    <Box sx={{
                        minWidth: 300, mb: 2
                    }}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}>

                        <Typography variant="caption">
                            Add a complaint
                        </Typography>

                        <IconButton onClick={() => setOpen(false)}>
                            <Close />
                        </IconButton>

                    </Box>

                    <Box>

                        <Typography>Please select the nature of your complaint</Typography>

                        <Autocomplete
                            value={option}
                            onChange={(_,value)=>setOption(value)}
                            sx={{ mt: 2, mb: 4 }}
                            options={options.map(option => option.name)}
                            renderInput={(params) => <TextField {...params} />} />

                        <Button disabled={!option} onClick={() => navigate(`/student/${options.find(o => option == o?.name).path}`)} variant="contained" endIcon={<ArrowRight />}>
                            Continue
                        </Button>

                    </Box>

                </DialogContent>

            </Dialog>

        </Container>
    )
}
export default Index