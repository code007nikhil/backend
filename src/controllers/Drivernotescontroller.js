import DriverNote from "../models/Drivernotes.js";

// @desc    Create a new note for a driver
// @route   POST /api/driver-notes
// @body    { driverNumber, driverName, note, createdBy? }
export const createDriverNote = async (req, res) => {
  try {
    const { driverNumber, driverName, note, createdBy } = req.body;

    if (!driverNumber || !driverName || !note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: "driverNumber, driverName and note are required",
      });
    }

    const newNote = await DriverNote.create({
      driverNumber,
      driverName,
      note: note.trim(),
      createdBy: createdBy || "",
    });

    return res.status(201).json({
      success: true,
      data: newNote,
    });
  } catch (error) {
    console.error("Error creating driver note:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create driver note",
    });
  }
};

// @desc    Get all notes for a driver, newest first
// @route   GET /api/driver-notes/driver/:driverNumber
export const getNotesByDriver = async (req, res) => {
  try {
    const { driverNumber } = req.params;

    if (!driverNumber) {
      return res.status(400).json({
        success: false,
        message: "driverNumber is required",
      });
    }

    const notes = await DriverNote.find({ driverNumber }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { notes },
    });
  } catch (error) {
    console.error("Error fetching driver notes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch driver notes",
    });
  }
};

// @desc    Delete a note
// @route   DELETE /api/driver-notes/:id
export const deleteDriverNote = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNote = await DriverNote.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted",
      data: deletedNote,
    });
  } catch (error) {
    console.error("Error deleting driver note:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete driver note",
    });
  }
};