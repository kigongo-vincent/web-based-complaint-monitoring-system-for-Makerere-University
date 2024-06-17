import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./tools/AuthReducer";
import ProgrammesReducer from "./tools/ProgrammesReducer";
export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        programmes: ProgrammesReducer
    }
})