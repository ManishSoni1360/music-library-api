import mongoose, { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export class AlbumService {
  private albumModel: Model<Document>;
  constructor(albumModel: Model<Document>) {
    this.albumModel = albumModel;
  }

  getAllAlbums = async (
    where: Record<string, any>,
    projection: Record<string, any>,
    skip: number,
    limit: number
  ): Promise<Document[]> => {
    const albums = await this.albumModel
      .find(where, projection)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "artist_id",
        select: "name",
        model: "Artist",
        localField: "artist_id",
        foreignField: "artist_id",
      });
    return albums;
  };

  getAlbum = async (
    where: Record<string, any>,
    projection: Record<string, any>
  ): Promise<Document | null> => {
    const album = await this.albumModel.findOne(where, projection).populate({
      path: "artist_id",
      select: "name",
      model: "Artist",
      localField: "artist_id",
      foreignField: "artist_id",
    });
    return album;
  };

  addAlbum = async (
    artist_id: string,
    name: string,
    year: number,
    hidden: boolean
  ): Promise<void> => {
    await this.albumModel.create({
      album_id: uuidv4(),
      artist_id,
      name,
      year,
      hidden,
    });
  };

  updateAlbum = async (
    where: Record<string, any>,
    query: Record<string, any>
  ): Promise<void> => {
    await this.albumModel.updateOne(where, query);
  };

  deleteAlbum = async (
    where: Record<string, any>,
    trackModel: Model<Document>
  ): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    await trackModel.deleteMany(where).session(session);
    await this.albumModel.deleteOne(where).session(session);
    await session.commitTransaction();
    session.endSession();
  };
}
