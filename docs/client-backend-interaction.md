# planeadorsemestral_back

Cuando se requiera hacer un listado de las materias combinadas de 2 o más programas, el frontend podrá pedirlas a la siguiente ruta:

*GET api/merge/correcto?program1=FISI&program2=ISIS&program3=IELE*

Y esto retorna:

[
  {
    "course_code": "FISI2026",
    "course_name": "HERRAMIENTAS COMPUTACIONALES",
    "credits": "1"
  },
  {
    "course_code": "ISIS1001",
    "course_name": "INTROD. INGENIERIA DE SISTEMAS",
    "credits": "3"
  },
  {
    "course_code": "ISIS2203",
    "course_name": "INFRAESTRUCTURA COMPUTACIONAL",
    "credits": "3"
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
  "numSemesters": 5,
  "semesters": [
    {
      "num": 1,
      "courses": [
        "FISI1002",
        "FISI1003",
        "FISI1029",
        "FISI1038",
        "FISI2026",
        "ISIS1002",
        "ISIS1204",
        "ISIS1206",
        "ISIS1404",
        "ISIS2008",
        "ISIS2603",
        "ISIS3302",
        "ISIS3710",
        "ISIS3990"
      ]
    },
    {
      "num": 2,
      "courses": [
        "DERE1300",
        "FISI1019",
        "FISI1028",
        "FISI1048",
        "ISIS1001",
        "ISIS1304",
        "ISIS2403",
        "ISIS3204",
        "MBIO1100"
      ]
    },
    {
      "num": 3,
      "courses": [
        "FISI1039",
        "IIND2106",
        "IIND2401",
        "ISIS1105",
        "ISIS2007",
        "ISIS2203",
        "MATE1203",
        "MATE1214",
        "QUIM1101"
      ]
    }, ...
  ]
}
