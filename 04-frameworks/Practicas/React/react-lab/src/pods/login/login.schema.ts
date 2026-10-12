//Zod es una librería de JavaScript/TypeScript que sirve para validar datos y, además, definir qué forma tienen esos datos.
//Es especialmente útil en React cuando recibes datos de una API, formularios, parámetros, etc.
//TypeScript no comprueba los datos que vienen de una API en tiempo de ejecución.

// Definimos con Zod las reglas que deben cumplir los datos del formulario de login.
// username es obligatorio y password debe tener al menos 4 caracteres.
// A partir de este esquema, inferimos automáticamente el tipo Credentials.

import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(4, "La contraseña necesita al menos 4 caracteres"),
})


export type Credentials = z.infer<typeof loginSchema>

