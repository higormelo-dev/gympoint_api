/* Libs */
import * as Yup from 'yup';
/* Models */
import Student from '../models/Student';

class StudentsController {
  async index(request, response) {
    const { page = 1 } = request.query;
    const limit = 20;

    const students = await Student.findAll({
      order: [['id', 'desc']],
      limit,
      offset: (page - 1) * limit,
    });

    return response.json(students);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .required()
        .positive()
        .integer(),
      height: Yup.number().required(),
      weight: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation falis Student' });
    }

    const StudentExists = await Student.findOne({
      where: { email: request.body.email },
    });

    if (StudentExists) {
      return response.status(400).json({ error: 'Student already exists.' });
    }

    const { name, email, age, weight, height } = await Student.create(
      request.body
    );

    return response.json({ name, email, age, weight, height });
  }

  async show(request, response) {
    const { id } = request.params;

    const student = await Student.findByPk(id, {
      attributes: ['id', 'name', 'email', 'age', 'height', 'weight'],
    });

    if (!student) {
      return response.status(400).json({ error: 'Student not found.' });
    }

    return response.json(student);
  }

  async update(request, response) {
    const { id } = request.params;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .required()
        .positive()
        .integer(),
      height: Yup.number().required(),
      weight: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation falis' });
    }

    const student = await Student.findByPk(id);

    if (request.body.email !== student.email) {
      const StudentExists = await Student.findOne({
        where: { email: request.body.email },
      });

      if (StudentExists) {
        return response.status(400).json({ error: 'User already exists.' });
      }
    }

    const { name, email, age, weight, height } = await student.update(
      request.body
    );

    return response.json({ name, email, age, weight, height });
  }

  async destroy(request, response) {
    const { id } = request.params;

    const StudentExists = await Student.findByPk(id);
    if (!StudentExists) {
      return response.status(400).json({ error: 'Student not found.' });
    }

    await Student.destroy({ where: { id } });

    return response
      .status(200)
      .json({ message: 'Student deleted successfully.' });
  }
}

export default new StudentsController();
