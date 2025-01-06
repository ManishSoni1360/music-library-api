import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { TrackService } from "../services/trackService";
import Track from "../models/Track";
import Artist from "../models/Artist";
import Album from "../models/Album";
import { SendResponse } from "../utils/sendResponse";
import { ArtistService } from "../services/artistService";
import { AlbumService } from "../services/albumService";

export class TrackController {
  private trackService: TrackService;
  private artistService: ArtistService;
  private albumService: AlbumService;
  constructor() {
    this.trackService = new TrackService(Track);
    this.artistService = new ArtistService(Artist);
    this.albumService = new AlbumService(Album);
  }

  getAllTracks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;

      const where: any = {};
      if (artist_id) {
        where.artist_id = artist_id.toString();
      }
      if (album_id) {
        where.album_id = album_id.toString();
      }
      if (hidden !== undefined) {
        where.hidden = hidden === "true";
      }

      const tracks: any[] = await this.trackService.getAllTracks(
        where,
        {},
        Number(offset),
        Number(limit)
      );

      const formattedTracks = tracks.map((track) => ({
        track_id: track.track_id,
        artist_name: track.artist_id.name,
        album_name: track.album_id.name,
        name: track.name,
        duration: track.duration,
        hidden: track.hidden,
      }));

      new SendResponse(
        200,
        "Tracks retrieved successfully.",
        formattedTracks
      ).send(res);
    } catch (error: any) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  getTrack = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const track: any = await this.trackService.getTrack({ track_id: id }, {});

      if (!track) {
        new SendResponse(404, "Resource Doesn't Exist").send(res);
        return;
      }

      const formattedTrack = {
        track_id: track.track_id,
        artist_name: track.artist_id.name,
        album_name: track.album_id.name,
        name: track.name,
        duration: track.duration,
        hidden: track.hidden,
      };

      new SendResponse(
        200,
        "Tracks retrieved successfully.",
        formattedTrack
      ).send(res);
    } catch (error: any) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  addTrack = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { artist_id, album_id, name, duration, hidden } = req.body;

      if (!artist_id || !album_id || !name || !duration) {
        new SendResponse(400).sendFieldMissing(res);
        return;
      }

      const [artist, album]: [any, any] = await Promise.all([
        this.artistService.getArtist({ artist_id }, { artist_id: true }),
        this.albumService.getAlbum(
          { album_id },
          { album_id: true, artist_id: true }
        ),
      ]);

      if (!artist || !album || album.artist_id.artist_id !== artist_id) {
        new SendResponse(404, "Resource Doesn't Exist").send(res);
        return;
      }
      await this.trackService.addTrack({
        artist_id,
        album_id,
        name,
        duration: Number(duration),
        hidden: hidden || false,
      });

      new SendResponse(201, "Track created successfully.").send(res);
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  updateTrack = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, duration, hidden } = req.body;

      const track: any = await this.trackService.getTrack(
        {
          where: { track_id: id },
        },
        {}
      );

      if (!track) {
        new SendResponse(404, "Resource Doesn't Exist").send(res);
        return;
      }

      await this.trackService.updateTrack(
        { track_id: id },
        {
          name: name || track.name,
          duration: duration ? Number(duration) : track.duration,
          hidden: hidden !== undefined ? hidden : track.hidden,
        }
      );

      res.status(204).send();
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };

  deleteTrack = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const track: any = await this.trackService.getTrack(
        {
          track_id: id,
        },
        {}
      );

      if (!track) {
        new SendResponse(404, "Resource Doesn't Exist").send(res);
        return;
      }

      await this.trackService.deleteTrack({
        track_id: id,
      });

      new SendResponse(200, `Track:${track.name} deleted successfully.`).send(
        res
      );
    } catch (error) {
      new SendResponse(400).sendBadRequest(res);
    }
  };
}
