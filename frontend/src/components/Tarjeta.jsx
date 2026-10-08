function Tarjeta({ children, ancho = '480px' }) {
  return (
    <div className="tarjeta" style={{ maxWidth: ancho }}>
      {children}
    </div>
  )
}

export default Tarjeta