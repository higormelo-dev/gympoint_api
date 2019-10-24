/* Libs */
import * as Yup from 'yup';
/* Models */
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrdersController {
  async index(request, response) {
    const { student_id } = request.params;
    const { page = 1 } = request.query;
    const limit = 20;

    if (!student_id) {
      return response.status(400).json({ error: 'Student not provided' });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return response.status(400).json({ error: 'Student does not exist' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: { student_id: student.id },
      order: [['id', 'desc']],
      limit,
      offset: (page - 1) * limit,
    });

    return response.json(helpOrders);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation failed' });
    }

    const { student_id } = request.params;

    if (!student_id) {
      return response.status(400).json({ error: 'Student not provided' });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return response.status(400).json({ error: 'Student does not exist' });
    }

    const HelpOrderExists = await HelpOrder.findOne({
      where: {
        student_id: student.id,
        question: request.body.question,
      },
    });

    if (HelpOrderExists) {
      return response.status(400).json({ error: 'Help order already exists.' });
    }

    const { id, question, createdAt } = await HelpOrder.create({
      student_id: student.id,
      question: request.body.question,
    });

    return response.json({ id, question, createdAt });
  }
}

export default new HelpOrdersController();
