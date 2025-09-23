import mongoose from "mongoose";
import colors from "colors";
import { exit} from "process";

export const connectDB = async () => {
  try {
    const {connection} = await mongoose.connect(process.env.DATABASE_URL!);
    const url = `  ${connection.host} : ${connection.port} / ${connection.name}  `;
   console.log(colors.bgCyan.bold(` MongoDB connected in ${url} `));


  } catch (error) {
    console.log(colors.bgRed.bold(" Failed to connect to MongoDB "));
    
    exit(1);
  }
};
