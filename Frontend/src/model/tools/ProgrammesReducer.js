import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

const initialState ={
    URL: "http://localhost:8000",
    programmes: {
        items: [],
        loading: false
    },
    lecturers: {
        items: [],
        loading: false
    },
    courses: {
        items: [],
        loading: false
    }
}


//fetch programmes
export const getProgrammes = createAsyncThunk("programmes/getProgrammes", async()=>{
    const response= await fetch(`${initialState.URL}/programmes`)
    return await response.json()
})

//fetch lecturers
export const getLecturers = createAsyncThunk("programmes/getLecturers", async()=>{
    const response= await fetch(`${initialState.URL}/lecturers`)
    return await response.json()
})

export const ProgrammesSlice = createSlice({
    initialState,
    name : "Programmes-slice",
    reducers:{
        AddProgramme:(state, action)=>{
            state.programmes.items.push(action.payload)
        }
    },
    extraReducers:(builder)=>{
        // fetching programmes 
        builder.addCase(getProgrammes.pending, (state)=>{
            state.programmes.loading = true
        })

        //success on fetching programmes
        builder.addCase(getProgrammes.fulfilled, (state, action)=>{
            state.programmes.items = action.payload
            state.programmes.loading = false
        })

        //success on fetching lecturers
        builder.addCase(getLecturers.fulfilled, (state, action)=>{
            state.lecturers.items = action.payload
            state.lecturers.loading = false
        })

        //failure to fetch programmes
        builder.addCase(getProgrammes.rejected, (state)=>{
            state.programmes.loading = false
        })
    }
})

export const allProgrammes = (state)=>state.programmes.programmes.items

export const allLecturers = (state)=>state.programmes.lecturers.items

export const {AddProgramme} = ProgrammesSlice.actions

export default ProgrammesSlice.reducer