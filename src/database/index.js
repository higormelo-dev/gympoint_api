/* Libs */
import Sequelize from 'sequelize';
import mongoose from 'mongoose';
/* Models */
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';
import Checkin from '../app/models/Checkin';
import HelpOrder from '../app/models/HelpOrder';
/* database config */
import databaseConfig from '../config/database';

/* Model mapping */
const models = [User, Student, Plan, Enrollment, Checkin, HelpOrder];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
