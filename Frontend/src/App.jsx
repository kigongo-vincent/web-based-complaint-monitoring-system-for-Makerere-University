import {Route, Routes} from 'react-router-dom'
import Login from './pages/Auth/Login'
import Verify from './pages/Auth/Verify'
import Bursar from './pages/bursar/Bursar'
import Lecturer from './pages/lecturer/Lecturer'
import Student from './pages/student/Student'
import Registrar from './pages/registrar/Registrar'
import NotFound from './pages/Auth/NotFound'
import { ThemeProvider, colors, createTheme } from '@mui/material'
import SplashScreen from './pages/Auth/SplashScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getLecturers, getProgrammes } from './model/tools/ProgrammesReducer'
const App=()=>{

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getProgrammes())
        dispatch(getLecturers())
    },[])

    const theme = createTheme(
        {
            palette:{
                primary:{
                    main: "rgb(30, 169, 78)"
                },
                secondary:{
                    main: "rgb(221, 30, 75)"
                },
            }
        }
    )


return(
    <ThemeProvider theme={theme}>
    <Routes>
        <Route path='/' Component={SplashScreen}/>
        <Route path='/login' Component={Login}/>
        <Route path='/verify' Component={Verify}/>
        <Route path='/bursar/*' Component={Bursar}/>
        <Route path='/lecturer/*' Component={Lecturer}/>
        <Route path='/student/*' Component={Student}/>
        <Route path='/registrar/*' Component={Registrar}/>
        <Route path='*' Component={NotFound}/>
    </Routes>
    </ThemeProvider>
)
}
export default App