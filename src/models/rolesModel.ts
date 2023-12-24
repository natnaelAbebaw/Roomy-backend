import mongoose from "mongoose";

export interface Role extends Document {
  role: string;
  hotel: mongoose.Schema.Types.ObjectId;
  hotelAccount: mongoose.Schema.Types.ObjectId;
}

export enum Roles {
  admin = "admin",
  manager = "manager",
  receptionist = "receptionist",
}

const rolesSchema = new mongoose.Schema<Role>({
  role: { type: String, required: true, enum: Object.values(Roles) },
  hotel: { type: mongoose.Schema.ObjectId, ref: "Hotel", required: true },
  hotelAccount: {
    type: mongoose.Schema.ObjectId,
    ref: "Guest",
    required: true,
  },
});

export const RolesModel = mongoose.model<Role>("Role", rolesSchema);
