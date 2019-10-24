import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AlterEnrollmentMail {
  get key() {
    return 'AlterEnrollmentMail';
  }

  async handle({ data }) {
    const { student, plan, end_date, start_date, price } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula Alterada com sucesso',
      template: 'alter-enrollment-mail',
      context: {
        student: student.name,
        start_date: format(parseISO(start_date), "dd'/'MM'/'yyyy", {
          locale: pt,
        }),
        end_date: format(parseISO(end_date), "dd'/'MM'/'yyyy", {
          locale: pt,
        }),
        duration: plan.duration,
        price,
      },
    });
  }
}

export default new AlterEnrollmentMail();
