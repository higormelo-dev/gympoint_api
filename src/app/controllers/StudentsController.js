import * as Yup from 'yup';
/* Models */
import Student from '../models/Student';

class StudentsController {
  async store(request, response) {
    const students = await Student.findAll()
      .then(userResponse => {
        response.status(200).json(userResponse);
      })
      .catch(error => {
        response.status(400).send(error);
      });
    console.log(students);
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .required()
        .positive()
        .integer(),
      weight: Yup.string().required(),
      height: Yup.number()
        .required()
        .positive()
        .integer(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation falis Student' });
    }

    const StudentExists = await Student.findOne({
      where: { email: request.body.email },
    });

    console.log(request.body.email);

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
