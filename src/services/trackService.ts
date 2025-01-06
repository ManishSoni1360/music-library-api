import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export class TrackService {
  private trackModel: Model<Document>;

  constructor(trackModel: Model<Document>) {
    this.trackModel = trackModel;
  }

  getAllTracks = async (
    where: Record<string, any>,
    projection: Record<string, any>,
    skip: number,
    limit: number
  ): Promise<Document[]> => {
    const tracks = await this.trackModel
      .find(where, projection)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "artist_id",
        select: "name",
        model: "Artist",
        localField: "artist_id",
        foreignField: "artist_id",
      })
      .populate({
        path: "album_id",
        select: "name",
        model: "Album",
        localField: "album_id",
        foreignField: "album_id",
      });
    return tracks;
  };

  getTrack = async (
    where: Record<string, any>,
    projection: Record<string, any>
  ): Promise<Document | null> => {
    const track = await this.trackModel
      .findOne(where, projection)
      .populate({
        path: "artist_id",
        select: "name",
        model: "Artist",
        localField: "artist_id",
        foreignField: "artist_id",
      })
      .populate({
        path: "album_id",
        select: "name",
        model: "Album",
        localField: "album_id",
        foreignField: "album_id",
      });
    return track;
  };
  addTrack = async (query: Record<string, any>): Promise<void> => {
    query.track_id = uuidv4();
    await this.trackModel.create(query);
  };

  updateTrack = async (
    where: Record<string, any>,
    query: Record<string, any>
  ): Promise<void> => {
    await this.trackModel.updateOne(where, query);
  };

  deleteTrack = async (where: Record<string, any>): Promise<void> => {
    await this.trackModel.deleteOne(where);
  };
}
