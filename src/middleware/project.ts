import type { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
        project: IProject;
        task: ITask;
    }
  }
}
export async function checkProjectExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projectId = req.params.projectId || req.params.id;
    const project = await Project.findById(projectId).populate('tasks');
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}


