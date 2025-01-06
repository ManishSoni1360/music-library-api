import { Request, Response } from "express";
import Artist from "../models/Artist";
import Track from "../models/Track";
import Album from "../models/Album";
import { AlbumService } from "../services/albumService";
import { SendResponse } from "../utils/sendResponse";
import { ArtistService } from "../services/artistService";

export class AlbumController {
  private albumService: AlbumService;
  private artistService: ArtistService;

  constructor() {
    this.albumService = new AlbumService(Album);
    this.artistService = new ArtistService(Artist);
  }

  getAllAlbums = async (req: Request, res: Response): Promise<void> => {
    try {
      const { limit = 5, offset = 0, artist_id, hidden } = req.query;

      const where: any = {};
      if (artist_id) {
        where.artist_id = artist_id.toString();
      }
      if (hidden !== undefined) {
        where.hidden = hidden === "true";
      }

      const albums: any[] = await this.albumService.getAllAlbums(
        where,
        {
          _id: false,
          album_id: true,
          artist_name: true,
          name: true,
          year: true,
          hidden: true,
        },
        Number(offset),
        Number(limit)
      );

      const formattedAlbums = albums.map((album) => ({
        album_id: album.album_id,
        artist_name: album.artist_id.name,
        name: album.name,
        year: album.year,
        hidden: album.hidden,
      }));

      new SendResponse(
        200,
        "Albums retrieved successfully.",
        formattedAlbums
      ).send(res);
    } catch (error: any) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  getAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const album: any = await this.albumService.getAlbum(
        { album_id: id },
        {
          _id: false,
          album_id: true,
          artist_name: true,
          name: true,
          year: true,
          hidden: true,
        }
      );

      if (!album) {
        new SendResponse(404, "Resource Doesn't Exist").send(res);
        return;
      }

      const formattedAlbum = {
        album_id: album.album_id,
        artist_name: album.artist_id.name,
        name: album.name,
        year: album.year,
        hidden: album.hidden,
      };

      new SendResponse(
        200,
        "Album retrieved successfully.",
        formattedAlbum
      ).send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  addAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
      const { artist_id, name, year, hidden = false } = req.body;

      if (!artist_id || !name || !year) {
        res.status(400).json({
          status: 400,
          data: null,
          message: "Bad Request, Missing required fields",
          error: null,
        });
        return;
      }

      const artist = await this.artistService.getArtist(
        {
          artist_id,
        },
        { artist_id: true }
      );

      if (!artist) {
        new SendResponse(404, "Resource Doesn't Exist").send(res);
        return;
      }

      await this.albumService.addAlbum(artist_id, name, Number(year), hidden);
      new SendResponse(201, "Album created successfully.").send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  updateAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, year, hidden } = req.body;

      const album: any = await this.albumService.getAlbum(
        {
          album_id: id,
        },
        {}
      );

      if (!album) {
        new SendResponse(404, "Resource Doesn't Exist").send(res);
        return;
      }

      await this.albumService.updateAlbum(
        { album_id: id },
        {
          name: name || album.name,
          year: year ? Number(year) : album.year,
          hidden: hidden !== undefined ? hidden : album.hidden,
        }
      );

      res.status(204).send();
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  deleteAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const album: any = await this.albumService.getAlbum(
        {
          album_id: id,
        },
        {}
      );

      if (!album) {
        new SendResponse(404, "Resource Doesn't Exist").send(res);
        return;
      }

      await this.albumService.deleteAlbum({ album_id: id }, Track);

      new SendResponse(200, `Album:${album.name} deleted successfully.`).send(
        res
      );
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };
}
