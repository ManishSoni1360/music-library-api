import { Response } from "express";
import { UserService } from "../services/userService";
import { AuthRequest } from "../middlewares/auth";
import bcrypt from "bcrypt";
import { SendResponse } from "../utils/sendResponse";
import User from "../models/User";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(User);
  }

  getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { limit = 5, offset = 0, role } = req.query;

      const where = role ? { role } : {};

      const users = await this.userService.getAllUsers(
        where,
        { user_id: true, email: true, role: true, created_at: true },
        Number(offset),
        Number(limit)
      );

      new SendResponse(200, "Users retrieved successfully.", users).send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };
  addUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        new SendResponse(400).sendBadRequest(res);
        return;
      }

      if (!["Editor", "Viewer"].includes(role)) {
        new SendResponse(403).sendAccessForbidden(res);
        return;
      }

      const existingUser = await this.userService.getUser({ email }, {});

      if (existingUser) {
        new SendResponse(409, "Email already exists.").send(res);
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userService.addUser(hashedPassword, email, role);

      new SendResponse(201, "User created successfully.").send(res);
    } catch (error: any) {
      new SendResponse(400).sendBadRequest(res);
    }
  };
  deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await this.userService.getUser({ user_id: id }, {});

      if (!user) {
        new SendResponse(404, "User not found.").send(res);
        return;
      }

      await this.userService.deleteUser({ user_id: id });
      new SendResponse(200, "User deleted successfully.").send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };
  updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { old_password, new_password } = req.body;
      const user_id = req.user?.user_id;

      if (!old_password || !new_password) {
        new SendResponse(400).sendAccessForbidden(res);
        return;
      }

      const user: any = await this.userService.getUser({ user_id }, {});
      if (!user) {
        new SendResponse(404, "User not found").send(res);
        return;
      }

      const isPasswordValid = await bcrypt.compare(old_password, user.password);
      if (!isPasswordValid) {
        new SendResponse(400, "Invalid old password").send(res);
        return;
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);
      await this.userService.updateUser(
        { user_id },
        { password: hashedPassword }
      );

      res.status(204).send();
    } catch (error) {
      new SendResponse(500, "Internal Server Error").send(res);
    }
  };
}
