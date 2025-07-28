import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './DashboardStyle.css';
import { API_BASE_URL } from "./apiConfig";

function TipoEdit({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipo, setTipo] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = `${API_BASE_URL}/tipos/${id}`;
  const authHeader = {
    Authorization: `Basic ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    fetch(API, { headers: authHeader })
      .then(res => res.json())
      .then(data => {
        setTipo({ nombre: data.nombre });
        setLoading(false);
      });
  }, [API]);

  const handleChange = (e) => {
    setTipo({ ...tipo, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    const res = await fetch(API, {
      method: 'PUT',
      headers: authHeader,
      body: JSON.stringify({ nombre: tipo.nombre })
    });
    if (res.ok) {
      alert("Tipo actualizado");
      navigate('/dashboard');
    } else {
      alert("Error al actualizar tipo");
    }
  };

  if (loading || !tipo) return <div className="dashboard-container"><div className="dashboard-card">Cargando...</div></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Editar Tipo</h2>
        <input
          name="nombre"
          value={tipo.nombre}
          onChange={handleChange}
          placeholder="Nombre del tipo"
        />
        <button className="green-btn" onClick={handleGuardar}>Guardar Cambios</button>
        <button className="logout-btn" onClick={() => navigate('/dashboard')}>Cancelar</button>
      </div>
    </div>
  );
}
export default TipoEdit;
