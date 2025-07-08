// src/Dashboard.jsx
import { useState, useEffect } from 'react';

function Dashboard({ token }) {
  const [tipoNombre, setTipoNombre] = useState('');
  const [platillo, setPlatillo] = useState({
    nombre: '',
    precio: '',
    tipoId: '',
    insumos: ''
  });

  const [platillos, setPlatillos] = useState([]);
  const [tipos, setTipos] = useState([]);

  const PLATILLOS_API = 'https://backend-restaurant-production-9a85.up.railway.app/api/platillos';
  const TIPOS_API = 'https://backend-restaurant-production-9a85.up.railway.app/api/tipos';

  useEffect(() => {
    fetchPlatillos();
    fetchTipos();
  }, []);

  const authHeader = {
    Authorization: `Basic ${token}`,
    'Content-Type': 'application/json'
  };

  const fetchPlatillos = async () => {
    const res = await fetch(PLATILLOS_API, { headers: authHeader });
    const data = await res.json();
    setPlatillos(data);
  };

  const fetchTipos = async () => {
    const res = await fetch(TIPOS_API, { headers: authHeader });
    const data = await res.json();
    setTipos(data);
  };

  const handleCrearTipo = async () => {
    const res = await fetch(TIPOS_API, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({ nombre: tipoNombre })
    });

    if (res.ok) {
      setTipoNombre('');
      await fetchTipos();
      alert('Tipo creado');
    } else {
      alert('Error al crear el tipo');
    }
  };

  const handleCrearPlatillo = async () => {
    const insumosArray = platillo.insumos.split(',').map(i => i.trim());

    const res = await fetch(PLATILLOS_API, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({
        nombre: platillo.nombre,
        precio: Number(platillo.precio),
        tipoId: Number(platillo.tipoId),
        insumos: insumosArray
      })
    });

    if (res.ok) {
      setPlatillo({ nombre: '', precio: '', tipoId: '', insumos: '' });
      await fetchPlatillos();
      await fetchTipos();
      alert('Platillo creado');
    } else {
      alert('Error al crear el platillo');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Panel de Pruebas</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Crear Tipo</h2>
        <input
          type="text"
          value={tipoNombre}
          onChange={e => setTipoNombre(e.target.value)}
          placeholder="Nombre del tipo"
        />
        <button onClick={handleCrearTipo}>Guardar Tipo</button>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Crear Platillo</h2>
        <input
          type="text"
          value={platillo.nombre}
          onChange={e => setPlatillo({ ...platillo, nombre: e.target.value })}
          placeholder="Nombre del platillo"
        />
        <input
          type="number"
          value={platillo.precio}
          onChange={e => setPlatillo({ ...platillo, precio: e.target.value })}
          placeholder="Precio"
        />
        <input
          type="number"
          value={platillo.tipoId}
          onChange={e => setPlatillo({ ...platillo, tipoId: e.target.value })}
          placeholder="ID del tipo"
        />
        <input
          type="text"
          value={platillo.insumos}
          onChange={e => setPlatillo({ ...platillo, insumos: e.target.value })}
          placeholder="Insumos separados por coma"
        />
        <button onClick={handleCrearPlatillo}>Guardar Platillo</button>
      </section>

      <section>
        <h2>Lista de Platillos</h2>
        {platillos.length === 0 ? (
          <p>No hay platillos registrados</p>
        ) : (
          <ul>
            {platillos.map(p => (
              <li key={p.id}>
                <strong>{p.nombre}</strong> – €{p.precio} – Tipo: {p.tipoNombre}<br />
                Insumos: {p.insumos.join(', ')}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Lista de Tipos</h2>
        {tipos.length === 0 ? (
          <p>No hay tipos registrados</p>
        ) : (
          tipos.map(t => (
            <div key={t.id}>
              <h4>{t.nombre}</h4>
              <ul>
                {t.platillos.map(p => (
                  <li key={p.id}>{p.nombre} – €{p.precio}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Dashboard;
