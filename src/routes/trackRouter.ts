import { Router } from "express";
import { authenticateToken, authorizeEditorOrAdmin } from "../middlewares/auth";
import { TrackController } from "../controllers/trackController";

const router = Router();

const trackController = new TrackController();

router.get("/:id", authenticateToken, trackController.getTrack);
router.get("/", authenticateToken, trackController.getAllTracks);
router.post(
  "/add-track",
  authenticateToken,
  authorizeEditorOrAdmin,
  trackController.addTrack
);
router.put(
  "/:id",
  authenticateToken,
  authorizeEditorOrAdmin,
  trackController.updateTrack
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeEditorOrAdmin,
  trackController.deleteTrack
);

export default router;
