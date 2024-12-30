import { Service, Inject } from 'typedi';
import { IUser } from '@/interfaces/IUser';

interface EmailClient {
  messages: {
    create(domain: string, data: EmailData): Promise<any>;
  };
}

interface EmailData {
  from: string;
  to: string[];
  subject: string;
  text: string;
}

@Service()
export default class MailerService {
  constructor(
    @Inject('emailClient') private emailClient: EmailClient,
    @Inject('emailDomain') private emailDomain: string,
  ) { }

  public async SendWelcomeEmail(email: IUser) {
    /**
     * @TODO Call Mailchimp/Sendgrid or whatever
     */
    // Added example for sending mail from mailgun
    const data: EmailData = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: [email.email],
      subject: 'Hello',
      text: 'Testing some Mailgun awesomness!'
    };
    try {
      await this.emailClient.messages.create(this.emailDomain, data);
      return { delivered: 1, status: 'ok' };
    } catch(e) {
      return  { delivered: 0, status: 'error' };
    }
  }
  public StartEmailSequence(sequence: string, user: Partial<IUser>) {
    if (!user.email) {
      throw new Error('No email provided');
    }
    // @TODO Add example of an email sequence implementation
    // Something like
    // 1 - Send first email of the sequence
    // 2 - Save the step of the sequence in database
    // 3 - Schedule job for second email in 1-3 days or whatever
    // Every sequence can have its own behavior so maybe
    // the pattern Chain of Responsibility can help here.
    return { delivered: 1, status: 'ok' };
  }
}
