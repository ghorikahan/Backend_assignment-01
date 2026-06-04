const mongoose = require("mongoose")
const Notes = require("../models/note.model")

const sanitizeId = (id) => (typeof id === "string" ? id.replace(/^:/, "") : id)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const home = async (req, res) => {
    res.status(200).json({ message: "Hello Welcome!" })
}

// 1. POST /api/notes — Create a single note
const createNote = async (req, res) => {
    try {
        const { title, content, category, isPinned } = req.body;

        const newNote = new Notes({ title, category, content, isPinned });
        await newNote.save();

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: newNote,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

// 2. POST /api/notes/bulk — Create multiple notes
const bulkNotes = async (req, res) => {
    try {
        const { notes } = req.body;
        const newNotes = await Notes.insertMany(notes);

        res.status(201).json({
            success: true,
            message: `${newNotes.length} notes created successfully`,
            data: newNotes,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

// 3. GET /api/notes — Get all notes
const getNotes = async (req, res) => {
    try {
        const data = await Notes.find();

        res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            data: data,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

// 4. GET /api/notes/:id — Get note by ID
const getNotesID = async (req, res) => {
    try {
        const noteId = sanitizeId(req.params.id);

        if (!isValidObjectId(noteId)) {
            return res.status(400).json({ success: false, message: "Invalid note id" });
        }

        const note = await Notes.findById(noteId);

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found. Enter a valid ID" });
        }

        res.status(200).json({
            success: true,
            message: "Note fetched successfully",
            data: note,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

// 5. PUT /api/notes/:id — Replace a note completely
const replaceNote = async (req, res) => {
    try {
        const noteID = sanitizeId(req.params.id);

        if (!isValidObjectId(noteID)) {
            return res.status(400).json({ success: false, message: "Invalid note id" });
        }

        const note = await Notes.findByIdAndUpdate(
            noteID,
            req.body,
            { new: true, overwrite: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found. Enter a valid ID" });
        }

        res.status(200).json({
            success: true,
            message: "Note replaced successfully",
            data: note,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

// 6. PATCH /api/notes/:id — Update specific fields only
const replacePart = async (req, res) => {
    try {
        const noteID = sanitizeId(req.params.id);

        if (!isValidObjectId(noteID)) {
            return res.status(400).json({ success: false, message: "Invalid note id" });
        }

        const updatedNote = await Notes.findByIdAndUpdate(
            noteID,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: updatedNote,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

// 7. DELETE /api/notes/:id — Delete a single note
const deletebyID = async (req, res) => {
    try {
        const noteID = sanitizeId(req.params.id);

        if (!isValidObjectId(noteID)) {
            return res.status(400).json({ success: false, message: "Invalid note id" });
        }

        const deletedNote = await Notes.findByIdAndDelete(noteID);

        if (!deletedNote) {
            return res.status(404).json({ success: false, message: "Note not found. Enter a valid ID" });
        }

        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            data: null,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

// 8. DELETE /api/notes/bulk — Delete multiple notes by IDs
const deleteBulkbyID = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: "ids must be a non-empty array" });
        }

        const sanitizedIds = ids.map(sanitizeId);

        if (!sanitizedIds.every(isValidObjectId)) {
            return res.status(400).json({ success: false, message: "One or more ids are invalid" });
        }

        const result = await Notes.deleteMany({ _id: { $in: sanitizedIds } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} notes deleted successfully`,
            data: null,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

module.exports = { home, createNote, bulkNotes, getNotes, getNotesID, replaceNote, replacePart, deleteBulkbyID, deletebyID };