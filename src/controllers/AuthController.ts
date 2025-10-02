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
      res.send(
        "Usuario creado correctamente, revisa tu email para confirmar tu cuenta"
      );
    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario", error });
    }
  };

  static confirmUser = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json(error);
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Check if user already exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ error: "No existe un usuario con este email" });
      }
      if (user.confirmed) {
        return res
          .status(403)
          .json({ error: "Este usuario ya ha sido confirmado" });
      }
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
      await token.save();
      res.send("Revisa tu email para confirmar tu cuenta");
    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario", error });
    }
  };

  static loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      //Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "El usuario no existe" });
      //Check if user is confirmed
      if (!user.confirmed) {
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
        return res.status(400).json({
          error:
            "Tu cuenta no ha sido confirmada. Hemos enviado un nuevo email de confirmación",
        });
      }
      //Check if password is correct
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "El password es incorrecto" });

      res.json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar sesión", error });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    console.log(req.body);

    try {
      const { email } = req.body;

      // Check if user already exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ error: "No existe un usuario con este email" });
      }

      //Generate confirmation token
      const token = new Token({
        token: generateToken(),
        user: user._id,
      });
      await token.save();

      //Send confirmation email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("Revisa tu email para reestablecer tu contraseña");
    } catch (error) {}
  };

  static checkToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }
      res.send("Código válido, define tu nueva contraseña");
    } catch (error) {
      res.status(500).json(error);
    }
  };

  static resetPassword = async (req: Request, res: Response) => {
    console.log(req.params.token);
    console.log(typeof req.params.token);
    try {
      const { token } = req.params;
      const { password } = req.body;
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }
      const user = await User.findById(tokenExists.user);
      user.password = await hashPassword(password);
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send("Contraseña modificada correctamente");
    } catch (error) {
      res.status(500).json(error);
    }
  };
}
