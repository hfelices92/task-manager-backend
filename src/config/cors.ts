import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL, 
    ].filter(Boolean); 

    // Permitir peticiones sin origin (por ejemplo desde Postman o servidor)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`Blocked by CORS: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};