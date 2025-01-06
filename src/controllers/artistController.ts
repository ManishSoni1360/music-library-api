import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import Artist from "../models/Artist";
import Track from "../models/Track";
import Album from "../models/Album";
import { ArtistService } from "../services/artistService";
import { SendResponse } from "../utils/sendResponse";

export class ArtistController {
  private artistService: ArtistService;

  constructor() {
    this.artistService = new ArtistService(Artist);
  }

  getAllArtists = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { limit = 5, offset = 0, grammy, hidden } = req.query;

      const where: any = {};
      if (grammy !== undefined) {
        where.grammy = Number(grammy);
      }
      if (hidden !== undefined) {
        where.hidden = hidden === "true";
      }
      const artists = await this.artistService.getAllArtists(
        where,
        {
          _id: false,
          artist_id: true,
          name: true,
          grammy: true,
          hidden: true,
        },
        Number(offset),
        Number(limit)
      );

      new SendResponse(200, "Artists retrieved successfully.", artists).send(
        res
      );
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  getArtist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const artist = await this.artistService.getArtist(
        {
          artist_id: id,
        },
        { _id: false, artist_id: true, name: true, grammy: true, hidden: true }
      );

      if (!artist) {
        new SendResponse(404, "Artist not found.").send(res);
        return;
      }

      new SendResponse(200, "Artist retrieved successfully.", artist).send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  addArtist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, grammy, hidden = false } = req.body;

      if (!name || grammy === undefined) {
        new SendResponse(400).sendFieldMissing(res);
        return;
      }

      await this.artistService.addArtist(name, Number(grammy), hidden);
      new SendResponse(201, "Artist created successfully.").send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  updateArtist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, grammy, hidden } = req.body;

      const artist: any = await this.artistService.getArtist(
        {
          artist_id: id,
        },
        {}
      );

      if (!artist) {
        new SendResponse(404, "Artist not found.");
        return;
      }

      await this.artistService.updatArtist(
        { artist_id: id },
        {
          name: name || artist.name,
          grammy: grammy !== undefined ? Number(grammy) : artist.grammy,
          hidden: hidden !== undefined ? hidden : artist.hidden,
        }
      );

      res.status(204).send();
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  deleteArtist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const artist: any = await this.artistService.getArtist(
        {
          artist_id: id,
        },
        {}
      );

      if (!artist) {
        new SendResponse(404, "Artist not found.").send(res);
        return;
      }

      await this.artistService.deleteArtist({ artist_id: id }, Album, Track);

      new SendResponse(200, `Artist:${artist.name} deleted successfully.`, {
        artist_id: id,
      }).send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };
}
