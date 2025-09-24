import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {

    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL || "http://localhost:5173",
        ];
        if (origin && !allowedOrigins.includes(origin)) {
            return callback(new Error("Not allowed by CORS"));
        }
        callback(null, true);
    },
};