import { ArrowBack, ArrowRight, AttachFile, Close, LinkOutlined } from "@material-ui/icons"
import { Alert, Box, Button, Container, Radio, CircularProgress, InputLabel, Autocomplete, Paper, Stack, TextField, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { FaLink } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import {useDispatch, useSelector} from 'react-redux'
import { getAuthInformation, getYears } from "../../model/tools/AuthReducer"
import { allProgrammes } from "../../model/tools/ProgrammesReducer"

const Tuition = () => {
    const [subject, setSubject] = useState("")

    const [details, setDetails] = useState("")

    const navigate = useNavigate()

    const auth = useSelector(getAuthInformation)

    const programmes = useSelector(allProgrammes)

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const [academicYear, setAcademicYear] = useState("")

    const [year, setYear] = useState("")

    const [file, setFile] = useState(null)

    const [years, setYears] = useState([
        "YEAR I",
        "YEAR II",
        "YEAR III",
        programmes?.find(programme => programme?.id == auth?.user?.programme )?.number_of_years == 4 && "YEAR IV"
    ])

    const addComplaint=async()=>{
        setLoading(true)

        let formData = new FormData()

        formData.append("student",auth?.user?.user_id)
        formData.append("academic_year",auth?.years?.find(y => y?.title == academicYear)?.id)
        formData.append("year_of_study",year)
        formData.append("subject",subject)
        formData.append("details",details)
        formData.append("attachment",file)

        const response = await fetch(`${auth.URL}/tuition_issues/${auth?.user?.user_id}`, {
            method: "POST",
            body: formData
        })

        if(response.status == 201){
            setLoading(false)
            alert("Your complaint was sent successfully")
            navigate('/student/complaints/all')

        }else{
            setLoading(false)
            alert("failed to send complaint")

        }
    }


    useEffect(()=>{
        dispatch(getYears())
    },[])
    const HiddenInput = () => {
        return (
            <input type="file" className="d-none" accept=".jpg, .png, .jpeg, .pdf" onChange={(e) => setFile(e.currentTarget.files[0])} />
        )
    }
    return (
        <Box>

            <Container maxWidth="sm">
                <Paper elevation={0} sx={{ mt: 3, p: 4 }}>
                    <Typography sx={{ mb: 2 }} variant="subtitle1" >
                        Tuition complaint form
                    </Typography>


                    <Autocomplete
                        sx={{ my: 2 }}
                        options={auth.years.map(y => y.title)}
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

                    <TextField onChange={(e) => setSubject(e.target.value)} value={subject} className="w-100 mt-4" label="Subject" helperText="summarise your issue" />
                    <TextField value = {details} onChange={(e)=>setDetails(e.target.value)} className="w-100 mt-4" label="Details" helperText={"Explain more about your issue"} multiline rows={2} />
                    {
                        file && <Alert severity="info" className="w-100 my-2">
                            <Typography>you have selected {file.name}</Typography>
                        </Alert>
                    }
                    <Box className="mt-4" display={"flex"} alignItems="center" justifyContent={"space-between"}>
                       
                            <Button variant="contained" startIcon={<FaLink size={13}/>}>
                                <InputLabel>
                                <Typography className="text-light" variant = "caption">add attachment</Typography>
                                <HiddenInput/>
                                </InputLabel>
                            </Button>
                            <Button
                            onClick={addComplaint}
                            disabled ={
                                !academicYear ||
                                !subject  ||
                                !details ||
                                !year
                                ||
                                !file ||
                                loading
                            }
                            endIcon={<ArrowRight />}>
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
            </Container>
        </Box>
    )
}
export default Tuition