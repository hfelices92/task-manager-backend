import { type Request, type Response } from "express";
import User from "../models/User";

export class TeamController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
      const user = await await User.findOne({ email }).select("name email _id");
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static addTeamMember = async (req: Request, res: Response) => {
    const { memberId } = req.body;
    const project = req.project;
  
    try {
      const user = await User.findById(memberId).select("id");
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (project.team.includes(memberId)) {
        return res.status(400).json({ error: "El usuario ya colabora con este proyecto" });
      }
      project.team.push(memberId);
      await project.save();
      res.json({ message: "Colaborador añadido correctamente", project });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static removeTeamMember = async (req: Request, res: Response) => {
    const  userId  = req.params.userId;
    const project = req.project;
    try {
      if (!project.team.some) {
        return res.status(400).json({ error: "El usuario no colabora con este proyecto" });
      }
      project.team = project.team.filter(
        (memberId) => memberId.toString() !== userId
      );
      await project.save();
      res.send("Colaborador eliminado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static getTeamMembers = async (req: Request, res: Response) => {
    const project = req.project;
    try {
      await project.populate("team", "name email _id");
      res.json(project.team);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
}
