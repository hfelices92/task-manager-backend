import type { Request, Response } from "express";
import colors from "colors";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    try {
      await project.save();
      res.send("Project created successfully");
    } catch (error) {
      console.log(colors.red.bold(error));
    }
  };
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      console.log(colors.red.bold(error));
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.log(colors.red.bold(error));
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    try {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.log(colors.red.bold(error));
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      await project.deleteOne();
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.log(colors.red.bold(error));
    }
  };
}
