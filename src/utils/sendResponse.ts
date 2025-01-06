import { Response } from "express";

export class SendResponse {
  private status: number;
  private data: any;
  private message: string | null;
  private error: string | null;

  constructor(
    status: number,
    message: string | null = null,
    data: any = null,
    error: string | null = null
  ) {
    this.status = status;
    this.data = data;
    this.message = message;
    this.error = error;
  }

  send(res: Response): void {
    res.status(this.status).json({
      status: this.status,
      data: this.data,
      message: this.message,
      error: this.error,
    });
  }
  sendBadRequest(res: Response) {
    res.status(this.status).json({
      status: this.status,
      data: this.data,
      message: this.message || "Bad Request",
      error: this.error,
    });
  }
  sendFieldMissing(res: Response) {
    res.status(this.status).json({
      status: this.status,
      data: this.data,
      message: this.message || "Bad Request, Missing required fields",
      error: this.error,
    });
  }
  sendAccessForbidden(res: Response) {
    res.status(this.status).json({
      status: this.status,
      data: this.data,
      message: this.message || "Forbidden Access/Operation not allowed.",
      error: this.error,
    });
  }
}
