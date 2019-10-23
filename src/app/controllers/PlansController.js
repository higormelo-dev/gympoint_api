import * as Yup from 'yup';
/* Models */
import Plan from '../models/Plan';

class PlansController {
  async index(request, response) {
    const { page = 1 } = request.query;
    const limit = 20;

    const plans = await Plan.findAll({
      order: [['id', 'desc']],
      limit: 20,
      offset: (page - 1) * limit,
    });

    return response.json(plans);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .positive()
        .integer(),
      price: Yup.number().required(),
      active: Yup.boolean().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation falis plan' });
    }

    const PlanExists = await Plan.findOne({
      where: { title: request.body.title },
    });

    if (PlanExists) {
      return response.status(400).json({ error: 'Plan already exists.' });
    }

    const { title, duration, price, active } = await Plan.create(request.body);

    return response.json({ title, duration, price, active });
  }

  async show(request, response) {
    const { id } = request.params;

    const plan = await Plan.findByPk(id, {
      attributes: ['id', 'title', 'duration', 'price', 'active'],
    });

    if (!plan) {
      return response.status(400).json({ error: 'Plan not found.' });
    }

    return response.json(plan);
  }

  async update(request, response) {
    const { id } = request.params;

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .positive()
        .integer(),
      price: Yup.number().required(),
      active: Yup.boolean().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation falis plan' });
    }

    const plan = await Plan.findByPk(id);

    if (request.body.title !== plan.title) {
      const PlanExists = await Plan.findOne({
        where: { title: request.body.title },
      });

      if (PlanExists) {
        return response.status(400).json({ error: 'Plan already exists.' });
      }
    }

    const { title, duration, price, active } = await plan.update(request.body);

    return response.json({ title, duration, price, active });
  }

  async destroy(request, response) {
    const { id } = request.params;

    const planExists = await Plan.findByPk(id);
    if (!planExists) {
      return response.status(400).json({ error: 'Plan not found.' });
    }

    await Plan.destroy({ where: { id } });

    return response.status(200).json({ message: 'Plan deleted successfully.' });
  }
}

export default new PlansController();
