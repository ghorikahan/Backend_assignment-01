const mongoose = require("mongoose")
const Notes = require("../models/note.model")

const sanitizeId = (id) => (typeof id === "string" ? id.replace(/^:/, "") : id)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const home = async (req,res) => {
    res.status(200).json({message : "Hello Welcome!"})
}
 

// 1. POST Single Note (/api/note)
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

module.exports =  createNote ;