export const oficios = [
  'Plomería',
  'Pintura',
  'Herramientas',
  'Gasista',
  'Electricista',
  'Carpintería',
  'Otro'
]

export const zonas = ['Tandil', 'Vela', 'CABA', 'Vicente López', 'San Isidro']

export const categoriasPopulares = [
  { id: 1, nombre: 'PLOMERIA',},
  { id: 2, nombre: 'PINTURA',},
  { id: 3, nombre: 'HERRERIA',},
  { id: 4, nombre: 'GASISTA',},
  { id: 5, nombre: 'OTRO',}
]

export const profesionales = [
  {
    id: 1,
    nombre: 'Juan Perez',
    oficio: 'Plomero profesional',
    zona: 'Tandil, Vela',
    puntuacion: 5,
    disponibilidad: 'Lunes a viernes 13hs-19hs',
    verificado: true,
    sobreMi:
      'Soy Juan, plomero con más de 10 años de experiencia en instalaciones, reparaciones y destapes.',
    servicios: [
      { nombre: 'Reparación e instalación de cañerías', precio: 15000 },
      { nombre: 'Destape de caños', precio: 20000 },
      { nombre: 'Cambio de griferías', precio: 12000 }
    ],
    valoraciones: [
      { usuario: 'María', puntuacion: 5, comentario: 'Trabajo bien hecho y rápido.' },
      { usuario: 'Pedro', puntuacion: 5, comentario: 'Muy prolijo y puntual.' }
    ]
  },
  {
    id: 2,
    nombre: 'Tomas Gomez',
    oficio: 'Plomero matriculado',
    zona: 'Tandil',
    puntuacion: 4.8,
    disponibilidad: 'Lunes a sábados 9hs-18hs',
    verificado: true,
    sobreMi: 'Plomero matriculado con experiencia en obras y hogares.',
    servicios: [
      { nombre: 'Instalación completa de baño', precio: 45000 },
      { nombre: 'Reparación de pérdidas', precio: 8000 }
    ],
    valoraciones: [{ usuario: 'Lucía', puntuacion: 5, comentario: 'Excelente.' }]
  },
  {
    id: 3,
    nombre: 'Martin Gonzalez',
    oficio: 'Plomero principiante',
    zona: 'Tandil',
    puntuacion: 3,
    disponibilidad: 'Fines de semana',
    verificado: false,
    sobreMi: 'Plomero con ganas de crecer y ayudar en lo que necesites.',
    servicios: [{ nombre: 'Destapes simples', precio: 5000 }],
    valoraciones: []
  }
]