import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardStyle.css';
import { API_BASE_URL } from "./apiConfig";

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

  const tipoInputRef = useRef(null);
  const navigate = useNavigate();

  const PLATILLOS_API = `${API_BASE_URL}/platillos`;
  const TIPOS_API = `${API_BASE_URL}/tipos`;

  const authHeader = {
    Authorization: `Basic ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    setTimeout(() => {
      if (tipoInputRef.current) {
        tipoInputRef.current.blur();
      }
      window.scrollTo(0, 0);
    }, 150);
  }, []);

  useEffect(() => {
    fetchPlatillos();
    fetchTipos();
  }, []);

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

  const handleEliminarPlatillo = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este platillo?')) return;
    const res = await fetch(`${PLATILLOS_API}/${id}`, {
      method: 'DELETE',
      headers: authHeader
    });
    if (res.ok) {
      await fetchPlatillos();
      await fetchTipos();
      alert('Platillo eliminado');
    } else {
      alert('Error al eliminar el platillo');
    }
  };

  const handleEliminarTipo = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este tipo? (Se eliminarán sus platillos)')) return;
    const res = await fetch(`${TIPOS_API}/${id}`, {
      method: 'DELETE',
      headers: authHeader
    });
    if (res.ok) {
      await fetchTipos();
      await fetchPlatillos();
      alert('Tipo eliminado');
    } else {
      alert('Error al eliminar el tipo');
    }
  };

  const handleEditarPlatillo = (id) => {
    navigate(`/platillos/${id}/edit`);
  };

  const handleEditarTipo = (id) => {
    navigate(`/tipos/${id}/edit`);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  const platillosOrdenados = [...platillos].sort((a, b) => {
    if (a.tipoId !== b.tipoId) return a.tipoId - b.tipoId;
    return a.id - b.id;
  });

  const tiposOrdenados = [...tipos].sort((a, b) => a.id - b.id);

  // ✅ Agrupar platillos por tipoId
  const platillosPorTipo = tiposOrdenados.reduce((acc, tipo) => {
    acc[tipo.id] = platillos.filter(p => p.tipoId === tipo.id);
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="header">
          <h1>Panel de Administración</h1>
          <button onClick={cerrarSesion} className="logout-btn">Cerrar sesión</button>
        </div>

        <section>
          <h2>Crear Tipo</h2>
          <input
            type="text"
            ref={tipoInputRef}
            autoComplete="off"
            value={tipoNombre}
            onChange={e => setTipoNombre(e.target.value)}
            placeholder="Nombre del tipo"
          />
          <button className="green-btn" onClick={handleCrearTipo}>Guardar Tipo</button>
        </section>

        <section>
          <h2>Crear Platillo</h2>
          <input
            type="text"
            autoComplete="off"
            value={platillo.nombre}
            onChange={e => setPlatillo({ ...platillo, nombre: e.target.value })}
            placeholder="Nombre del platillo"
          />
          <input
            type="number"
            autoComplete="off"
            value={platillo.precio}
            onChange={e => setPlatillo({ ...platillo, precio: e.target.value })}
            placeholder="Precio"
          />
          <input
            type="number"
            autoComplete="off"
            value={platillo.tipoId}
            onChange={e => setPlatillo({ ...platillo, tipoId: e.target.value })}
            placeholder="ID del tipo"
          />
          <input
            type="text"
            autoComplete="off"
            value={platillo.insumos}
            onChange={e => setPlatillo({ ...platillo, insumos: e.target.value })}
            placeholder="Insumos separados por coma"
          />
          <button className="green-btn" onClick={handleCrearPlatillo}>Guardar Platillo</button>
        </section>

        <section>
          <h2>Lista de Platillos</h2>
          {platillosOrdenados.length === 0 ? (
            <p>No hay platillos registrados</p>
          ) : (
            <ul className="platillo-list">
              {platillosOrdenados.map(p => (
                <li key={p.id}>
                  <span>
                    <strong>{p.nombre}</strong> – €{p.precio} – Tipo: {p.tipoNombre}<br />
                    Insumos: {p.insumos.join(', ')}
                  </span>
                  <span>
                    <button
                      className="delete-btn"
                      title="Eliminar platillo"
                      onClick={() => handleEliminarPlatillo(p.id)}
                    >🗑️</button>
                    <button
                      className="update-btn"
                      title="Actualizar platillo"
                      onClick={() => handleEditarPlatillo(p.id)}
                    >✏️</button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2>Lista de Tipos</h2>
          {tiposOrdenados.length === 0 ? (
            <p>No hay tipos registrados</p>
          ) : (
            tiposOrdenados.map(t => (
              <div className="tipo-card" key={t.id}>
                <h3>
                  {t.nombre}{' '}
                  <span style={{ color: "#888", fontWeight: "normal", fontSize: "1rem" }}>
                    ID: {t.id}
                  </span>
                  <button
                    className="delete-btn"
                    title="Eliminar tipo"
                    onClick={() => handleEliminarTipo(t.id)}
                  >🗑️</button>
                  <button
                    className="update-btn"
                    title="Actualizar tipo"
                    onClick={() => handleEditarTipo(t.id)}
                  >✏️</button>
                </h3>
                <ul>
                  {(platillosPorTipo[t.id] || []).map(p => (
                    <li key={p.id}>{p.nombre} – €{p.precio}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
