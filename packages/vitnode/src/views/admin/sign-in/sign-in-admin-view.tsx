import { Card } from '@/components/ui/card';
import { FormSignIn } from '@/views/auth/sign-in/form/form';

export const SignInAdminView = () => {
  return (
    <div className="mx-auto my-10 flex max-w-md flex-col gap-10 px-4 py-10">
      <Card className="p-6">
        <FormSignIn isAdmin />
      </Card>
    </div>
  );
};
