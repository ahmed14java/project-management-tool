import axios from 'axios';
import { SET_CURRENT_USER, GET_ERRORS } from './types';
import setJwtToken from '../securityUtils/setJwtToken';
import  jwt_decode from "jwt-decode";

export const createNewUser = (newUser , history)  => async dispatch => {
    try {
        await axios.post('/api/users/register' , newUser);
        history.push('/login');
        dispatch({
            type: GET_ERRORS,
            payload: {}
        })
    } catch (err) {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }) 
    }
}

export const login = (LoginRequest) => async dispatch => {
    
    try {
        // post => login request
        const res = await axios.post('/api/users/login' , LoginRequest);
        // extract token from res.data
        const {token} = res.data
        // store the token in the localStorage
        localStorage.setItem('jwt' , token);
        // set our token in header ***
        setJwtToken(token);
            
    // decode token on react
    const decoded = jwt_decode(token);
    // dispatch to our securityReducer
    dispatch({
        type: SET_CURRENT_USER,
        payload: decoded
    })
    } catch (err) {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }) 
    }
}

export const logout = () => dispatch => {
    localStorage.removeItem('jwt');
    setJwtToken(false);
    dispatch({
        type: SET_CURRENT_USER,
        payload: {}
    })
}