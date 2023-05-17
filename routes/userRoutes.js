import express from "express";
import {
    getUsers,
    createUsers,
    updateUsers,
    deleteUsers,
    getUserById
} from "../controllers/Users.js";
import { verifyUser, adminOnly} from "../middleware/authUser.js";

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUsers);
router.get('/users/:id', verifyUser, adminOnly, getUserById);
router.post('/users', verifyUser, adminOnly, createUsers);
router.patch('/users/:id', verifyUser, adminOnly, updateUsers);
router.delete('/users/:id', verifyUser, adminOnly, deleteUsers);

export default router;