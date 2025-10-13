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
      from: '"Task Manager" <feligo.dev@gmail.com>',
      to: user.email,
      subject: "Confirma tu cuenta",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #FE9A00; color: #ffffff; text-align: center; padding: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Task Manager</h1>
          </div>
          <div style="padding: 30px; color: #333333;">
            <h2 style="font-size: 20px; margin-bottom: 10px;">¡Hola, ${user.name}!</h2>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Gracias por registrarte en <b>Task Manager</b>. Antes de empezar, necesitamos confirmar tu cuenta.
            </p>
            <p style="font-size: 16px; margin-bottom: 10px;">Tu código de confirmación es:</p>
            <div style="background-color: #f1f5f9; border: 1px dashed #FE9A00; padding: 10px 15px; font-size: 20px; font-weight: bold; color: #FE9A00; text-align: center; letter-spacing: 2px;">
              ${user.token}
            </div>
            <p style="margin-top: 25px; text-align: center;">
              <a href="${process.env.FRONTEND_URL}/auth/confirm-account" 
                 style="display: inline-block; background-color: #FE9A00; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                 Confirmar Cuenta
              </a>
            </p>
            <p style="font-size: 14px; color: #555; margin-top: 20px;">
              Este código expira en <b>10 minutos</b>.
            </p>
          </div>
          <div style="background-color: #f1f5f9; text-align: center; padding: 15px; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} Task Manager. Todos los derechos reservados.
          </div>
        </div>
      </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: '"Task Manager" <feligo.dev@gmail.com>',
      to: user.email,
      subject: "Reestablece tu contraseña",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #FE9A00; color: #ffffff; text-align: center; padding: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Task Manager</h1>
          </div>
          <div style="padding: 30px; color: #333333;">
            <h2 style="font-size: 20px; margin-bottom: 10px;">Hola, ${user.name} 👋</h2>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Hemos recibido una solicitud para <b>restablecer tu contraseña</b> en <b>Task Manager</b>.
            </p>
            <p style="font-size: 16px; margin-bottom: 10px;">Tu código de recuperación es:</p>
            <div style="background-color: #f1f5f9; border: 1px dashed #FE9A00; padding: 10px 15px; font-size: 20px; font-weight: bold; color: #FE9A00; text-align: center; letter-spacing: 2px;">
              ${user.token}
            </div>
            <p style="margin-top: 25px; text-align: center;">
              <a href="${process.env.FRONTEND_URL}/auth/new-password" 
                 style="display: inline-block; background-color: #FE9A00; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                 Restablecer Contraseña
              </a>
            </p>
            <p style="font-size: 14px; color: #555; margin-top: 20px;">
              Si no solicitaste este cambio, puedes ignorar este mensaje.
            </p>
            <p style="font-size: 14px; color: #555; margin-top: 10px;">
              Este código expira en <b>10 minutos</b>.
            </p>
          </div>
          <div style="background-color: #f1f5f9; text-align: center; padding: 15px; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} Task Manager. Todos los derechos reservados.
          </div>
        </div>
      </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
  };
}
