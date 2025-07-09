import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './DashboardStyle.css';

function EditPlatillo({ token }) {
  const { id } = useParams();
  const [platillo, setPlatillo] = useState({
    nombre: '',
    precio: '',
    tipoId: '',
    insumos: ''
  });
  const [tipos, setTipos] = useState([]);
  const navigate = useNavigate();

  const PLATILLOS_API = 'https://backend-restaurant-production-9a85.up.railway.app/api/platillos';
  const TIPOS_API = 'https://backend-restaurant-production-9a85.up.railway.app/api/tipos';

  const authHeader = {
    Authorization: `Basic ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    const fetchPlatillo = async () => {
      const res = await fetch(`${PLATILLOS_API}/${id}`, { headers: authHeader });
      const data = await res.json();
      setPlatillo({
        nombre: data.nombre || '',
        precio: data.precio || '',
        tipoId: data.tipoId ? data.tipoId.toString() : '',
        insumos: (data.insumos || []).join(', ')
      });
    };
    const fetchTipos = async () => {
      const res = await fetch(TIPOS_API, { headers: authHeader });
      const data = await res.json();
      setTipos(data);
    };
    fetchPlatillo();
    fetchTipos();
    // eslint-disable-next-line
  }, [id]);

  // Manejar cambios de los campos
  const handleChange = (e) => {
    setPlatillo({ ...platillo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const insumosArray = platillo.insumos.split(',').map(i => i.trim());
    const res = await fetch(`${PLATILLOS_API}/${id}`, {
      method: 'PUT',
      headers: authHeader,
      body: JSON.stringify({
        nombre: platillo.nombre,
        precio: Number(platillo.precio),
        tipoId: Number(platillo.tipoId),
        insumos: insumosArray
      })
    });
    if (res.ok) {
      alert('Platillo actualizado');
      navigate('/dashboard');
    } else {
      alert('Error al actualizar platillo');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del platillo"
            value={platillo.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={platillo.precio}
            onChange={handleChange}
            required
          />
          <select
            name="tipoId"
            value={platillo.tipoId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un tipo</option>
            {tipos.map(tipo => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre} (ID: {tipo.id})
              </option>
            ))}
          </select>
          <input
            type="text"
            name="insumos"
            placeholder="Insumos separados por coma"
            value={platillo.insumos}
            onChange={handleChange}
            required
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="green-btn" type="submit">Guardar Cambios</button>
            <button
              className="cancel-btn"
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPlatillo;
