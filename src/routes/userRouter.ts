import { Router } from "express";
import {
  authenticateToken,
  authorizeAdmin,
  authorizeEditorOrAdmin,
} from "../middlewares/auth";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();

router.get("/", authenticateToken, authorizeAdmin, userController.getAllUsers);
router.post(
  "/add-user",
  authenticateToken,
  authorizeAdmin,
  userController.addUser
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  userController.deleteUser
);
router.put(
  "/update-password",
  authenticateToken,
  authorizeEditorOrAdmin,
  userController.updatePassword
);

export default router;
