import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  content: string;
  createdBy: Types.ObjectId;
  task: Types.ObjectId;
}

const NoteSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note;
