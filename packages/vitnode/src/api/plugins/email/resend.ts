import { EmailApiPlugin } from '@/api/models/email';
import { Resend } from 'resend';

export const ResendEmailPlugin = ({
  apiKey,
  from,
}: {
  apiKey: string;
  from: string;
}): EmailApiPlugin => {
  return {
    sendEmail: async ({ to, subject, replyTo, tags, site }) => {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: `${site.nameShort ?? site.name} <${from}>`,
        to,
        subject,
        replyTo,
        tags,
        html: '<strong>it works!</strong>',
      });

      if (error) {
        throw new Error(`[${error.name}]: ${error.message}`);
      }
    },
  };
};
