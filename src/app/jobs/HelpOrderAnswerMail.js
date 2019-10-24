import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  get key() {
    return 'HelpOrderAnswerMail';
  }

  async handle({ data }) {
    const { student, helpOrder, user } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Pergunta respondida',
      template: 'help-order-answer',
      context: {
        student: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
        user: user.name,
        created_at: format(parseISO(helpOrder.createdAt), "dd'/'MM'/'yyyy", {
          locale: pt,
        }),
        answer_at: format(parseISO(helpOrder.answer_at), "dd'/'MM'/'yyyy", {
          locale: pt,
        }),
      },
    });
  }
}

export default new HelpOrderAnswerMail();
