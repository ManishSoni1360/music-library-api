import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export class FavoriteService {
  private favoriteModel: Model<Document>;
  constructor(favoriteModel: Model<Document>) {
    this.favoriteModel = favoriteModel;
  }

  getFavorite = async (
    where: Record<string, any>,
    projection: Record<string, any>,
    skip: number,
    limit: number
  ): Promise<Document[]> => {
    const favorites = await this.favoriteModel
      .find(where, projection)
      .skip(skip)
      .limit(limit);

    return favorites;
  };

  checkFavorite = async (
    where: Record<string, any>
  ): Promise<Document | null> => {
    const favorite = await this.favoriteModel.findOne(where);
    return favorite;
  };

  addFavorite = async (query: Record<string, any>): Promise<void> => {
    query.favorite_id = uuidv4();
    await this.favoriteModel.create(query);
  };

  deleteFavorite = async (where: Record<string, any>): Promise<void> => {
    await this.favoriteModel.deleteOne(where);
  };
}
