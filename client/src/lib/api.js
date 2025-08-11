import { axiosInstance } from "./axios.js";

export const login = async (email, password) => {
    console.log(email,password)
    const res = await axiosInstance.post("/auth/login", { email, password });
    return res.data;
}

export const getMyInfo = async () => {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
}

export const logout = async () => {
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
}

export const createStudent = async (studentData) => {
    const res = await axiosInstance.post("/admin/students", studentData);
    return res.data;
}

export const listStudents = async () => {
    const res = await axiosInstance.get("/admin/students");
    return res.data;
}

export const deleteStudent = async (studentId) => {
    const res = await axiosInstance.delete(`/admin/students/${studentId}`);
    return res.data;
}

export const listRooms = async (filters = {}) => {
    const res = await axiosInstance.get("/admin/rooms", {
        params: filters
    });
    return res.data;
}

export const getStudentAllotment = async () => {
    const res = await axiosInstance.get("/student/allotment");
    return res.data;
}

export const getAvailableRooms = async (filters = {}) => {
    const res = await axiosInstance.get("/student/rooms", {
        params: filters
    });
    return res.data;
}

export const allotRoom = async (roomId) => {
    const res = await axiosInstance.post(`/student/rooms/${roomId}`);
    return res.data;
}