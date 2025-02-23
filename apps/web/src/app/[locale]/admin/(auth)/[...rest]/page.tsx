import { locales } from '@/i18n';
import {
  DynamicAdminView,
  dynamicAdminViewGenerateStaticParams,
  generateMetadataDynamicAdminView,
} from 'vitnode/views/admin/dynamic-admin-view';

export const generateMetadata = generateMetadataDynamicAdminView;
export const generateStaticParams = () =>
  dynamicAdminViewGenerateStaticParams(locales);

export default function CatchAllPage(
  props: React.ComponentProps<typeof DynamicAdminView>,
) {
  return <DynamicAdminView {...props} />;
}
