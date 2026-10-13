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
  { id: 1, nombre: 'PLOMERIA' },
  { id: 2, nombre: 'PINTURA' },
  { id: 3, nombre: 'HERRERIA' },
  { id: 4, nombre: 'GASISTA' },
  { id: 5, nombre: 'OTRO' }
]

export const profesionales = [
  {
    id: 1,
    nombre: 'Juan Perez',
    oficio: 'Plomería',
    titulo: 'Plomero profesional',
    zona: 'Tandil, Vela',
    puntuacion: 5,
    disponibilidad: 'Lunes a viernes 13hs-19hs',
    verificado: true,
    confianza: 'Alto',
    trabajosRealizados: 32,
    sobreMi:
      'Soy Juan, plomero con más de 10 años de experiencia en instalaciones, reparaciones y destapes. Trabajo en Tandil y alrededores con atención personalizada.',
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
    oficio: 'Plomería',
    titulo: 'Plomero matriculado',
    zona: 'Tandil',
    puntuacion: 4.8,
    disponibilidad: 'Lunes a sábados 9hs-18hs',
    verificado: true,
    confianza: 'Alto',
    trabajosRealizados: 47,
    sobreMi: 'Plomero matriculado con experiencia en obras y hogares. Especializado en instalaciones completas.',
    servicios: [
      { nombre: 'Instalación completa de baño', precio: 45000 },
      { nombre: 'Reparación de pérdidas', precio: 8000 }
    ],
    valoraciones: [{ usuario: 'Lucía', puntuacion: 5, comentario: 'Excelente.' }]
  },
  {
    id: 3,
    nombre: 'Martin Gonzalez',
    oficio: 'Plomería',
    titulo: 'Plomero principiante',
    zona: 'Tandil',
    puntuacion: 3,
    disponibilidad: 'Fines de semana',
    verificado: false,
    confianza: 'Bajo',
    trabajosRealizados: 4,
    sobreMi: 'Plomero con ganas de crecer y ayudar en lo que necesites.',
    servicios: [{ nombre: 'Destapes simples', precio: 5000 }],
    valoraciones: []
  },
  {
    id: 4,
    nombre: 'Carlos Fernández',
    oficio: 'Electricista',
    titulo: 'Electricista independiente',
    zona: 'Tandil',
    puntuacion: 4.9,
    disponibilidad: 'Lunes a viernes 8hs-20hs',
    verificado: true,
    confianza: 'Alto',
    trabajosRealizados: 58,
    sobreMi:
      'Electricista con más de 15 años de experiencia en instalaciones domiciliarias y comerciales. Trabajo con materiales de primera calidad.',
    servicios: [
      { nombre: 'Instalación eléctrica completa', precio: 35000 },
      { nombre: 'Reparación de cortocircuitos', precio: 10000 },
      { nombre: 'Colocación de luminarias', precio: 8000 }
    ],
    valoraciones: [
      { usuario: 'Ana', puntuacion: 5, comentario: 'Muy profesional y rápido.' },
      { usuario: 'Luis', puntuacion: 5, comentario: 'Recomendado.' }
    ]
  },
  {
    id: 5,
    nombre: 'Lucía Fernández',
    oficio: 'Pintura',
    titulo: 'Pintora profesional',
    zona: 'CABA',
    puntuacion: 4.9,
    disponibilidad: 'Lunes a sábados 8hs-18hs',
    verificado: true,
    confianza: 'Alto',
    trabajosRealizados: 47,
    sobreMi: 'Pintora con experiencia en interiores y exteriores. Trabajo prolijo y comprometido.',
    servicios: [
      { nombre: 'Pintura de interior', precio: 25000 },
      { nombre: 'Pintura de exterior', precio: 40000 }
    ],
    valoraciones: [{ usuario: 'Sofía', puntuacion: 5, comentario: 'Excelente trabajo.' }]
  },
  {
    id: 6,
    nombre: 'Diego Martínez',
    oficio: 'Gasista',
    titulo: 'Gasista matriculado',
    zona: 'Vicente López',
    puntuacion: 4.7,
    disponibilidad: 'Lunes a viernes 9hs-17hs',
    verificado: true,
    confianza: 'Alto',
    trabajosRealizados: 36,
    sobreMi: 'Gasista matriculado con experiencia en instalaciones y habilitaciones.',
    servicios: [
      { nombre: 'Habilitación de gas', precio: 30000 },
      { nombre: 'Instalación de estufas', precio: 18000 }
    ],
    valoraciones: [{ usuario: 'Roberto', puntuacion: 4, comentario: 'Buen trabajo.' }]
  },
  {
    id: 7,
    nombre: 'Mariana Sosa',
    oficio: 'Carpintería',
    titulo: 'Carpintera profesional',
    zona: 'San Isidro',
    puntuacion: 5,
    disponibilidad: 'Lunes a viernes 10hs-19hs',
    verificado: true,
    confianza: 'Alto',
    trabajosRealizados: 15,
    sobreMi: 'Carpintera especializada en muebles a medida y placares.',
    servicios: [
      { nombre: 'Placard a medida', precio: 80000 },
      { nombre: 'Mesa de comedor', precio: 45000 }
    ],
    valoraciones: [{ usuario: 'Carla', puntuacion: 5, comentario: 'Hermoso trabajo.' }]
  },
  {
    id: 8,
    nombre: 'Pedro Ramírez',
    oficio: 'Herramientas',
    titulo: 'Herrero profesional',
    zona: 'Tandil',
    puntuacion: 4.5,
    disponibilidad: 'Lunes a viernes 8hs-17hs',
    verificado: false,
    confianza: 'Medio',
    trabajosRealizados: 12,
    sobreMi: 'Herrero con experiencia en rejas, portones y estructuras metálicas.',
    servicios: [
      { nombre: 'Reja para ventana', precio: 25000 },
      { nombre: 'Portón corredizo', precio: 90000 }
    ],
    valoraciones: []
  }
]