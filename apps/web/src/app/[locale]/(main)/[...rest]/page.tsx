import { locales } from '@/i18n';
import {
  dynamicGenerateStaticParams,
  DynamicView,
  generateMetadataDynamicView,
} from 'vitnode/views/dynamic-view';

export const generateMetadata = generateMetadataDynamicView;
export const generateStaticParams = () => dynamicGenerateStaticParams(locales);

export default function CatchAllPage(
  props: React.ComponentProps<typeof DynamicView>,
) {
  return <DynamicView {...props} />;
}
