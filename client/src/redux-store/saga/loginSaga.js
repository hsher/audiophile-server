import axios from "axios";
import { put, call, takeLatest } from "redux-saga/effects";
import { checkAuth, login, logout, registration, setError, setLoading } from "../slices/loginSlice";
import { loginActions } from "./sagaActions";


export const API_URL = 'http://localhost:5001/api'

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
});


function* loginWorker(action) {
    const { 
        payload: {email, password} 
    } = action;

    try {
        const response = yield call($api.post, `${API_URL}/login`, {email, password}); //TODO: need refactor for call request. delete ${LOCAL_HOST}${PORT}

        localStorage.setItem('token', response.data.accessToken);
        yield put(login(response.data.user))
    } catch(e) {
        console.log(e.response.data.message) //TODO: delete all error logs
        yield put(setError(e.response.data.message))
    }
}

function* logoutWorker() {
    try {
        yield call($api.post, `${API_URL}/logout`);
        localStorage.removeItem('token');
        yield put(logout());
    } catch(e) {
        console.log(e.response.data.message) // delete all error logs
        yield put(setError(e.response.data.message))
    }
}

function* registrationWorker(action) {
    const { 
        payload: {email, password} 
    } = action;

    try {
        const response = yield call($api.post, `${API_URL}/registration`, {email, password}); //TODO: need refactor for call request. delete ${LOCAL_HOST}${PORT}
        localStorage.setItem('token', response.data.accessToken);
        yield put(registration(response.data.user));
    } catch(e) {
        console.log(e.response.data.message) //TODO: delete all error logs
        yield put(setError(e.response.data.message))
    }
}

function* checkAuthWorker() {
    yield put(setLoading(true));
    try {
        const response = yield call(axios.get, `${API_URL}/refresh`, {withCredentials: true}); //TODO: need refactor for call request. delete ${LOCAL_HOST}${PORT}
        localStorage.setItem('token', response.data.accessToken);
        yield put(checkAuth(response.data.user));
    } catch(e) {
        console.log(e.response.data.message) //TODO: delete all error logs
    }
    yield put(setLoading(false))
}

export function* loginWatcher() {
    yield takeLatest(loginActions.LOGIN, loginWorker)
    yield takeLatest(loginActions.LOGOUT, logoutWorker)
    yield takeLatest(loginActions.REGISTRATION, registrationWorker)
    yield takeLatest(loginActions.CHECK_AUTH, checkAuthWorker)
}

