import * as Yup from 'yup';
/* Models */
import Student from '../models/Student';

class StudentsController {
  // Listar todos os estudantes
  async index(request, response) {
    const students = await Student.findAll();
    return response.json(students);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      age: Yup.number().required(),
      height: Yup.number().required(),
      weight: Yup.number().required(),
    });

    console.log(request.body);

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
}

export default new StudentsController();
