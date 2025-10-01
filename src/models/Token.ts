import mongoose, { Schema, Document, Types, Date } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  createdAt: Date;
}

const TokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
  },
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Token expires in 10 minutes
  },
});

const Token = mongoose.model<IToken>("Token", TokenSchema);

export default Token;
