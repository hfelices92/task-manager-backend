import mongoose, { Schema, Document, PopulatedDoc } from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";

export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  tasks?: PopulatedDoc<ITask & Document>[];
  manager: PopulatedDoc<IUser & Document>;
  team: PopulatedDoc<IUser & Document>[];

}

const ProjectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

//Middleware to cascade delete tasks when a project is deleted
ProjectSchema.pre('deleteOne', { document: true }, async function (next) {
  const projectId = this._id;
  const tasks = await Task.find({ project: projectId });
  //  Ejecutar todas las eliminaciones de tareas en paralelo
  await Promise.all(tasks.map(task => task.deleteOne()));
  next();
});


const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
