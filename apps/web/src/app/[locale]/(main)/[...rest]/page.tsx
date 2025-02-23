import { locales } from '@/i18n';
import {
  DynamicView,
  dynamicViewGenerateStaticParams,
  generateMetadataDynamicView,
} from 'vitnode/views/dynamic-view';

export const generateMetadata = generateMetadataDynamicView;
export const generateStaticParams = () =>
  dynamicViewGenerateStaticParams(locales);

export default function CatchAllPage(
  props: React.ComponentProps<typeof DynamicView>,
) {
  return <DynamicView {...props} />;
}
