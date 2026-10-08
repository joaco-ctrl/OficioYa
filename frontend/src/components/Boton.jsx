function Boton({ texto, tipo = 'button', onClick, variante = 'azul', children }) {
  return (
    <button type={tipo} onClick={onClick} className={`boton boton-${variante}`}>
      {children || texto}
    </button>
  )
}

export default Boton