export function mensajeError(error, mensajePredeterminado = 'Ocurrió un error. Intentá nuevamente.') {
  return (
    error.response?.data?.mensaje ||
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    mensajePredeterminado
  )
}