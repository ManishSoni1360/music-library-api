import { Router } from "express";
import { ArtistController } from "../controllers/artistController";
import { authenticateToken, authorizeEditorOrAdmin } from "../middlewares/auth";

const router = Router();
const artistController = new ArtistController();

router.get("/:id", authenticateToken, artistController.getArtist);
router.get("/", authenticateToken, artistController.getAllArtists);
router.post(
  "/add-artist",
  authenticateToken,
  authorizeEditorOrAdmin,
  artistController.addArtist
);
router.put(
  "/:id",
  authenticateToken,
  authorizeEditorOrAdmin,
  artistController.updateArtist
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeEditorOrAdmin,
  artistController.deleteArtist
);

export default router;
