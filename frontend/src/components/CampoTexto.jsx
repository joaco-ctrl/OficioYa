function CampoTexto({ label, tipo = 'text', nombre, valor, onChange, requerido = false }) {
  return (
    <div className="campo">
      <label htmlFor={nombre}>{label}</label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        required={requerido}
        value={valor}
        onChange={onChange}
      />
    </div>
  )
}

export default CampoTexto