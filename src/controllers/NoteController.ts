import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import { Types } from "mongoose";

type NoteParams = {
  noteId: Types.ObjectId;
};

export class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;
    
    

    const note = new Note({
      content,
      task: req.task.id,
      createdBy: req.user.id,
    });

    req.task.notes.push(note.id);

    try {
      Promise.allSettled([note.save(), req.task.save()]);
      res.status(201).send("Nota creada exitosamente");
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static getNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Note.find({ task: req.task.id });
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static deleteNote = async (req: Request<NoteParams>, res: Response) => {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
      return res.status(404).json({ error: "Nota no encontrada" });
    }
    if (note.createdBy.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ error: "No autorizado para eliminar esta nota" });
    }

    req.task.notes = req.task.notes.filter(
      (noteId) => noteId.toString() !== req.params.noteId.toString()
    );
    try {
      await Promise.allSettled([note.deleteOne(), req.task.save()]);
      res.status(200).send( "Nota eliminada exitosamente" );
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
}
