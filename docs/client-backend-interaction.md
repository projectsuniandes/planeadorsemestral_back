# planeadorsemestral_back

Cuando el cliente desde el front envía sus preferencias de optimizacion, el JSON tendrá el siguiente formato (es un ejemplo):
Vamos a tener un programa base, que será el primer programa del estudiante. Los otros programas serán los extra que el estudiante quiera agregar durante su vida en la universidad.
Para efectos simples, probaremos other-programs con un tamanio de 1, y luego probaremos agregar nuevos programas.

{
  "firstProgram": "ISIS",
  "secondProgram": "FISI",
  "option": "BIOL",
  "coursesTaken": ["ISIS1001", "MATE1002", "DERE1300"],
  "minCredits": 17,
  "maxCredits": 25
}


Cuando se requiera hacer un listado de las materias combinadas de 2 o más programas, el frontend podrá pedirlas a la siguiente ruta:

GET api/merge?program1=FISI&program2=ISIS&program3=IELE

Y esto retorna:

[
  {
    "id": 1,
    "course_code": "FISI2350",
    "credits": 3, ---> TODO! 
    "name": null,
    "program_id": 1,
    "program_code": "FISI"
  },
  {
    "id": 1,
    "course_code": "FISI2026",
    "name": null,
    "program_id": 1,
    "program_code": "FISI"
  },
  ...
]
