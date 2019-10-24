/* Libs */
import { Op } from 'sequelize';
import { subDays, endOfDay } from 'date-fns';
/* Models */
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(request, response) {
    const { student_id } = request.params;

    if (!student_id) {
      return response.status(400).json({ error: 'Student not provided' });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return response.status(400).json({ error: 'Student does not exist' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: student.id },
      order: [['id', 'desc']],
      limit: 20,
    });

    return response.json(checkins);
  }

  async store(request, response) {
    if (!request.params.student_id) {
      return response.status(400).json({ error: 'Student not provided' });
    }

    const student = await Student.findByPk(request.params.student_id);

    if (!student) {
      return response.status(400).json({ error: 'Student does not exist' });
    }

    /* 5 check-ins in last 7 days */
    const lastSeventhDay = subDays(new Date(), 7);
    const today = endOfDay(new Date());

    const checkins = await Checkin.count({
      where: {
        student_id: student.id,
        created_at: {
          [Op.between]: [lastSeventhDay, today],
        },
      },
    });

    if (checkins >= 5) {
      return response
        .status(400)
        .json({ error: 'Student already has 5 check-ins in last 7 days' });
    }

    const { id, student_id } = await Checkin.create({
      student_id: student.id,
    });

    return response.json({ id, student_id });
  }
}

export default new CheckinController();
