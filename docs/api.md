# API

* *GET api/merge/correcto?program1=FISI&program2=ISIS&program3=IELE*

Cuando se requiera hacer un listado de las materias combinadas que tienen que ver 2 o más programas. Esto retorna:

```json
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
  }
]
```

* *GET api/prerequisites?program1=FISI&program2=ISIS&program3=IELE*

Cuando se requiera obtener los prerrequisitos de las materias ofrecidas por los programas program1, program2, program3. La materias course1_codes abren la materia course2_code.

```json
[
  {
    "course_code": "FISI2026",
    "prerrequisites": ["ISIS1204", "ISIS1204", "ISIS1204"]
  },
  {
    "course_code": "FISI2026",
    "prerrequisites": ["ISIS1204", "ISIS1204", "ISIS1204"]
  },
  {
    "course_code": "FISI2026",
    "prerrequisites": ["ISIS1204", "ISIS1204", "ISIS1204"]
  }
]
```

* *POST api/optimize*

Cuando el cliente quiere realizar el proceso de optimización. El JSON del POST tendrá el siguiente formato:

```json
{
  "firstProgram": "ISIS",
  "secondProgram": "FISI",
  "option": "BIOL",
  "coursesTaken": ["ISIS1001", "MATE1002", "DERE1300"],
  "minCredits": 17,
  "maxCredits": 25
}
```

El return del post es:

```json
{
  "numSemesters": 11,
  "semesters": [
    {
      "num": 1,
      "courses": [
        "CBUA0002",
        "CLES0002",
        "FISI1018",
        "FISI1019",
        "FISI2029",
        "ISIS1001",
        "ISIS1002",
        "ISIS1204",
        "LENG1501",
        "LENG2999",
        "LENG3999",
        "MATE1203"
      ],
      "credits": [
        3,
        3,
        3,
        1,
        1,
        3,
        0,
        3,
        0,
        0,
        0,
        3
      ],
      "courses_names": [
        "CBU A 2",
        "CLE 2",
        "FISICA I",
        "FISICA EXPERIMENTAL I",
        "LABORATORIO MÉTODOS COMPUTACIONALES",
        "INTROD. INGENIERIA DE SISTEMAS",
        "ACOMPAÌÔAMIENTO ISIS",
        "ALGORITMICA Y PROGR. OBJ. I",
        "REQUISITO DE ESPAÑOL",
        "REQUISITO DE LECTURA EN INGLES",
        "REQUISITO DOMINIO DE LENGUA EXTRANJERA",
        "CALCULO DIFERENCIAL"
      ]
    },
    {
      "num": 2,
      "courses": [
        "CBUA0001",
        "FISI1002",
        "FISI1028",
        "FISI1029",
        "FISI2026",
        "ISIS1205",
        "MATE1105",
        "MATE1214",
        "QUIM1101"
      ],
      "credits": [
        3,
        1,
        3,
        1,
        1,
        3,
        3,
        3,
        3
      ],
      "courses_names": [
        "CBU A 1",
        "INTRODUCCION A FISICA",
        "FISICA II (INGLES)",
        "FISICA EXPERIMENTAL II",
        "HERRAMIENTAS COMPUTACIONALES",
        "ALGORITMICA Y PROGR. OBJ. II",
        "ALGEBRA LINEAL 1",
        "CALCULO INTEGRAL-ECUAC.DIFEREN",
        "QUIMICA GENERAL"
      ]
    },
    {
      "num": 3,
      "courses": [
        "CBUB0001",
        "CBUB0002",
        "FISI1003",
        "FISI1038",
        "FISI1039",
        "ISIS1206",
        "ISIS1404",
        "MATE1207"
      ],
      "credits": [
        3,
        3,
        1,
        3,
        1,
        3,
        3,
        3
      ],
      "courses_names": [
        "CBU B 1",
        "CBU B 2",
        "COLOQUIO 1 DE FISICA",
        "ONDAS Y FLUIDOS",
        "LABORATORIO DE ONDAS Y FLUIDOS",
        "ESTRUCTURAS DE DATOS",
        "TI EN LAS ORGANIZACIONES",
        "CALCULO VECTORIAL"
      ]
    }
  ]
}
```

*GET api/cleaning/requisites?program1=FISI&program2=ISIS*

Obtiene lista de correquisitos y prerequisitos de los cursos de ambos programas academicos

```json
[
  {
    "course_code": "FISI4042",
    "prerequisites": [
      "FISI330",
      "FISI340"
    ],
    "corequisites": []
  },
  {
    "course_code": "FISI3801",
    "prerequisites": [
      "FISI330"
    ],
    "corequisites": []
  },
  {
    "course_code": "ISIS1304",
    "prerequisites": [
      "ISIS1205"
    ],
    "corequisites": []
  }
]
```

* *GET api/cleaning/prerequisites?program1=FISI&program2=ISIS*

En caso de solo querer prerequisitos.

* *GET api/cleaning/corequisites?program1=FISI&program2=ISIS*

En caso de solo querer corequisitos.
