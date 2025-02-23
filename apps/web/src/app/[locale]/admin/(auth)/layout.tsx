import { AdminLayout } from 'vitnode/views/admin/layouts/admin-layout';

export default function Layout(
  props: Pick<React.ComponentProps<typeof AdminLayout>, 'children' | 'params'>,
) {
  return <AdminLayout {...props} />;
}
