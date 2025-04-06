import { locales } from '@/i18n';
import { vitNodeConfig } from '@/vitnode.config';
import {
  DynamicAdminView,
  dynamicAdminViewGenerateStaticParams,
  DynamicAdminViewProps,
  generateMetadataDynamicAdminView,
} from 'vitnode/views/admin/dynamic-admin-view';

export const generateMetadata = generateMetadataDynamicAdminView;
export const generateStaticParams = () =>
  dynamicAdminViewGenerateStaticParams(locales);

export default function CatchAllPage(props: DynamicAdminViewProps) {
  return <DynamicAdminView config={vitNodeConfig} {...props} />;
}
