import { Router } from "express";
import { FavoriteController } from "../controllers/favoriteController";
import { authenticateToken, authorizeEditorOrAdmin } from "../middlewares/auth";

const router = Router();

const favoriteContoller = new FavoriteController();

router.get("/:category", authenticateToken, favoriteContoller.getFavorites);
router.post(
  "/add-favorite",
  authenticateToken,
  authorizeEditorOrAdmin,
  favoriteContoller.addFavorite
);
router.delete(
  "/remove-favorite/:id",
  authenticateToken,
  authorizeEditorOrAdmin,
  favoriteContoller.removeFavorite
);

export default router;
