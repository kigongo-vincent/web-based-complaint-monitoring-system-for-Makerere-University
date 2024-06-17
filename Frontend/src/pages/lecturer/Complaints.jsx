
import { Alarm, ArrowRight, CheckCircle, Close } from "@material-ui/icons"
import { Box, Typography, IconButton, Button, Dialog, DialogContent, DialogActions, DialogTitle, InputLabel, Radio, Skeleton } from "@mui/material"
import { useLayoutEffect, useState } from "react"
import { FaCalendar, FaChalkboardTeacher, FaCheckDouble, FaClock, FaSadTear } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { getRelativeTime } from "../../utils/getRelativeTime"
import { useSelector } from "react-redux"
import { getAuthInformation } from "../../model/tools/AuthReducer"

const Complaints = () => {
    const { id } = useParams()

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [option, setOption] = useState("resolved")

    const [open, setOpen] = useState(false)

    const [details, setDetails] = useState({})

    const [complaints, setComplaints] = useState([])

    const [complaint,setComplaint] = useState(null)

    // const complaint =
    // {
    //     id: 1,
    //     reason: "missing marks",
    //     sent: "1st March, 2024",
    //     seen: false,
    //     nature: "missing coursework",
    //     status: "resolved",
    //     details: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis cupiditate veniam repellat explicabo placeat perspiciatis, officiis, dolore facere fugiat accusantium quos error provident? Dolorem quaerat veritatis atque voluptate nihil tempora. Voluptate, suscipit deserunt? Laborum eveniet vitae magni fugit possimus consectetur nemo explicabo nobis soluta, at, quae pariatur repellendus dolorem ipsum."

    // }

    const auth = useSelector(getAuthInformation)

    const getComplaints=async()=>{
        setLoading(true)
        const res = await fetch(`${auth.URL}/marks_complaints/${id}`)

        if(res.status == 200){
            const data = await res.json()
            setComplaints(data)
            setLoading(false)
        }else{
            setLoading(false)
        }
    }

    const resolveComplaint=async()=>{
        const response = await fetch(`${auth.URL}/update_marks_complaint/${complaint.id}`,{
            method: "PATCH",
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                status : option
            })
        })

        if(response.status == 202){
            setComplaints(complaints.map(c => c?.id === complaint?.id ? {...complaint,status : option } : c))
            setOpen(false)
            alert("complaint has been addressed")
        }
        else{
            alert("failed to update")
        }


    }

    useLayoutEffect(()=>{
getComplaints()
    },[])

    return (
        loading 
        ?
        <>
        <Skeleton height={"50vh"}/>
        <Skeleton height={"10vh"}/>
        </>
        :
        <Box>
            <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                <Typography textTransform={"uppercase"} variant="caption" letterSpacing={2}>
                    complaints
                </Typography>
                <IconButton onClick={() => navigate(-1)}>
                    <Close />
                </IconButton>
            </Box>
           {
            complaints.length == 0
            ?
            <Typography>No complaints found</Typography>
            :
            <table width={"100%"} className="mt-3 bg-white rounded ">
            <tr>

                <td className="px-5 py-3"><b>Sent</b></td>
                <td><b>Sent by</b></td>
                <td><b>Student Number</b></td>
                <td><b>Registration Number</b></td>
                <td><b>Year of Study</b></td>
                <td><b>Category</b></td>
                <td><b>Academic Year</b></td>
                
                

                <td></td>

            </tr>
            {
                complaints.map((complaint) => (
                    <tr role="button" className="list-item">

                        <td className="px-5 py-3">
                            <span className="d-flex align-items-center">
                                <FaClock size={13} className="text-success" />
                                <span className="mx-2 text-secondary">{getRelativeTime(complaint.sent)}</span>
                            </span>
                        </td>
                        <td>
                            {complaint.email?.split('@')[0]?.split('.')[0]}
                            &nbsp;
                            {complaint.email?.split('@')[0]?.split('.')[1]}
                        </td>
                        <td>
                            {complaint.student_number}
                        </td>
                        <td>
                            {complaint.registration_number}
                        </td>
                        <td>
                            {complaint.year_of_study}
                        </td>
                        <td>
                            {complaint.category}
                        </td>
                        <td>
                           {complaint.year}
                        </td>
                        
                    
                        <td>
                        <Button disabled={complaint.status != "pending"} onClick={()=>{setOpen(true); setComplaint(complaint)}} variant="outlined" endIcon={<ArrowRight />}>Reslove</Button>
                        </td>
                    </tr>
                ))
            }

        </table>
           }
            <Dialog open={open}>
                <DialogTitle>
                    <Typography typography={"caption"} letterSpacing={1} textTransform={"uppercase"}>
                        Resolve complaint
                    </Typography>
                </DialogTitle>
                <DialogContent className="d-flex align-items-center m-2">
                    <InputLabel className="d-flex align-items-center">
                        <Radio checked={option == "goto_office"} onClick={() => setOption("goto_office")} />
                        <Typography>
                            Come to office
                        </Typography>
                    </InputLabel>
                    <InputLabel className="d-flex align-items-center">
                        <Radio checked={option == "resolved"} onClick={() => setOption("resolved")} />
                        <Typography>
                            Issue has been addressed
                        </Typography>
                    </InputLabel>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary" startIcon={<Close />}>
                        close
                    </Button>
                    <Button disabled={!option} onClick={resolveComplaint} endIcon={<ArrowRight />}>
                    Confirm
                </Button>

                </DialogActions>
            </Dialog>
        </Box>
    )
}
export default Complaints