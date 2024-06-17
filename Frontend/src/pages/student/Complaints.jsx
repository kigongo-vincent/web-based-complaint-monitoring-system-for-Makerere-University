
import { Alarm, CheckCircle, Close, PriorityHighRounded } from "@material-ui/icons"
import { Box, Typography, IconButton, Button, Dialog, DialogContent, DialogActions, DialogTitle, Skeleton } from "@mui/material"
import { useEffect, useState } from "react"
import { FaCalendar, FaChalkboardTeacher, FaCheckDouble, FaClock, FaSadTear } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getAuthInformation } from "../../model/tools/AuthReducer"
import {getRelativeTime} from '../../utils/getRelativeTime'
const Complaints =()=>{
    const {category} = useParams()
    const navigate = useNavigate()

    const auth = useSelector(getAuthInformation)

    const [open,setOpen] = useState(false)

    const [loading, setLoading] = useState(true)
    

    const [comp, setComp] = useState(null) 

    const [complaints, setComplaints] = useState([])

    const getComplaints = async()=>{
        setLoading(true)
        const response = await fetch(`${auth.URL}/sent_complaints/${auth?.user?.user_id}`)
        console.log(response.status)
        if(response.status == 200){
            const data = await response.json()

            setComplaints(
                category == "all"
                ?
                data
                :
                category == "pending"
                ?
                data.filter(complaint => complaint.status == "pending")
                :
                data.filter(complaint => complaint.status != "pending")
            )
            setLoading(false)
        }else{
            console.error("failed to load resources")
            setLoading(false)
        }
    }
    // const complaint = 
    //     {
    //         id: 1,
    //         reason: "missing marks",
    //         sent: "1st March, 2024",
    //         seen: false,
    //         lecturer: "Flowrence kivunike",
    //         status: "resolved",
    //         details: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis cupiditate veniam repellat explicabo placeat perspiciatis, officiis, dolore facere fugiat accusantium quos error provident? Dolorem quaerat veritatis atque voluptate nihil tempora. Voluptate, suscipit deserunt? Laborum eveniet vitae magni fugit possimus consectetur nemo explicabo nobis soluta, at, quae pariatur repellendus dolorem ipsum."

    //     }
    

    useEffect(()=>{
getComplaints()
    },[])
return(
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
        <Box display="flex" alignItems ="center" justifyContent={"space-between"}>
            <Typography textTransform={"uppercase"} variant="caption" letterSpacing={2}>
                {category} complaints
            </Typography>
            <IconButton onClick={()=>navigate(-1)}>
                <Close/>
            </IconButton>
        </Box>
        {
            complaints.length == 0
            ?
            <Typography className="my-4">No complaints found</Typography>
            :
            <table width={"100%"}  className="mt-3 bg-white">
    <tr>
        <td className="px-5 py-4"><b>Reason</b></td>
        <td><b>Sent</b></td>
        <td><b>Seen</b></td>
        
        {
            category != "pending" && <td><b>status</b></td>
        }

    </tr>
    {
        complaints.map((complaint)=>(
            <tr role="button" onClick={()=>{setComp(complaint),setOpen(true)}} className="list-item">
            <td className="px-5 py-3">{complaint.type}</td>
            <td>
                <span className="d-flex align-items-center">
                <FaClock size={13} className="text-success"/>
                <span className="mx-2 text-secondary">{getRelativeTime(complaint.created)}</span>
                </span>
                </td>
            <td>
            <span className="d-flex align-items-center">
                {
                    complaint.seen
                    ?
                    <FaCheckDouble size={10} className="text-success"/>
                    :
                    <FaSadTear className="text-warning" size={12}/>
                }
                <span className={`mx-2 ${complaint.seen ? 'text-success':'text-danger'}`}>{complaint.seen ? "seen": "not yet seen"}</span>
                </span>
            </td>
           
            {
                category != "pending" && <td>{complaint.status == "resolved" ? <Button  color="primary" startIcon={<CheckCircle/>} >Resolved</Button> 
                :
                complaint.status == "pending" ?
                
                <Button color="secondary" startIcon={<PriorityHighRounded size={13}/>}>pending</Button>
                :
                <Button color="info" startIcon={<FaChalkboardTeacher size={13}/>}>go to office</Button>
            }</td>
            }
        </tr> 
        ))
    }
    
        </table>
        }
        <Dialog open={open}>
            <DialogTitle>
                <Typography typography={"caption"} textTransform={"uppercase"} letterSpacing={2}>
                    Complaint details
                </Typography>
            </DialogTitle>
            <DialogContent>
                {
                    comp 
                    ?
                    comp.type == "missing marks complaint"
                    ?
                    <Typography>You made a complaint about missing marks for <u className="text-success">{comp.courseName}</u>, a courseunit you covered in <u className="text-success">{comp.year_of_study}</u> semester {comp.semester}, your issue was the lack of  &nbsp;
                    {
                        comp.category == "both"
                        ?
                        "both the final exam and coursework marks"
                        :
                        comp.category == "exam"
                        ?
                        "exam marks"
                        :
                        "coursework marks"
                    }
                    </Typography>
                    :
                    <Box className="shadow-md p-3">
                    <Typography variant="h5" fontWeight={"bold"}>{comp.subject}</Typography>
                    <br />
                    <Typography>{comp.details}</Typography>
                    </Box>
                    :
                    ''
                }
            </DialogContent>
            <DialogActions>
                
                <Button onClick={()=>setOpen(false)} startIcon={<Close/>}>
                    close
                </Button>
                
            </DialogActions>
        </Dialog>
    </Box>
    }
    </>
)
}
export default Complaints