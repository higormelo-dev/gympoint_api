/* Libs */
import * as Yup from 'yup';
import { addMonths, parseISO, isBefore, format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
/* Models */
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';
/* Notifications */
import NotificationStudent from '../schemas/NotificationStudent';
/* Job */
import NewEnrollmentMail from '../jobs/NewEnrollmentMail';
import AlterEnrollmentMail from '../jobs/AlterEnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentsController {
  async index(request, response) {
    const { page = 1 } = request.query;
    const limit = 20;

    const enrollments = await Enrollment.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title'],
        },
      ],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      order: [['id', 'desc']],
      limit: 20,
      offset: (page - 1) * limit,
    });

    return response.json(enrollments);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .required()
        .positive()
        .integer(),
      plan_id: Yup.number()
        .required()
        .positive()
        .integer(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation falis Student' });
    }

    const studentExists = await Student.findByPk(request.body.student_id, {
      attributes: ['name', 'email'],
    });

    if (!studentExists) {
      return request.status(400).json({ error: 'Student does not exist' });
    }

    const plan = await Plan.findByPk(request.body.plan_id);

    if (!plan) {
      return request.status(400).json({ error: 'Plan does not exist' });
    }

    const EnrollmentExists = await Enrollment.findOne({
      where: {
        student_id: request.body.student_id,
      },
    });

    if (EnrollmentExists) {
      return response.status(400).json({ error: 'Enrollment already exists.' });
    }

    /* Check for past dates */
    const startDate = parseISO(request.body.start_date);

    if (isBefore(startDate, new Date())) {
      return response
        .status(400)
        .json({ error: 'Past date are not permitted.' });
    }

    const new_end_date = addMonths(
      parseISO(request.body.start_date),
      plan.duration
    );
    const new_price = plan.price * plan.duration;

    const {
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    } = await Enrollment.create({
      student_id: request.body.student_id,
      plan_id: request.body.plan_id,
      start_date: request.body.start_date,
      end_date: new_end_date,
      price: new_price,
    });

    /* Notify the enrolled student */
    await NotificationStudent.create({
      content: `Nova matrícula com plano ${
        plan.title
      } no valor R$ ${price} entre o periodo ${format(
        parseISO(start_date),
        "dd'/'MM'/'yyyy",
        {
          locale: ptBr,
        }
      )} a ${format(end_date, "dd'/'MM'/'yyyy", {
        locale: ptBr,
      })}`,
      student: student_id,
    });

    // Adicionar na fila
    await Queue.add(NewEnrollmentMail.key, {
      student: studentExists,
      plan,
      start_date,
      end_date,
      price,
    });

    return response.json({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async show(request, response) {
    const { id } = request.params;

    const enrollment = await Enrollment.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'price', 'duration'],
        },
      ],
      attributes: ['start_date', 'end_date', 'price'],
    });

    if (!enrollment) {
      return response.status(400).json({ error: 'Enrollment not found.' });
    }

    return response.json(enrollment);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .required()
        .positive()
        .integer(),
      plan_id: Yup.number()
        .required()
        .positive()
        .integer(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation falis Student' });
    }

    const studentExists = await Student.findByPk(request.body.student_id, {
      attributes: ['id', 'name', 'email'],
    });

    if (!studentExists) {
      return response.status(400).json({ error: 'Student does not exist' });
    }

    const plan = await Plan.findByPk(request.body.plan_id);

    if (!plan) {
      return response.status(400).json({ error: 'Plan does not exist' });
    }

    const enrollment = await Enrollment.findByPk(request.params.id);

    if (!enrollment) {
      return response.status(400).json({ error: 'Enrollment does not exist' });
    }

    /* Trying to update registration to another student_id */
    if (enrollment.student_id !== studentExists.id) {
      const studentAlreadyHasPlan = await Enrollment.findOne({
        where: { student_id: request.body.student_id },
      });

      if (studentAlreadyHasPlan) {
        return response
          .status(400)
          .json({ error: 'The student already has a plan' });
      }
    }

    const newEnrollment = {
      start_date: request.body.start_date,
      student_id: request.body.student_id,
      plan_id: request.body.plan_id,
    };

    if (
      enrollment.start_date !== request.body.start_date ||
      enrollment.plan_id !== plan.id
    ) {
      newEnrollment.end_date = addMonths(
        parseISO(request.body.start_date),
        plan.duration
      );
      newEnrollment.price = plan.price * plan.duration;
    }

    const {
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    } = await enrollment.update(newEnrollment);

    /* Notify the enrolled student */
    await NotificationStudent.create({
      content: `Matrícula alterada com plano ${
        plan.title
      } no valor R$ ${price} entre o periodo ${format(
        start_date,
        "dd'/'MM'/'yyyy",
        {
          locale: ptBr,
        }
      )} a ${format(end_date, "dd'/'MM'/'yyyy", {
        locale: ptBr,
      })}`,
      student: student_id,
    });

    // Adicionar na fila
    await Queue.add(AlterEnrollmentMail.key, {
      student: studentExists,
      plan,
      start_date,
      end_date,
      price,
    });

    return response.json({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async destroy(request, response) {
    const { id } = request.params;

    const EnrollmentExists = await Enrollment.findByPk(id);
    if (!EnrollmentExists) {
      return response.status(400).json({ error: 'Enrollment not found.' });
    }

    await Enrollment.destroy({ where: { id } });

    return response
      .status(200)
      .json({ message: 'Enrollment deleted successfully' });
  }
}

export default new EnrollmentsController();
