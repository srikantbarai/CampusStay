import express from "express";
import {createStudent,listRooms, deleteStudent } from "../controllers/admin.control.js";

const router = express.Router();

router.post("/students", createStudent);
router.get("/rooms", listRooms);
router.delete("/students/:studentId",deleteStudent);

export default router;