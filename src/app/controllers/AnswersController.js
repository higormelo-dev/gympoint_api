/* Libs */
import * as Yup from 'yup';
import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
/* Models */
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import User from '../models/User';
/* Notifications */
import NotificationStudent from '../schemas/NotificationStudent';
/* Job */
import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';
import Queue from '../../lib/Queue';

class AnswersController {
  async store(request, response) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation failed' });
    }

    const { help_id } = request.params;

    if (!help_id) {
      return response.status(400).json({ error: 'Help order not provided' });
    }

    const helpOrder = await HelpOrder.findByPk(help_id);

    if (!helpOrder) {
      return response.status(400).json({ error: 'Help order does not exist' });
    }

    if (helpOrder.answer_at) {
      return response
        .status(400)
        .json({ error: 'Help order already answered' });
    }

    const student = await Student.findOne({
      where: { id: helpOrder.student_id },
    });

    const user = await User.findByPk(request.userId);

    const {
      id,
      question,
      answer_at,
      createAt,
      UpdatedAt,
    } = await helpOrder.update({
      answer: request.body.answer,
      answer_at: new Date(),
    });

    /* Notify the enrolled student */
    await NotificationStudent.create({
      content: `Seu pedidos de auxílio "${helpOrder.question}" em ${format(
        answer_at,
        "dd'/'MM'/'yyyy",
        {
          locale: ptBr,
        }
      )}`,
      student: student.id,
    });

    // Adicionar na fila
    await Queue.add(HelpOrderAnswerMail.key, {
      student,
      helpOrder,
      user,
    });

    return response.json({
      id,
      question,
      answer_at,
      createAt,
      UpdatedAt,
    });
  }
}

export default new AnswersController();
