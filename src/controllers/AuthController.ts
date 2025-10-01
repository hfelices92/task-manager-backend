import { text, type Request, type Response } from "express";
import User from "../models/User";
import { compare, hash } from "bcrypt";
import { comparePassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import Token from "../models/Token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
  static createUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "Ya existe un usuario con este email" });
      }

      // Create new user
      const user = new User(req.body);
      // Hash password before saving
      user.password = await hashPassword(password);

      //Generate confirmation token
      const token = new Token({
        token: generateToken(),
        user: user._id,
      });

      //Send confirmation email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);
      res.send("Usuario creado correctamente");
    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario", error });
    }
  };

  static confirmUser = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token })
      if(!tokenExists) return res.status(400).json({message: "Token no válido"})
      const user = await User.findById(tokenExists.user)
      if(!user) return res.status(400).json({message: "Usuario no válido"})
      if(user.confirmed) return res.status(400).json({message: "El usuario ya ha sido confirmado"})
      user.confirmed = true
      await Promise.allSettled([user.save(), Token.findByIdAndDelete(tokenExists._id)])
      res.json({message: "Usuario confirmado correctamente"})
      
      
      
    } catch (error) {
      res.status(500).json({ message: "Error al confirmar el usuario", error });
    }
    
  }

  static loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      //Check if user exists
      const user = await User.findOne({ email });
      if(!user) return res.status(400).json({message: "El usuario no existe"})
      //Check if user is confirmed
      if(!user.confirmed) {
        const token = new Token({
          token: generateToken(),
          user: user._id,
        });
        await token.save();
        //Send confirmation email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });
        return res.status(400).json({message: "Tu cuenta no ha sido confirmada. Hemos enviado un nuevo email de confirmación"})
      }
      //Check if password is correct
      const isMatch = await comparePassword(password, user.password)
      if(!isMatch) return res.status(400).json({message: "El password es incorrecto"})
      
      res.json({ user: {id: user._id, name: user.name, email: user.email}})
    }catch (error) {
      res.status(500).json({ message: "Error al iniciar sesión", error });
    }
  };
}
