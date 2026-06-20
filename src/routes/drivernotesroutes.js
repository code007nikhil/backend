import express from "express";
import {
  createDriverNote,
  getNotesByDriver,
  deleteDriverNote,
} from "../controllers/driverNotesController.js";

const router = express.Router();

// POST   /api/driver-notes                     -> create a note
// GET    /api/driver-notes/driver/:driverNumber -> get all notes for a driver
// DELETE /api/driver-notes/:id                  -> delete a note

router.post("/", createDriverNote);
router.get("/driver/:driverNumber", getNotesByDriver);
router.delete("/:id", deleteDriverNote);

export default router;