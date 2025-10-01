import  express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./config/cors";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";
import authRoutes from "./routes/authRoutes";
import morgan from "morgan";

dotenv.config();

connectDB();


const app = express();
//CORS
app.use(cors(corsOptions));

//Logging 
app.use(morgan("dev"));

//Body parser
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

export default app;