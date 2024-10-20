import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactForDMList, SearchContact } from "../controllers/ContactController.js";

const contactsRoutes=Router();

contactsRoutes.post("/search",verifyToken,SearchContact);
contactsRoutes.get("/get-contacts-for-dm",verifyToken,getContactForDMList)
contactsRoutes.get("/get-all-contacts",verifyToken,getAllContacts)


export default contactsRoutes 