import type { Request, Response } from "express";
import colors from "colors";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    project.manager = req.user.id; // Asignar el ID del usuario autenticado como manager
    try {
      await project.save();
      res.send("Project created successfully");
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      
      const projects = await Project.find({
        $or: [{ manager: { $in: req.user.id } }, { team: { $in: req.user.id } }],
      });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    if (req.project.manager.toString() !== req.user.id && !req.project.team.includes(req.user.id)) {
      return res.status(403).json({ error: "Usuario no autorizado" });
    }
    try {
      res.json(req.project);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    try {
      
      req.project.projectName = req.body.projectName;
      req.project.clientName = req.body.clientName;
      req.project.description = req.body.description;
      await req.project.save();

      res.json(req.project);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    try {
      await req.project.deleteOne();
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
}
