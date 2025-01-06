import { Router } from "express";
import { authenticateToken, authorizeEditorOrAdmin } from "../middlewares/auth";
import { AlbumController } from "../controllers/albumController";

const router = Router();

const albumController = new AlbumController();

router.get("/:id", authenticateToken, albumController.getAlbum);
router.get("/", authenticateToken, albumController.getAllAlbums);
router.post(
  "/add-album",
  authenticateToken,
  authorizeEditorOrAdmin,
  albumController.addAlbum
);
router.put(
  "/:id",
  authenticateToken,
  authorizeEditorOrAdmin,
  albumController.updateAlbum
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeEditorOrAdmin,
  albumController.deleteAlbum
);

export default router;
