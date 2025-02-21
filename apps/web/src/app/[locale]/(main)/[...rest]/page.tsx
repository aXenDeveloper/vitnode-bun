import {
  DynamicView,
  generateMetadataDynamicView,
} from 'vitnode/views/dynamic-view';

export const generateMetadata = generateMetadataDynamicView;

export default function CatchAllPage(
  props: React.ComponentProps<typeof DynamicView>,
) {
  return <DynamicView {...props} />;
}
