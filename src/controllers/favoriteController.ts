import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { FavoriteService } from "../services/favoriteService";
import Artist from "../models/Artist";
import Album from "../models/Album";
import Track from "../models/Track";
import Favorites from "../models/Favorites";
import { SendResponse } from "../utils/sendResponse";
import { ArtistService } from "../services/artistService";
import { AlbumService } from "../services/albumService";
import { TrackService } from "../services/trackService";

export class FavoriteController {
  private favoriteService: FavoriteService;
  private artistService: ArtistService;
  private albumService: AlbumService;
  private trackService: TrackService;

  constructor() {
    this.favoriteService = new FavoriteService(Favorites);
    this.artistService = new ArtistService(Artist);
    this.albumService = new AlbumService(Album);
    this.trackService = new TrackService(Track);
  }
  getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { category } = req.params;
      const { limit = 5, offset = 0 } = req.query;
      const user_id = req.user?.user_id;

      if (!category) {
        new SendResponse(400).sendFieldMissing(res);
        return;
      }

      if (!["artist", "album", "track"].includes(category)) {
        new SendResponse(400).sendBadRequest(res);
        return;
      }

      const favorites: any[] = await this.favoriteService.getFavorite(
        {
          user_id,
          category,
        },
        {},
        Number(offset),
        Number(limit)
      );
      console.log("favorite", favorites);
      const formattedFavorites: any[] = await Promise.all(
        favorites.map(async (fav) => {
          const item: any =
            category === "artist"
              ? await this.artistService.getArtist(
                  { artist_id: fav.item_id },
                  { name: true }
                )
              : category === "album"
              ? await this.albumService.getAlbum(
                  { album_id: fav.item_id },
                  { name: true }
                )
              : category === "track"
              ? await this.trackService.getTrack(
                  { track_id: fav.item_id },
                  { name: true }
                )
              : undefined;

          return {
            favorite_id: fav.favorite_id,
            category: fav.category,
            item_id: fav.item_id,
            name: item && item.name ? item.name : "",
            created_at: fav.createdAt,
          };
        })
      );

      new SendResponse(
        200,
        "Favorites retrieved successfully.",
        formattedFavorites
      ).send(res);
    } catch (error) {
      console.log("error", error);
      new SendResponse(400, "Bad Request").send(res);
    }
  };

  addFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { category, item_id } = req.body;
      const user_id = req.user?.user_id;

      if (!category || !item_id) {
        new SendResponse(400).sendFieldMissing(res);
        return;
      }

      if (!["artist", "album", "track"].includes(category)) {
        new SendResponse(400).sendBadRequest(res);
        return;
      }

      let itemExists = false;
      switch (category) {
        case "artist":
          itemExists =
            (await this.artistService.getArtist(
              {
                artist_id: item_id,
              },
              {}
            )) !== null;
          break;
        case "album":
          itemExists =
            (await this.albumService.getAlbum(
              {
                album_id: item_id,
              },
              {}
            )) !== null;
          break;
        case "track":
          itemExists =
            (await this.trackService.getTrack(
              {
                track_id: item_id,
              },
              {}
            )) !== null;
          break;
      }

      if (!itemExists) {
        new SendResponse(404, "Resource Doesn't Exist").send(res);
        return;
      }

      const existingFavorite = await this.favoriteService.checkFavorite({
        user_id,
        category,
        item_id,
      });

      if (existingFavorite) {
        new SendResponse(400, "Item already in favorites").send(res);
        return;
      }
      await this.favoriteService.addFavorite({
        user_id,
        category,
        item_id,
      });

      new SendResponse(201, "Favorite added successfully.").send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  removeFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user_id = req.user?.user_id;

      const favorite = await this.favoriteService.checkFavorite({
        favorite_id: id,
        user_id,
      });

      if (!favorite) {
        new SendResponse(404, "Resource Doesn't Exist").send(res);
        return;
      }

      await this.favoriteService.deleteFavorite({
        favorite_id: id,
      });

      new SendResponse(200, "Favorite removed successfully.").send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };
}
