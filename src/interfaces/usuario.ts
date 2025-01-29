export interface loginDto{
  email:string,
  password:string
}

export interface usuarioDto{
  ci:string,
  nombre_persona:string,
  apellido_persona:string
  clave_persona:string,
  correo_persona:string,
  id:string,
}

export interface recuperaClave {
    id:string,
    clave_persona:string
}
