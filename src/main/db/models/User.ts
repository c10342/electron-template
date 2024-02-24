import { DataTypes, Model, Sequelize } from "sequelize";

class User extends Model {
  declare firstName: string;
  declare lastName?: string;
}

export const initModel = async (sequelize: Sequelize) => {
  User.init(
    {
      // 在这里定义模型属性
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING
        // allowNull 默认为 true
      }
    },
    {
      // 这是其他模型参数
      sequelize, // 我们需要传递连接实例
      modelName: "User" // 我们需要选择模型名称
    }
  );
  await User.sync({ alter: true });
};

export default User;
