import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [castles, setCastles] = useState<{id: number, name: string}[]>([]);
  const [castleName, setCastleName] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/castles').then(res => res.json()).then(
      data => setCastles(data.castles));
  }, [])

  const handleCreateCastle = async () => {
    if(!castleName) return;
    const res = await fetch('http://localhost:4000/api/castles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ name: castleName })
    })
    const newCastle = await res.json();
    setCastles([ ...castles, newCastle]);
    setCastleName('');
  }

  return (
    <>
      <h1>Castles</h1>
      <ul>
        {castles.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
      <input 
          value={castleName}
          onChange={e => setCastleName(e.target.value)}
          placeholder='Castle Name'
        /> 
        <button onClick={handleCreateCastle}>Create Castle</button>
    </>
  )
}

export default App
