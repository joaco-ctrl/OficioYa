function CampoTexto({
  label,
  tipo = 'text',
  nombre,
  valor,
  onChange,
  requerido = false,
  minimo,
  maximo
}) {
  return (
    <div className="campo">
      <label htmlFor={nombre}>{label}</label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        required={requerido}
        minLength={minimo}
        maxLength={maximo}
        value={valor}
        onChange={onChange}
      />
    </div>
  )
}

export default CampoTexto