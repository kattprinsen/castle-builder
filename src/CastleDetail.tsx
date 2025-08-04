import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CastleDetail({ castle, onSave }: { castle: {id: number, name: string}, onSave: (castle: {id: number, name: string}) => void }) {
  const [name, setName] = useState(castle.name);
  const navigate = useNavigate();

  const handleSave = () => {
    onSave({ ...castle, name });
  };

  const goHome = () => {
    navigate('/')
  }

  return (
    <div>
      <button onClick={goHome}>Home</button>
      <h2>Edit Castle</h2>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default CastleDetail;
