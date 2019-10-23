/* Models */
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';

class EnrollmentsController {
  async index(request, response) {
    const { page = 1 } = request.query;
    const limit = 20;

    const enrollments = await Enrollment.findAll({
      include: [
        {
          model: Student,
        },
      ],
      order: ['id'],
      limit: 20,
      offset: (page - 1) * limit,
    });

    return response.json(enrollments);
  }
}

export default new EnrollmentsController();
