import axios from "axios";

const API = "http://localhost:8080";

const getToken = () => {
    return localStorage.getItem("token");
};

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

// START TIMER
export const startTimer = async (projectId) => {
    return axios.post(
        `${API}/projects/${projectId}/time/start`,
        {},
        authHeader()
    );
};

// PAUSE TIMER
export const pauseTimer = async (trackingId) => {
    return axios.patch(
        `${API}/time/${trackingId}/pause`,
        {},
        authHeader()
    );
};

// RESUME TIMER
export const resumeTimer = async (trackingId) => {
    return axios.patch(
        `${API}/time/${trackingId}/resume`,
        {},
        authHeader()
    );
};

// STOP TIMER
export const stopTimer = async (trackingId) => {
    return axios.patch(
        `${API}/time/${trackingId}/stop`,
        {},
        authHeader()
    );
};

// GET PROJECT TIME
export const getProjectTime = async (projectId) => {
    return axios.get(
        `${API}/projects/${projectId}/time`,
        authHeader()
    );
};

// GET LOGS
export const getTimeLogs = async (projectId) => {
    return axios.get(
        `${API}/projects/${projectId}/time/logs`,
        authHeader()
    );
};