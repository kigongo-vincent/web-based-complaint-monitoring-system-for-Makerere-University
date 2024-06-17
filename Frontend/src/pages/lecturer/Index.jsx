import { ArrowRight, Close, PlusOne, Save } from "@material-ui/icons"
import { Box, Typography, Paper, InputLabel, Radio, Button, Grid, Dialog, DialogContent, Autocomplete, TextField, Skeleton } from "@mui/material"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { allLecturers, allProgrammes } from "../../model/tools/ProgrammesReducer"
import { getAuthInformation } from "../../model/tools/AuthReducer"
import {motion} from 'framer-motion'
const Index = () => {

    let programs = useSelector(allProgrammes)
    
    const lecturers = useSelector(allLecturers)

    const auth = useSelector(getAuthInformation)

    const navigate = useNavigate()

    const [semster, setSemster] = useState("I")

    const [open, setOpen] = useState(false)

    const [programme, setProgramme] = useState()
    
    const [code, setCode] = useState("")

    const [loading, setLoading] = useState(true)

    const [course, setCourse] = useState("")

    const getCourses =async()=>{
        setLoading(true)
        const response = await fetch(`${auth.URL}/courses/${auth?.user?.user_id}`)
        
        if(response.status == 200){
            const data = await response.json()
            setCourses(data)
            setLoading(false)
        }else{
            setLoading(false)
        }
    }

    const [courses, setCourses] = useState([])

    const handleSubmit=async()=>{

        const formData = new FormData()

        formData.append("code", code)
        formData.append("name", course)
        formData.append("programme", programs.find(p => p.name === programme)?.id)
        formData.append("semester", semster)
        formData.append("lecturer", auth?.user?.user_id)

        const res = await fetch(`${auth.URL}/courses/${auth?.user?.user_id}`,{
            method: "POST",
            body: formData
        })

        if(res.status == 201){
            const data = await res.json()
            alert("new course has been added successfully")
            setCourses([...courses, data])
            setCode("")
            setCourse("")
            setProgramme("")
            setOpen(false)
        }else{
            alert("failed to add course")
        }

    }

    useEffect(()=>{
        getCourses()
    },[])
    return (
        <Box>

            {/* intro  */}
            <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            >
            <Paper sx={{ p: 5 }} elevation={0} className="custom-shadow">
                <Typography variant="h4" fontWeight={"bold"}>Hello, {auth?.user?.username}</Typography>
                <Typography sx={{ mt: 1 }}>welcome to your dashboard</Typography>
            </Paper>
            </motion.div>


            {
                loading
                ?
                <>
                <Grid container >
                    <Grid item lg={4}><Skeleton height={"50vh"} width={"90%"}/></Grid>
                    <Grid item lg={4}><Skeleton height={"50vh"} width={"90%"}/></Grid>
                    <Grid item lg={4}><Skeleton height={"50vh"} width={"90%"}/></Grid>
                    
                </Grid>
                
                </>
                :
                <>
                {/* add course  */}
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant="caption" letterSpacing={2} textTransform={"uppercase"}>Courses</Typography>
                <Button onClick={() => setOpen(true)} variant="contained" startIcon={<PlusOne />} color="primary">
                    add a course
                </Button>
            </Box>


            {/* courses list  */}
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
                                <Paper elevation={0} sx={{ p: 4 , mt:1}} className="mx-0 mx-lg-1">
                                    <Typography>{`${course.code} - ${course.name}`}</Typography>

                                    <div className="shadow-md px-3 my-3">

                                        <Typography className="text-success my-3">{course.program}</Typography>
                                        <Typography className="text-secondary mb-3">SEMESTER {course.semester}</Typography>
                                    </div>

                                    

                                    <Button onClick={()=>navigate(`/lecturer/complaints/${course.id}`)} endIcon={<ArrowRight />} className="w-100" variant="contained" color="secondary">
                                        view complaints
                                    </Button>
                                </Paper>
                            </Grid>
                        ))
                }
            </Grid>
                </>
            }


            <Dialog open={open}>
                <DialogContent sx={{ minWidth: 400 }}>
                    <Typography textAlign={"center"} sx={{ mt: 2, mb: 4 }}  variant="h6">
                        Add a course
                    </Typography>

                    <Autocomplete 
                    sx={{ mb: 2 }} 
                    value={programme}
                    onChange={(_, value)=> setProgramme(value)}
                    options={programs.map(course => course?.name)} 
                    renderInput={(params) => <TextField label="Program" {...params} 
                    />} />

                    <Box display="flex" alignItems="center">
                        <InputLabel className="d-flex align-items-center">
                            <Radio checked={semster == "I"} onClick={(e) => { setSemster("I") }} />
                            <Typography>semster I</Typography>
                        </InputLabel>

                        <InputLabel className="d-flex align-items-center">
                            <Radio id="sem2" checked={semster == "II"} onClick={(e) => { setSemster("II") }} />
                            <Typography>semster II</Typography>
                        </InputLabel>
                    </Box>

                    <TextField sx={{ mb: 2 }} label="Course name" value={course} onChange={(e)=>setCourse(e.target.value)} className="w-100 mt-2" />

                    <TextField sx={{ mb: 2 }} label="Course code" value={code} onChange={(e)=>setCode(e.target.value)} className="w-100 mt-2" />

                    <Button className=" mt-3" sx={{ mr: 1 }} variant="contained" onClick={() => setOpen(false)} color="secondary" startIcon={<Close />}>
                        cancel
                    </Button>
                    <Button onClick={handleSubmit} className=" mt-3" variant="contained" color="primary" startIcon={<Save />}>
                        Save
                    </Button>
                </DialogContent>
            </Dialog>
        </Box>
    )
}
export default Index