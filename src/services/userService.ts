import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  private userModel: Model<Document>;
  constructor(userModel: Model<Document>) {
    this.userModel = userModel;
  }

  getUser = async (
    where: Record<string, any>,
    projection: Record<string, any>
  ): Promise<Document | null> => {
    const user = await this.userModel.findOne(where).exec();
    return user;
  };

  getAllUsers = async (
    where: Record<string, any>,
    projection: Record<string, any>,
    offset: number,
    limit: number
  ): Promise<Document[]> => {
    const users = await this.userModel.find(where, projection, {
      skip: offset,
      limit: limit,
    });
    return users;
  };

  countDocuments = async (where: Record<string, any>): Promise<number> => {
    const count = await this.userModel.countDocuments(where);
    return count;
  };

  addUser = async (
    password: string,
    email: string,
    role: string
  ): Promise<void> => {
    const newUser = new this.userModel({
      user_id: uuidv4(),
      email,
      password,
      role: role as "Editor" | "Viewer",
    });
    await newUser.save();
  };

  deleteUser = async (where: Record<string, any>): Promise<void> => {
    await this.userModel.deleteOne(where);
  };

  updateUser = async (
    where: Record<string, any>,
    query: Record<string, any>
  ): Promise<void> => {
    await this.userModel.updateOne(where, query);
  };
}
