import express from "express";
import {createStudent, listRooms, listStudents, deleteStudent } from "../controllers/admin.control.js";

const router = express.Router();

router.post("/students", createStudent);
router.get("/students", listStudents)
router.delete("/students/:studentId",deleteStudent);
router.get("/rooms", listRooms);

export default router;