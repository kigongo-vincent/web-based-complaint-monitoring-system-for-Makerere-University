import { Grid } from "@material-ui/core"
import { ArrowBack, ArrowRight, Close, LinkOutlined } from "@material-ui/icons"
import { Alert, Autocomplete, Box, Button, CircularProgress, Container, FormControl, IconButton, InputLabel, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { getAuthInformation, getYears } from '../../model/tools/AuthReducer'
import { allProgrammes } from '../../model/tools/ProgrammesReducer'
const MissingMarks = () => {

    const auth = useSelector(getAuthInformation)

    const programmes = useSelector(allProgrammes)

    const [semster, setSemster] = useState("I")

    const [courseUnit, setCourseUnit] = useState(null)

    const [lecturer, setLecturer] = useState("")

    const [complaintCategory, setComplaintCategory] = useState("coursework")

    const getCourseName = (title) => {
        const name = title?.split('- ')[1]
        return name
    }

    const navigate = useNavigate()

    const [academicYear, setAcademicYear] = useState("")

    const myCourse = {
        name: "BACHELOR OF INFORMATION SYSTEMS AND TECH",
        number_of_years: 3
    }

    const [year, setYear] = useState("")

    const [loading, setLoading] = useState(false)

    const [years, setYears] = useState([
        "YEAR I",
        "YEAR II",
        "YEAR III",
        programmes?.find(programme => programme?.id == auth?.user?.programme)?.number_of_years == 4 && "YEAR IV"
    ])

    // useEffect(() => {

    // }, [courseUnit])

    const dispatch = useDispatch()

    
    const [courseUnits, setCourseUnits] = useState([])
    
    // set lecturers for a selected courseunit 
    useEffect(() => {
        if (courseUnit) {
            setLecturer(courseUnits.find(course_unit => getCourseName(courseUnit) == course_unit?.name)?.email)
        }
    }, [courseUnit])
    
    
    // get names for lecturer ids 
    // useEffect(() => {
    //     if (lecturerNames) {
        //         setLecturerNames(
            //             tutors.map(
    //                 tutor => lecturers.find(lecturer => lecturer.id == tutor)?.name
    //             )
    //         )
    //     }
    // }, [lecturerNames])
    
    
    // get all courses 
    const getCourses =async()=>{
        const response = await fetch(`${auth.URL}/all_courses/${auth?.user?.programme}`)
        
        if(response.status == 200){
            const data = await response.json()

            setCourseUnits(data)
        }
    }
    
    
    useEffect(() => {
        dispatch(getYears())
        getCourses()
    }, [])


    const addComplaint = async()=>{
        
        setLoading(true)
        const response = await fetch(`${auth.URL}/missing_marks/${auth?.user?.user_id}`,{
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                student: auth?.user?.user_id,
                academic_year: auth?.years?.find(academic_year => academic_year?.title == academicYear)?.id,
                category: complaintCategory,
                year_of_study: year,
                course : courseUnits.find(course_unit => getCourseName(courseUnit) == course_unit?.name)?.id
            })
        })

        if(response.status == 201){
            setLoading(false)
            alert('complaint sent successfully')
            navigate('/student/complaints/all')

        }else{
            setLoading(false)
            alert("failed to send complaint")
        }
    }
    return (
        <Box>

            <Container >
                <Grid container>

                    <Grid item lg={6} sx={{ px: 2 }}>
                        <Paper elevation={0} sx={{ mx: 1, p: 4 }}>
                            <Typography sx={{ mb: 2 }} variant="subtitle1" >
                                Missing marks complaint form
                            </Typography>




                            <Autocomplete
                                sx={{ my: 2 }}
                                options={auth.years?.map(year => year.title)}
                                renderInput={(params) => <TextField label="Academic year" {...params} />}
                                value={academicYear}
                                onChange={(_, value) => setAcademicYear(value)}
                            />

                            <Autocomplete
                                options={years}
                                value={year}
                                onChange={(_, value) => setYear(value)}
                                renderInput={(params) => <TextField label="Year of Study" {...params} />}
                            />






                            <Typography sx={{ my: 3.3 }}>Select the semster</Typography>
                            <Box display="flex" alignItems="center">
                                <InputLabel className="d-flex align-items-center">
                                    <Radio checked={semster == "I"} onClick={(e) => { setCourseUnit(''), setLecturer(""), setSemster("I") }} />
                                    <Typography>semster I</Typography>
                                </InputLabel>

                                <InputLabel className="d-flex align-items-center">
                                    <Radio id="sem2" checked={semster == "II"} onClick={(e) => { setCourseUnit(''), setLecturer(""), setSemster("II") }} />
                                    <Typography>semster II</Typography>
                                </InputLabel>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item lg={6} sx={{ px: 2 }}>
                        <Paper elevation={0} sx={{ mx: 1, p: 4 }}>




                            <Autocomplete
                                sx={{ my: 2 }}
                                options={courseUnits.filter(courseUnit => courseUnit?.semester == semster)?.map(course_unit => `${course_unit?.code} - ${course_unit?.name}`)}
                                renderInput={(params) => <TextField label="Course unit" {...params} />}
                                value={courseUnit}
                                onChange={(_, value) => setCourseUnit(value)}
                            />

                            {
                                lecturer && <Alert severity="info" className="w-100">
                                    This course is taught by <a className="text-primary">{lecturer}</a>
                                </Alert>
                            }

                            <Typography sx={{ mt: 2, mb: 1 }}>Nature of complaint (what is missing)</Typography>
                            <Box display="flex" alignItems="center">
                                <InputLabel className="d-flex align-items-center">
                                    <Radio checked={complaintCategory == "coursework"} onClick={(e) => { setComplaintCategory("coursework") }} />
                                    <Typography>Coursework</Typography>
                                </InputLabel>

                                <InputLabel className="d-flex align-items-center">
                                    <Radio checked={complaintCategory == "exam"} onClick={(e) => { setComplaintCategory("exam") }} />
                                    <Typography>Final exam</Typography>
                                </InputLabel>
                                <InputLabel className="d-flex align-items-center">
                                    <Radio checked={complaintCategory == "both"} onClick={(e) => { setComplaintCategory("both") }} />
                                    <Typography>Both</Typography>
                                </InputLabel>
                            </Box>



                            <Box className="mt-4" display={"flex"} alignItems="center" justifyContent={"space-between"}>


                                <Button color="error" startIcon={<Close />} onClick={() => navigate(-1)}>
                                    back
                                </Button>
                                <Button
                                disabled={
                                    !year || !academicYear || !courseUnit || !lecturer || loading
                                }
                                onClick={addComplaint} variant="contained" endIcon={<ArrowRight />}>
                                    {
                                        loading
                                        ?
                                        <CircularProgress size={14}/>
                                        :
                                        "Confirm"
                                    }
                                </Button>

                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
export default MissingMarks