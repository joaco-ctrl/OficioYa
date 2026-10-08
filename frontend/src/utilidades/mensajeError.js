export function obtenerMensajeError(error, mensajePredeterminado) {
	return error.response?.data?.error
		|| error.response?.data?.message
		|| error.response?.data?.mensaje
		|| error.message
		|| mensajePredeterminado
}
