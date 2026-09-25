import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Warehouse from "../models/Warehouse.js";
import connectDB from "../db/connection.js";

dotenv.config();

const createAdmin = async () => {
  const name = process.env.MASTER_ADMIN_NAME?.trim();
  const email = process.env.MASTER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.MASTER_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error("Set MASTER_ADMIN_NAME, MASTER_ADMIN_EMAIL, and MASTER_ADMIN_PASSWORD in backend/.env.");
  }
  if (password.length < 12) {
    throw new Error("MASTER_ADMIN_PASSWORD must contain at least 12 characters.");
  }

  await connectDB();

  const passwordHash = await bcrypt.hash(password, 12);
  const currentAdmin = await User.findOne({ email });
  const otherAdmins = await User.find({ role: "admin", email: { $ne: email } }).select("_id");
  const demotedAdminIds = otherAdmins.map((user) => user._id);

  if (demotedAdminIds.length) {
    await Warehouse.updateMany({ admin: { $in: demotedAdminIds } }, { $unset: { admin: 1 } });
    await User.updateMany(
      { _id: { $in: demotedAdminIds } },
      { $set: { role: "staff" }, $unset: { assignedWarehouse: 1 } }
    );
  }

  if (currentAdmin) {
    await Warehouse.updateMany({ admin: currentAdmin._id }, { $unset: { admin: 1 } });
  }

  await User.findOneAndUpdate(
    { email },
    {
      $set: { name, email, password: passwordHash, role: "admin" },
      $unset: { assignedWarehouse: 1 }
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  console.log(`Master admin provisioned for ${email}.`);
};

createAdmin()
  .catch((error) => {
    console.error(`Admin provisioning failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });