
import { Alarm, ArrowRight, CheckCircle, Close } from "@material-ui/icons"
import { Box, Typography, IconButton, Button, Dialog, DialogContent, DialogActions, DialogTitle, InputLabel, Radio, Skeleton } from "@mui/material"
import { useLayoutEffect, useState } from "react"
import { FaCalendar, FaChalkboardTeacher, FaCheckDouble, FaClock, FaEnvelope, FaSadTear } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { getAuthInformation } from '../../model/tools/AuthReducer'
import { useSelector } from "react-redux"
import {getRelativeTime} from '../../utils/getRelativeTime'
const Complaints = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const [option, setOption] = useState("resolved")

    const [open, setOpen] = useState(false)

    const [details, setDetails] = useState({})

    const [loading, setLoading] = useState(false)
    const [complaints, setComplaints] = useState([])
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

    const getComplaints =async()=>{
        setLoading(true)
        const response = await fetch(`${auth.URL}/reg_complaints/${id}`)

        if(response.status == 200){
            const data = await response.json()

            setComplaints(data)
            setLoading(false)
        }else{
            setLoading(false)
            console.error("failed to fetch")
        }
    }

    useLayoutEffect(()=>{
        getComplaints()
    },[])

    const [complaint,setComplaint] = useState(null)

    const resolveComplaint=async()=>{
        const response = await fetch(`${auth.URL}/update_reg_complaint/${complaint.id}`,{
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

    return (
       <>
       {
        loading
        ?
        <>
        <Skeleton height="50vh"/>
        <Skeleton height="10vh"/>
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
                <td><b>Academic Year</b></td>
                
                

                <td></td>

            </tr>
            {
                complaints.map((complaint) => (
                    <tr role="button" className="list-item">

                        <td className="px-5 py-3">
                            <span className="d-flex align-items-center">
                                <FaClock size={13} className="text-success" />
                                <span className="mx-2 text-secondary">{getRelativeTime(complaint.created)}</span>
                            </span>
                        </td>
                        <td>
                            <span className="d-flex align-items-center">
                                <FaEnvelope size={13} className="text-success" />
                                <span className="mx-2 text-secondary">{complaint.email}</span>
                            </span>
                            
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
                <Typography typography={"h6"} textTransform={"uppercase"} fontWeight={"900"}>
                    Resolve complaint
                </Typography>
            </DialogTitle>
            
            <DialogContent >
                <Typography variant="caption" letterSpacing={2}>ABOUT</Typography>
                <br />
              <br />
                <div className="shadow-md p-3">
                    {
                        complaint && <>
                        <Typography>{complaint.subject}</Typography>
                    <Typography variant="subtitle2" sx={{mt:3}}>
                        {
                            complaint.details
                        }
                    </Typography>
                        </>
                    }

                </div>
                <Typography sx={{my:2}}>Resolution</Typography>
                <div className="d-flex align-items-center">
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
                </div>
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
       }
       </>
    )
}
export default Complaints