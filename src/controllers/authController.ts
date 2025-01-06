import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserService } from "../services/userService";
import { SendResponse } from "../utils/sendResponse";
import User from "../models/User";

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(User);
  }

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        new SendResponse(400).sendFieldMissing(res);
        return;
      }

      const existingUser = await this.userService.getUser({ email }, {});

      if (existingUser) {
        new SendResponse(409, "Email already exists.").send(res);
        return;
      }

      const countUser = await this.userService.countDocuments({});
      const hashedPassword = await bcrypt.hash(password, 10);

      await this.userService.addUser(
        hashedPassword,
        email,
        countUser === 0 ? "Admin" : "Viewer"
      );
      new SendResponse(201, "User created successfully.").send(res);
    } catch (error: any) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        new SendResponse(400).sendFieldMissing(res);
        return;
      }

      const user: any = await this.userService.getUser({ email }, {});

      if (!user) {
        new SendResponse(404, "User not found").send(res);
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        new SendResponse(400, "Invalid password").send(res);
        return;
      }

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      new SendResponse(200, "Login successful", token).send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      new SendResponse(200, "User logged out successfully").send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };
}
