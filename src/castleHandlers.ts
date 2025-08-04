import { toSlug } from './slugUtil';

export async function handleCreateCastle(
  castleName: string,
  castles: {id: number, name: string, slug?: string}[],
  setCastles: React.Dispatch<React.SetStateAction<{id: number, name: string, slug?: string}[]>>,
  setCastleName: React.Dispatch<React.SetStateAction<string>>
) {
  if(!castleName) return;
  // Generate unique slug
  const baseSlug = toSlug(castleName);
  let slug = baseSlug;
  let i = 1;
  while (castles.some(c => c.slug === slug)) {
    slug = `${baseSlug}-${i++}`;
  }
  const res = await fetch('http://localhost:4000/api/castles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ name: castleName })
  })
  const newCastle = await res.json();
  setCastles([ ...castles, { ...newCastle, slug }]);
  setCastleName('');
}

export async function handleSaveCastle(
  castle: {id: number, name: string, slug?: string},
  castles: {id: number, name: string, slug?: string}[],
  setCastles: React.Dispatch<React.SetStateAction<{id: number, name: string, slug?: string}[]>>
) {
  const res = await fetch(`http://localhost:4000/api/castles/${castle.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ name: castle.name })
  });
  if (res.ok) {
    setCastles(castles.map(c =>
      c.id === castle.id
        ? { ...c, name: castle.name, slug: c.slug }
        : c
    ));
  }
}
