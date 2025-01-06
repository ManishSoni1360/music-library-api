import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized Access",
        error: null,
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findOne({
      user_id: decoded.user_id,
    });

    if (!user) {
      res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized Access",
        error: null,
      });
      return;
    }

    req.user = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      data: null,
      message: "Unauthorized Access",
      error: null,
    });
    return;
  }
};

export const authorizeAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "Admin") {
    res.status(403).json({
      status: 403,
      data: null,
      message: "Forbidden Access/Operation not allowed.",
      error: null,
    });
    return;
  }
  next();
};

export const authorizeEditorOrAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!["Admin", "Editor"].includes(req.user?.role || "")) {
    res.status(403).json({
      status: 403,
      data: null,
      message: "Forbidden Access/Operation not allowed.",
      error: null,
    });
    return;
  }
  next();
};
