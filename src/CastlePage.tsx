import CastleDetail from './CastleDetail';
import { useParams, useNavigate } from 'react-router-dom';

type Castle = { id: number, name: string, slug?: string };

function CastlePage({ castles, onSave }: { castles: Castle[], onSave: (castle: Castle) => void }) {
  const { name } = useParams();
  const navigate = useNavigate();
  const decodedSlug = name ? decodeURIComponent(name) : '';
  const castle = castles.find(c => c.slug === decodedSlug);
  if (!castle) return <div>Castle not found</div>;
  return <CastleDetail castle={castle} onSave={c => { onSave(c); navigate('/'); }} />;
}

export default CastlePage;
