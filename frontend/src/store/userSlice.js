import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id:"",
    name:"",
    username:"",
    auth:false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const{_id, name, username, auth} = action.payload;
            state._id = _id;
            state.name = name;
            state.username = username;
            state.auth = auth;
        },
        resetUser: (state, action) => {
            state._id = "";
            state.name = "";
            state.username = "";
            state.auth = false;
        }
    }
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;