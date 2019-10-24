/* Models */
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class AvailablesController {
  async index(request, response) {
    const helpOrders = await HelpOrder.findAll({
      where: { answer: null },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
      attributes: ['id', 'question', 'createdAt'],
    });

    return response.json(helpOrders);
  }
}

export default new AvailablesController();
