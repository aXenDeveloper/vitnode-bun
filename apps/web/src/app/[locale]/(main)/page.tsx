import { Link } from 'vitnode/utils/navigation';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Link href="/test">test</Link>
    </div>
  );
}
