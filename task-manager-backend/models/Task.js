// import { DataTypes } from "sequelize";
// import { sequelize } from "../config/database.js";
// import User from "./User.js";

// const Task = sequelize.define("Task", {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.TEXT,
//   },
//   completed: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
// });

// // Each Task belongs to a User
// Task.belongsTo(User, { foreignKey: "userId" });
// User.hasMany(Task, { foreignKey: "userId" });

// export default Task;


import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./User.js";

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

Task.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Task, { foreignKey: "userId" });

export default Task; // ✅ Ensure this line is present
