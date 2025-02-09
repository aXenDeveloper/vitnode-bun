import { DynamicView } from 'vitnode/views/dynamic-view';

export default function CatchAllPage(
  props: React.ComponentProps<typeof DynamicView>,
) {
  return <DynamicView {...props} />;
}
