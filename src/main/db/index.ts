import { app } from "electron";
import { isFunction } from "lodash";
import path from "path";
import { Sequelize } from "sequelize";

const modules = import.meta.glob("./models/*.ts", { eager: true });

export let sequelize: Sequelize | null = null;

// User.sync() - 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
// User.sync({ force: true }) - 将创建表,如果表已经存在,则将其首先删除
// User.sync({ alter: true }) - 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
export const initDb = async () => {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(app.getPath("userData"), "./database.sqlite")
  });

  Object.keys(modules).forEach((key) => {
    const initModel = (modules[key] as any)?.initModel;
    if (isFunction(initModel)) {
      initModel(sequelize);
    }
  });
  return sequelize;
};
