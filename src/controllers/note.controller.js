const mongoose = require("mongoose")
const Notes = require("../models/note.model")

const sanitizeId = (id) => (typeof id === "string" ? id.replace(/^:/, "") : id)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const home = async (req, res) => {
    res.status(200).json({ message: "Hello Welcome!" })
}



const createNote = async (req, res) => {
    try {
        const { title, content, category, isPinned } = req.body;

        const newNote = new Notes({ title, category, content, isPinned });
        await newNote.save();

        res.status(201).json({
            msg: 'Notes added successfully.',
            note: newNote,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


const bulkNotes = async (req, res) => {
    try {
        const { notes } = req.body;
        const newNotes = await Notes.insertMany( notes );

        res.status(201).json({
            msg: 'Multiple notes added successfully.',
            notes: newNotes,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
};



const getNotes = async (req, res) => {
    try {
        const data = await Notes.find();

        res.status(200).json(data)
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message })
    }
}



const getNotesID = async (req, res) => {
    try {
        const noteId = sanitizeId(req.params.id);

        if (!isValidObjectId(noteId)) {
            return res.status(400).json({ message: "Invalid note id" })
        }

        const Note = await Notes.findById(noteId);

        if (!Note) {
            res.status(404).json({ message: "User Not Found Enter valid ID", err: err.message })
        }

        res.status(200).json({
            message: "Note fetched Successfully",
            note: Note
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message })
    }
}


module.exports = { createNote, bulkNotes, getNotes, getNotesID};