"use strict";
var express = require('express');
var users   = require('../../../data').users;
var config  = require('../../../config');
var fs = require('fs');

// create a new Router
var router = express.Router();

// on routes that end in /optimize
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

    //waits until file exists 30s max in 500ms intervals
    var timeout_current = 0;
    var timeout_delta = 500;
    var timeout_max = 1000*30;

    // CREATE ADJACENCY MATRIX
    //var totalCourses = mergeCourses(firstProgram, secondProgram, option, coursesTaken);
    //var coursesCredits = getCoursesCredits(totalCourses);
    //var adjacencyMatrix = createAdjacencyMatrix(totalCourses);
    var totalCourses = [];
    var coursesCredits = [];
    var adjacencyMatrix = [];

    // CALL GAMS
    // writeGAMS:
    var stream = fs.createWriteStream(optimizerPath+optimizerFilename);
    stream.once('open', function(fd) {

      stream.write("$Set NUM_MAX_CREDITOS "+maxCredits+"\n");
    	stream.write("$Set NUM_MAX_SEMESTRES "+maxSemesters+"\n");
    	stream.write("Sets\n");
    	stream.write("materias_i   materias por codigo / ISIS1001, ISIS1002, ISIS1003, FISI1002, MATE1001, MATE1002 /\n");
    	stream.write("semestres_j  semestres /s1*s%NUM_MAX_SEMESTRES% /\n");
    	stream.write("alias(materias_i, materias_k)\n");
    	stream.write("alias(semestres_j, semestres_l)\n");
    	stream.write("Table requisitos(materias_i, materias_k) vale 0 si no hay req 1 si hay pre de i a j y 2 si es correq\n");

    	//Matriz
    	stream.write("         ISIS1001 ISIS1002 ISIS1003 FISI1002 MATE1001 MATE1002\n");
    	stream.write("ISIS1001 0        0        0        0        0        0\n");
    	stream.write("ISIS1002 1        0        0        0        0        0\n");
    	stream.write("ISIS1003 0        1        0        0        0        0\n");
    	stream.write("FISI1002 0        0        0        0        1        0\n");
    	stream.write("MATE1001 0        0        0        0        0        0\n");
    	stream.write("MATE1002 0        0        0        0        1        0\n");

    	stream.write("Parameter creditos(materias_i) num de creditos de cada materia / ISIS1001 3, ISIS1002 3, ISIS1003 3, FISI1002 3, MATE1001 3, MATE1002 3 /;\n");
    	stream.write("Variables\n");
    	stream.write("x(materias_i, semestres_j)        vale 1 si veo la materia_i en el semestre_j\n");
    	stream.write("n                                 numero minimo de semestres;\n");
    	stream.write("Binary Variable x;\n");
    	stream.write("Equations\n");
    	stream.write("funcion_objetivo                                         funcion objetivo\n");
    	stream.write("no_repitis_materia(materias_i)                           una materia se aprueba solo una vez\n");
    	stream.write("creditos_maximos(semestres_j)                            numero maximo de creditos al semestres\n");
    	stream.write("prerrequisitos(materias_i, materias_k, semestres_j)      prereqs se deben cumplir\n");
    	stream.write("prerrequisitos_prim(materias_i, materias_k, semestres_j) no se puede ver una materia que tenga prerequisito en primer semestre;\n");
    	stream.write("funcion_objetivo                                 ..      n =E= sum((semestres_j), (sum((materias_i), x(materias_i, semestres_j)))*power(ord(semestres_j),5) );\n");
    	stream.write("no_repitis_materia(materias_i)                   ..      sum( (semestres_j), x(materias_i, semestres_j) ) =E= 1;\n");
    	stream.write("creditos_maximos(semestres_j)                    ..      sum( (materias_i), x(materias_i, semestres_j)*creditos(materias_i) ) =L= %NUM_MAX_CREDITOS%;\n");
    	stream.write("prerrequisitos(materias_i, materias_k, semestres_j)$(requisitos(materias_i, materias_k) eq 1 and ord(semestres_j) ge 2)       ..      sum( semestres_l$(ord(semestres_l) ge 2 and ord(semestres_l) le ord(semestres_j)), x(materias_i, semestres_l)) =E= sum( semestres_l$(ord(semestres_l) ge 1 and ord(semestres_l) le ord(semestres_j)-1), x(materias_k, semestres_l) );\n");
    	stream.write("prerrequisitos_prim(materias_i, materias_k, semestres_j)$(requisitos(materias_i, materias_k) eq 1 and ord(semestres_j) eq 1)  ..      x(materias_i, semestres_j) =E= 0;\n");
    	stream.write("Model modelo /all/ ;\n");
    	stream.write("option mip=CBC;\n");
    	stream.write("Solve modelo using mip minimizing n;\n");
    	stream.write("file GAMSresults /"+optimizerPath+resultsFilename+"/;\n");
    	stream.write("put GAMSresults;\n");
    	stream.write("loop((materias_i,semestres_j)$(x.l(materias_i, semestres_j) eq 1), put materias_i.tl, @12, semestres_j.tl /);\n");

      stream.end();
    });

    var command = "C:\\GAMS\\win64\\24.0\\gams.exe " + optimizerPath + optimizerFilename + " suppress=1 lo=0 o=nul";

    var child_process = require('child_process');
    var execution = child_process.exec(command, function (error, stdout, stderr) {
      if (error) {
         console.log(error.stack);
         console.log('Error code: '+error.code);
         console.log('Signal received: '+error.signal);
         console.log('stdout: ' + stdout);
         console.log('stderr: ' + stderr);
      }

      // readGAMSResults:
      var fileResultsExists = fs.existsSync(optimizerPath+resultsFilename);
      timeout_current = 0;
      while(!fileResultsExists) {
        //wait in intervals of 500ms
        var waitTill = new Date(new Date().getTime() + timeout_delta);
        while(waitTill > new Date()){
          //wait
        }

        timeout_current += timeout_delta;
        if (timeout_current >= timeout_max) {
          break;
        }

        fileResultsExists = fs.existsSync(optimizerPath+optimizerFilename);
      }

      var text = fs.readFileSync(optimizerPath+resultsFilename,'utf8');
      var lines = text.split("\n");

      var line = lines[0];
      var line_elements = line.split(" ");
      var line_elements_length = line_elements.length;

      var courses = [];
      var semesters = [];
      var sem = "";
      var n = 0;
      var numSemesters = 0;

      var i = 0;
      for (i = 0; i < lines.length-1; i++) { //-1 because the results has a \n at the end
        line = lines[i];
        line_elements = line.split(" ");
        line_elements_length = line_elements.length;

        courses.push(line_elements[0]);
        sem = line_elements[line_elements_length - 1];

        n = parseInt(sem.split("")[1]);
        semesters.push(n);

        if (n >= numSemesters){
          numSemesters = n;
        }
      }

      // TRANSFORM RESULTS TO RESPONSE
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
    });

    // execution.on('exit', function (code) {
    //   console.log('Child process exited with exit code '+code);
    // });
})

module.exports = router;
