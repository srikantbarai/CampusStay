import express from "express";
import { getStudentAllotment, getAvailableRooms, allotRoom } from "../controllers/student.control.js";

const router = express.Router();

router.get("/allotment", getStudentAllotment);
router.get("/rooms", getAvailableRooms);
router.post("/rooms/:roomId",allotRoom);

export default router;