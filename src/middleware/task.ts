import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function checkTaskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId)
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function checkTaskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    
    if (req.task.project.toString() !== req.project.id.toString()) {
      return res
        .status(400)
        .json({ error: "Task does not belong to this project" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}


export function hasAuthorization (req: Request, res: Response, next: NextFunction) {
    if (req.project.manager.toString() !== req.user.id) {
      return res.status(403).json({ error: "Usuario no autorizado" });
    }
    next();
}