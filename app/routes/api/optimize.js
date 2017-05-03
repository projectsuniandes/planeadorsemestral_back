"use strict";

var express = require('express');
var users   = require('../../../data').users;
var config  = require('../../../config');

// create a new Router
var router = express.Router();

// on routes that end in /optimization
// ----------------------------------------------------
router.route('/')

// recieve optimization request from client
.post(function(req, res) {

    // GET JSON ATTRIBUTES
    // recieve preferences that will become restrictions
    // format those restrictions if necessary
    var jsonData = req.body;

    var firstProgram = jsonData.firstProgram;
    var secondProgram = jsonData.secondProgram;
    var option = jsonData.option;
    var coursesTaken = jsonData.coursesTaken;
    var minCredits = jsonData.minCredits;
    var maxCredits = jsonData.maxCredits;

    var maxSemesters = 20;
    var optimizerPath = "C:\\Users\\MariaCamila\\Desktop\\";
    var optimizerFilename = "optimizador.gms";
    var resultsFilename = "resultados.txt";

    // CREATE ADJACENCY MATRIX
    var totalCourses = mergeCourses(firstProgram, secondProgram, option, coursesTaken);
    var coursesCredits = getCoursesCredits(totalCourses);
    var adjacencyMatrix = createAdjacencyMatrix(totalCourses); //call merge to get them

    // CALL GAMS
    writeGAMS(minCredits, maxCredits, maxSemesters, totalCourses, coursesCredits, adjacencyMatrix, optimizerPath, optimizerFilename, resultsFilename);
	  executeGAMS(optimizerPath, optimizerFilename);
	  var results = readGAMSResults(optimizerPath, resultsFilename);

    // TRANSFORM RESULTS TO RESPONSE
    var courses = results.courses;
    var semesters = results.semesters;
    var num_semesters = results.numSemesters;

    var response = {};
    var n = 0;
    var i = 0;
    for (i = 0; i < numSemesters; i++) {
      n = i+1;
      response["semester"+n] = [];
    }

    var c = "";
    var s = 0;
    var sem = []
    for (i = 0; i < courses.length; i++) {
      c = courses[i];
      s = semesters[i];
      sem = response["semester"+s];
      sem.push(c);
      response["semester"+s] = sem;
    }

    // send it to the Angular interface
    res.json(response);
})

// functions

writeGAMS(function(minCredits, maxCredits, maxSemesters, totalCourses, coursesCredits, adjacencyMatrix, optimizerPath, optimizerFilename, resultsFilename) {
  import System.IO;

  var sw : StreamWriter = new StreamWriter(optimizerPath+optimizerFilename);

  sw.WriteLine("$Set NUM_MAX_CREDITOS "+ maxCredits);
	sw.WriteLine("$Set NUM_MAX_SEMESTRES "+ maxSemesters);
	sw.WriteLine("Sets");
	sw.WriteLine("materias_i   materias por codigo / ISIS1001, ISIS1002, ISIS1003, FISI1002, MATE1001, MATE1002 /");
	sw.WriteLine("semestres_j  semestres /s1*s%NUM_MAX_SEMESTRES% /");
	sw.WriteLine("alias(materias_i, materias_k)");
	sw.WriteLine("alias(semestres_j, semestres_l)");
	sw.WriteLine("Table requisitos(materias_i, materias_k) vale 0 si no hay req 1 si hay pre de i a j y 2 si es correq");

	//Matriz
	sw.WriteLine("         ISIS1001 ISIS1002 ISIS1003 FISI1002 MATE1001 MATE1002");
	sw.WriteLine("ISIS1001 0        0        0        0        0        0");
	sw.WriteLine("ISIS1002 1        0        0        0        0        0");
	sw.WriteLine("ISIS1003 0        1        0        0        0        0");
	sw.WriteLine("FISI1002 0        0        0        0        1        0");
	sw.WriteLine("MATE1001 0        0        0        0        0        0");
	sw.WriteLine("MATE1002 0        0        0        0        1        0");

	sw.WriteLine("Parameter creditos(materias_i) num de creditos de cada materia / ISIS1001 3, ISIS1002 3, ISIS1003 3, FISI1002 3, MATE1001 3, MATE1002 3 /;");
	sw.WriteLine("Variables");
	sw.WriteLine("x(materias_i, semestres_j)        vale 1 si veo la materia_i en el semestre_j");
	sw.WriteLine("n                                 numero minimo de semestres;");
	sw.WriteLine("Binary Variable x;");
	sw.WriteLine("Equations");
	sw.WriteLine("funcion_objetivo                                         funcion objetivo");
	sw.WriteLine("no_repitis_materia(materias_i)                           una materia se aprueba solo una vez");
	sw.WriteLine("creditos_maximos(semestres_j)                            numero maximo de creditos al semestres");
	sw.WriteLine("prerrequisitos(materias_i, materias_k, semestres_j)      prereqs se deben cumplir");
	sw.WriteLine("prerrequisitos_prim(materias_i, materias_k, semestres_j) no se puede ver una materia que tenga prerequisito en primer semestre;");
	sw.WriteLine("funcion_objetivo                                 ..      n =E= sum((semestres_j), (sum((materias_i), x(materias_i, semestres_j)))*power(ord(semestres_j),5) );");
	sw.WriteLine("no_repitis_materia(materias_i)                   ..      sum( (semestres_j), x(materias_i, semestres_j) ) =E= 1;");
	sw.WriteLine("creditos_maximos(semestres_j)                    ..      sum( (materias_i), x(materias_i, semestres_j)*creditos(materias_i) ) =L= %NUM_MAX_CREDITOS%;");
	sw.WriteLine("prerrequisitos(materias_i, materias_k, semestres_j)$(requisitos(materias_i, materias_k) eq 1 and ord(semestres_j) ge 2)       ..      sum( semestres_l$(ord(semestres_l) ge 2 and ord(semestres_l) le ord(semestres_j)), x(materias_i, semestres_l)) =E= sum( semestres_l$(ord(semestres_l) ge 1 and ord(semestres_l) le ord(semestres_j)-1), x(materias_k, semestres_l) );");
	sw.WriteLine("prerrequisitos_prim(materias_i, materias_k, semestres_j)$(requisitos(materias_i, materias_k) eq 1 and ord(semestres_j) eq 1)  ..      x(materias_i, semestres_j) =E= 0;");
	sw.WriteLine("Model modelo /all/ ;");
	sw.WriteLine("option mip=CBC;");
	sw.WriteLine("Solve modelo using mip minimizing n;");
	sw.WriteLine("file GAMSresults /"+optimizerPath+resultsFilename+"/;");
	sw.WriteLine("put GAMSresults;");
	sw.WriteLine("loop((materias_i,semestres_j)$(x.l(materias_i, semestres_j) eq 1), put materias_i.tl, @12, semestres_j.tl /);");

  sw.Flush();
  sw.Close();
})

executeGAMS(function(optimizerPath, optimizerFilename) {

  var exec = require('child_process').exec, child;
  var command = "C:\\GAMS\\win64\\24.0\\gams.exe " + optimizerPath + optimizerFilename + " suppress=1 lo=0 o=nul";

  child = exec(command,
    function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });

  child();
})

readGAMSResults(function(optimizerPath, resultsFilename) {
  import System.IO;

  //wait until file exists
  var timeout_max = 1000*30; //waits 30s max
  var timeout_delta = 500;
  var timeout_current = 0;
	while(!fileExists(optimizerPath+resultsFilename)) {
    //wait in intervals of 500ms
    setTimeout(function() {
      timeout_current += timeout_delta; // Whatever you want to do after the wait
    }, timeout_delta);

    if (timeout_current >= timeout_max) {
      break;
      //TODO notify that it couldn't read the results file because it was not created
    }
	}

  var sr = new File.OpenText(optimizerPath+resultsFilename);

  var line = sr.ReadLine();
  var line_elements = line.split(" ");
  var line_elements_length = line_elements.length;

  var courses = [];
  var semesters = [];
  var sem = "";

  while (line != null) {
    line_elements = line.split(" ");
    line_elements_length = line_elements.length;

    courses.push(line_elements[0]);
    sem = line_elements[line_elements_length - 1];
    semesters.push(sem.split("")[1]);

    line = sr.ReadLine();
  }

  sr.Close();

  var response = {
    "courses": courses,
    "semesters": semesters,
    "num_semesters": Math.max(semesters)
  };

  return response;
})

fileExists(function(filePath) {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  return fso.FileExists(filePath);
});

module.exports = router;
