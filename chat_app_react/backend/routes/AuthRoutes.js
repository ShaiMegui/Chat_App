import { Router } from "express";
import {
  getUserInfo,
  login,
  signup,
  updateProfil,
  updateProfilImage,
  RemoveProfilImage,
  logout,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const uploads = multer({ dest: "uploads/profils/" });

const authRoute = Router();

authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.get("/userInfo", verifyToken, getUserInfo);
authRoute.post("/updateProfil", verifyToken, updateProfil);
authRoute.post(
  "/updateProfilImage",
  verifyToken,
  uploads.single("profil-image"),
  updateProfilImage
);
authRoute.delete("/remove-profil-image",verifyToken,RemoveProfilImage);
authRoute.post('/logout',logout)

export default authRoute;
