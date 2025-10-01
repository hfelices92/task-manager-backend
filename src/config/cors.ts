import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {

    origin: function (origin, callback) {
        
        const allowedOrigins = [
            process.env.FRONTEND_URL!,
        ];
        if (process.argv[2] === "--api") {
            allowedOrigins.push(undefined);
        }
        if (!allowedOrigins.includes(origin)) {
            return callback(new Error("Not allowed by CORS"));
        }
        callback(null, true);
    },
};