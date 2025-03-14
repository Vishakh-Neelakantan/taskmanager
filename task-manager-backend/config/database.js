import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // Set to true for SQL query logs
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Connected Successfully ✅");
  } catch (error) {
    console.error("Database Connection Failed ❌", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
