import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
const savedUser = JSON.parse(localStorage.getItem("user"))

const initialState = {
    URL: "http://localhost:8000",
    is_open: false,
    years: [],
    loading: false,
    error: false,
    user:{
        isLoggedIn: savedUser?.isLoggedIn,
        username: savedUser?.username,
        email: savedUser?.email,
        programme: savedUser?.programme,
        user_id: savedUser?.user_id,
        has_profile: savedUser?.has_profile,
        registration_number: savedUser?.registration_number,
        student_number: savedUser?.student_number,
        role: savedUser?.role,
        tokens: {
            access: savedUser?.tokens?.access,
            refresh: savedUser?.tokens?.refresh
        }
    }
}

export const SignIn = createAsyncThunk("auth/signin", async(OTP)=>{
const response = await fetch(initialState.URL+'/verify/',{
    method: "POST",
    body: JSON.stringify({OTP: OTP}),
    headers:{
        'Content-type': 'application/json'
    }
})
return {
    status : response.status,
    data:await response.json()
}
})

export const getYears = createAsyncThunk("auth/getYears", async()=>{
    const response = await fetch(`${initialState.URL}/academic_years`)
    return await response.json()
})

export const AuthSlice = createSlice({
    initialState,
    name: "AuthSlice",
    reducers:{
        removeAuthError: (state)=>{
            state.error = false
        },
        toggle_is_open : (state)=>{
            state.is_open = !state.is_open
        },
        logout: (state)=>{

            state.user = {}
            localStorage.removeItem("user")
        },
        update_profile:(state, action)=>{
            state.user.student_number = action.payload.student_number
            state.user.registration_number = action.payload.registration_number
            state.user.has_profile = true,
            state.user.programme = action.payload.programme
            localStorage.setItem("user", JSON.stringify(state.user))
        }
    },
    extraReducers:(builder)=>{

        // sign in 
        
        builder.addCase(SignIn.pending, (state)=>{
            state.loading = true
            })


        builder.addCase(getYears.fulfilled, (state, action)=>{
            state.years = action.payload
            })

        builder.addCase(SignIn.fulfilled, (state, action)=>{
            if(action.payload.status != 200){
                state.loading == false
                state.error = true


            }else{

                // if all goes well 

                state.user.email = action.payload.data.user.email
                state.user.registration_number = action.payload.data.user.registration_number
                state.user.student_number = action.payload.data.user.student_number
                state.user.role = action.payload.data.user.role
                state.user.user_id = action.payload.data.user.user_id
                state.user.programme = action.payload.data.user?.programme

                state.user.username = action.payload.data?.user?.email?.split('.')[0]?.split('.')[0]

                try{

                    state.user.tokens.access = action.payload?.data?.access
                    state.user.tokens.refresh = action.payload?.data?.refresh
                }
                catch{
                    console.log("invalid response")
                }
              

                let has_profile = action?.payload?.data?.user?.has_profile

                if(has_profile == "true"){
                    state.user.has_profile = true
                }else{
                    state.user.has_profile = false
                }
                
                state.user.isLoggedIn = true,

                state.loading = false

                localStorage.setItem("user",JSON.stringify(state.user) )

            }
        })  

        builder.addCase(SignIn.rejected, (state)=>{
            state.error = true
            state.loading = false
        })
        // end sign in 
     

    }
})

export const getAuthInformation = (state)=>state.auth

export const {removeAuthError, toggle_is_open, logout, update_profile} = AuthSlice.actions

export default AuthSlice.reducer