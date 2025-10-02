import { transporter } from "../config/nodemailer";
import type User from "../models/User";

interface IEmail {
  email: string;
  name: string;
  token: string;
}
export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: '"Task Manager" <admin@taskmanager.com>',
      to: user.email,
      subject: "Confirma tu cuenta",
      text: `Tu código de confirmación es: ${user.token}`,
      html: `<p>Bienvenido ${user.name}! Vamos a confirmar tu cuenta.</p>
      <p>Visita el siguiente enlace e introduce tu código de confirmación. <b> ${user.token}</b></p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
      <p>Este código expira en 10 minutos</p>`,
    });
    console.log("Message sent: %s", info.messageId);
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: '"Task Manager" <admin@taskmanager.com>',
      to: user.email,
      subject: "Reestablece tu contraseña",
      text: `Tu código de confirmación es: ${user.token}`,
      html: `<p>Hola ${user.name}! Vamos a reestablecer tu contraseña.</p>
      <p>Visita el siguiente enlace e introduce el código. <b> ${user.token}</b></p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Contraseña</a>
      <p>Este código expira en 10 minutos</p>`,
    });
    console.log("Message sent: %s", info.messageId);
  };
}
