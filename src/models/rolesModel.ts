import mongoose from "mongoose";

const rolesSchema = new mongoose.Schema({
  role: {type:String ,required:true},
  hotel: { type: mongoose.Schema.ObjectId, ref: "Hotel" ,required:true},
  hotelAccount: { type: mongoose.Schema.ObjectId, ref: "Guest" ,required:true},
});

export const RolesModel = mongoose.model("Hotel", rolesSchema);
