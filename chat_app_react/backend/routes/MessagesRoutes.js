import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFiles } from "../controllers/MessagesController.js";
import multer from "multer";

const messageRoute = Router();

const uploads = multer({ dest: "uploads/files" });

messageRoute.post("/get-messages", verifyToken, getMessages);
messageRoute.post("/upload/files",verifyToken,uploads.single("file"),uploadFiles);

export default messageRoute;
