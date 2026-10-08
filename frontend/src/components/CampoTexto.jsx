function CampoTexto({ label, tipo = 'text', nombre, valor, onChange }) {
  return (
    <div className="campo">
      <label htmlFor={nombre}>{label}</label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        value={valor}
        onChange={onChange}
      />
    </div>
  )
}

export default CampoTexto