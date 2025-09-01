import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import axios from "axios";
import { resetErrorAction, resetSuccessAction } from "../globalSlices/globalSlice";

const INITIAL_STATE = {
    loading: false,
    error: null,
    users:[],
    success: false,
    isUpdated: false,
    isDeleted: false,
    isEmailSent: false,
    isPasswordReset: false,
    profile: {},
    userAuth: {
        error: null,
        userInfo: localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")):null,
    },
};

//! Login Action
export const loginAction = createAsyncThunk(
    'users/login',
    async (payload, {rejectWithValue, getState, dispatch}) => {
        //make request
        try{
          const {data} = await axios.post(
            "http://localhost:3000/api/v1/users/login",
            payload
          );
          localStorage.setItem("userInfo",JSON.stringify(data));
          return data;
          
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//! Get User Public Profile Action
export const userPublicProfileAction = createAsyncThunk(
    "users/user-public-profile",
    async(userId,{rejectWithValue,getState,dispatch})=> {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
             const userId = getState().users?.userAuth?.userInfo?._id; 
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const {data} = await axios.get(
                `http://localhost:3000/api/v1/users/public-profile/${userId}`,
                config
            );
            return data;
        } catch(error) {
            return rejectWithValue(error?.response?.data);
        }
    }
)

//Code after loginAction

//!Logout action
export const logoutAction = createAsyncThunk("users/logout", async()=> {
    //remove token from localstorage
    localStorage.removeItem("userInfo");
    return true;
});

export const registerAction = createAsyncThunk(
    "users/register",
    async(payload,{rejectWithValue,getState,dispatch})=> {
        //make request
        try {
            const {data} = await axios.post(
                "http://localhost:3000/api/v1/users/register", 
                payload
            );
            return data;
        } catch(error) {
            return
            rejectWithValue(error?.response?.data);
        
        }
    }
);

//! Users slices

const usersSlice = createSlice({
    name:"users",
    initialState:INITIAL_STATE,
    extraReducers:(builder)=> {
        //Login
        builder.addCase(loginAction.pending,(state,action)=> {
            console.log("pending", loginAction.pending);
            state.loading = true;
        });
        builder.addCase(loginAction.fulfilled,(state,action)=> {
            console.log("success",action.payload);
            console.log("loginAction",loginAction.fulfilled);
            state.success= true;
            state.userAuth.userInfo = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(loginAction.rejected,(state,action)=> {
            console.log("failed",action.payload);
            state.error= action.payload;
            state.loading = false;
            state.success = false;
        });

        //Register 
        builder.addCase(registerAction.pending,(state,action)=> {
            console.log("pending",registerAction.pending);
            state.loading = true;
        });

        builder.addCase(registerAction.fulfilled,(state,action)=>{
            console.log("success",action.payload);
            console.log("registerAction",registerAction.fulfilled);
            state.success = true;
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(registerAction.rejected,(state,action)=> {
            console.log("failed",action.payload);
            state.error = action.payload;
            state.loading = false;
            state.success = false;
        });

        //get user public profile
        builder.addCase(userPublicProfileAction.pending,(state,action)=> {
            state.loading = true;
        });
         builder.addCase(userPublicProfileAction.fulfilled,(state,action)=> {
            state.profile = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(userPublicProfileAction.rejected,(state,action)=> {
            state.error = action.payload;
            state.loading = false;
        });

        //!Reset error action
        builder.addCase(resetErrorAction,(state)=> {
            state.error = null;
        });

        //!Reset Success action
        builder.addCase(resetSuccessAction,(state)=> {
            state.success = false;
        })

        
    },
});

//! generate reducer

const usersReducer = usersSlice.reducer;

export default usersReducer;