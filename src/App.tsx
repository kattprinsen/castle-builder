import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CastlePage from './CastlePage';
import { handleCreateCastle, handleSaveCastle } from './castleHandlers';
import { toSlug } from './slugUtil';
import './App.css'

function App() {
  const [castles, setCastles] = useState<{id: number, name: string, slug?: string}[]>([]);
  const [castleName, setCastleName] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/castles').then(res => res.json()).then(
      data => {
        // Add slugs to castles if missing (for initial load)
        type Castle = { id: number; name: string; slug?: string };
        setCastles(data.castles.map((c: Castle) => {
          if (c.slug) return c;
          // Generate unique slug for each castle
          const baseSlug = toSlug(c.name);
          let slug = baseSlug;
          let i = 1;
          while (data.castles.some((other: Castle) => other !== c && other.slug === slug)) {
            slug = `${baseSlug}-${i++}`;
          }
          return { ...c, slug };
        }));
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <h1>Castles</h1>
            <ul>
              {castles.map(c => (
                <li key={c.id}>
                  <Link to={`/castle/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
            <input 
                value={castleName}
                onChange={e => setCastleName(e.target.value)}
                placeholder='Castle Name'
              /> 
              <button onClick={() => handleCreateCastle(castleName, castles, setCastles, setCastleName)}>Create Castle</button>
          </>
        } />
        <Route path="/castle/:name" element={<CastlePage castles={castles} onSave={(castle) => handleSaveCastle(castle, castles, setCastles)} />} />
      </Routes>
    </Router>
  );
}

export default App;
