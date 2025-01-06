import mongoose, { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export class ArtistService {
  private artistModel: Model<Document>;
  constructor(artistModel: Model<Document>) {
    this.artistModel = artistModel;
  }

  getAllArtists = async (
    where: Record<string, any>,
    projection: Record<string, any>,
    skip: number,
    limit: number
  ): Promise<Document[]> => {
    const artists = await this.artistModel
      .find(where, projection)
      .skip(skip)
      .limit(limit);
    return artists;
  };

  getArtist = async (
    where: Record<string, any>,
    projection: Record<string, any>
  ): Promise<Document | null> => {
    const artist = await this.artistModel.findOne(where, projection);
    return artist;
  };

  addArtist = async (
    name: string,
    grammy: number,
    hidden: boolean
  ): Promise<void> => {
    const newArtist = new this.artistModel({
      artist_id: uuidv4(),
      name,
      grammy,
      hidden,
    });
    await newArtist.save();
  };

  updatArtist = async (
    where: Record<string, any>,
    query: Record<string, any>
  ): Promise<void> => {
    await this.artistModel.updateOne(where, query);
  };

  deleteArtist = async (
    where: Record<string, any>,
    albumModel: Model<Document>,
    trackModel: Model<Document>
  ): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    await trackModel.deleteMany(where).session(session);
    await albumModel.deleteMany(where).session(session);
    await this.artistModel.deleteOne(where).session(session);
    await session.commitTransaction();
    session.endSession();
  };
}
