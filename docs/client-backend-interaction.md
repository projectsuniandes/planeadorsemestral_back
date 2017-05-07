# planeadorsemestral_back

Cuando se requiera hacer un listado de las materias combinadas de 2 o más programas, el frontend podrá pedirlas a la siguiente ruta:

*GET api/merge?program1=FISI&program2=ISIS&program3=IELE*

Y esto retorna:

[
  {
    "course_code": "FISI2350",
    "name": "FISICA ATOMICA",
    "program_id": 1,
    "program_code": "FISI",
    "credits": 3, ---> TODO!
  },
  {
    "course_code": "FISI2026",
    "name": "HERRAMIENTAS COMPUTACIONALES",
    "program_id": 1,
    "program_code": "FISI"
  },
  {
    "course_code": "FISI3901",
    "name": "SEM.1 ASTRONOMIA Y ASTROFISICA",
    "program_id": 1,
    "program_code": "FISI"
  },
  ...
]

Cuando el cliente desde el front envía sus preferencias de optimizacion, el JSON del POST tendrá el siguiente formato:

{
  "firstProgram": "ISIS",
  "secondProgram": "FISI",
  "option": "BIOL",
  "coursesTaken": ["ISIS1001", "MATE1002", "DERE1300"],
  "minCredits": 17,
  "maxCredits": 25
}

*POST api/optimize*

El return del post es:

{
  "numSemesters": 17,
  "semesters": [
    {
      "num": 1,
      "courses": [
        "FISI6113",
        "FISI3013",
        "ISIS1404L",
        "ISIS3710",
        "FISI4042",
        "FISI6962",
        "ISIS2403",
        "FISI4902"
      ]
    },
    {
      "num": 2,
      "courses": [
        "FISI2350",
        "FISI3028",
        "FISI1019",
        "FISI2007",
        "ISIS4005",
        "ISIS4217",
        "FISI4602",
        "FISI1860"
      ]
    }, ...
  ]
}
