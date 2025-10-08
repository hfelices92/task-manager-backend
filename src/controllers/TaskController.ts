import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;

      req.project.tasks.push(task.id);

      await Promise.allSettled([task.save(), req.project.save()]);
      res.status(201).json({ message: "Tarea Creada Exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static getAllTasksByProjectId = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      );

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.params.taskId)
        .populate("completedBy.user", "_id name email")
        .populate({ path: "notes", populate: { path: "createdBy" , select: "_id name email" } });

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;
      await req.task.save();
      res.json(req.task);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      req.task.status = req.body.status;

      const data = {
        user: req.user.id,
        status: req.body.status,
        date: Date.now(),
      };
      req.task.completedBy.push(data);
      await req.task.save();
      res.json(req.task);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(
        (taskId) => taskId !== req.task.id
      );

      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
}
