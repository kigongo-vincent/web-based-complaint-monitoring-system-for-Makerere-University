import { Box, Typography } from "@mui/material"
const StatisticsContainer =({figure, icon, label, bgcolor, darkMode})=>{
    return (
        <Box role="button" display="flex"  alignItems="center" sx={{mr:2}}>
                <Box bgcolor={bgcolor} sx={{px:3, py:1}} className={`${darkMode && "text-light"} primary rounded`}>
                    <Typography variant="h5">{figure}</Typography>
                    <Box display="flex" className="opacity-75" alignItems="center" sx={{mt:1}}>
                        <div style={{marginRight: 5}}>
                        {icon}
                        </div>
                        <Typography>{label}</Typography>
                    </Box>
                </Box>
            </Box>
    )
}
export default StatisticsContainer