import { Router } from "express";
import {verifyToken} from '../middleware/Authmiddleware.js'
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/ContactsControllers.js";

const contactsRouts=Router();

contactsRouts.post("/search",verifyToken,searchContacts);
contactsRouts.get("/get-contacts-for-dm",verifyToken,getContactsForDMList);
contactsRouts.get('/get-all-contacts',verifyToken,getAllContacts)

export default contactsRouts;