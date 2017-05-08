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

    var maxCreditsFirstSemester = 20.5;
    var maxSemesters = 30;
    var optimizerPath = "C:\\Users\\MariaCamila\\Desktop\\";
    //var optimizerPath = "C:\\";
    var optimizerFilename = "optimizador.gms";
    var resultsFilename = "resultados.txt";

    //waits until file exists 30s max in 500ms intervals
    var timeout_current = 0;
    var timeout_delta = 500;
    var timeout_max = 1000*30;

    // CREATE ADJACENCY MATRIX
    //var coursesCredits = getCoursesCredits(totalCourses);
    //var adjacencyMatrix = createAdjacencyMatrix(totalCourses);
    var totalCourses = [];
    var coursesCredits = [];

    var http = require('http');
    http.get({
        host: '127.0.0.1',
        port: '8080',
        path: "/api/merge/correcto?program1="+firstProgram+"&program2="+secondProgram
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
          body += d;
        });
        response.on('end', function() {
          // Data reception is done, do whatever with it!
          var parsed = JSON.parse(body);

          var i;
          var course = {};
          for (i = 0; i < parsed.length; i++) {
            course = parsed[i];
            totalCourses.push(course.course_code);
            coursesCredits.push(course.credits);
          }
          var numTotalCourses = totalCourses.length;

          //Make strings for GAMS
          var materias_i = ""; // ISIS1001, ISIS1002, ISIS1003, FISI1002, MATE1001, MATE1002
          var creditos_materias_i = "";// ISIS1001 3, ISIS1002 3, ISIS1003 3, FISI1002 3, MATE1001 3, MATE1002 3
          var header_requisitos = "          ";// ISIS1001 ISIS1002 ISIS1003 FISI1002 MATE1001 MATE1002
          for (i = 0; i < numTotalCourses - 1; i++) {
            materias_i += totalCourses[i] + ", ";
            creditos_materias_i += totalCourses[i] + " " + coursesCredits[i] + ", ";
            header_requisitos += totalCourses[i] + " ";
          }
          materias_i += totalCourses[numTotalCourses - 1];
          creditos_materias_i += totalCourses[numTotalCourses - 1] + " " + coursesCredits[numTotalCourses - 1];
          header_requisitos += totalCourses[numTotalCourses - 1] + " ";

          //Get prerrequisites info
          http.get({
              host: '127.0.0.1',
              port: '8080',
              path: "/api/cleaning/requisites?program1="+firstProgram+"&program2="+secondProgram
          }, function(response2) {

            var body2 = '';
            response2.on('data', function(d2) {
              body2 += d2;
            });
            response2.on('end', function() {
              var prerrequisites = JSON.parse(body2);
              var prerrequisite = {};
              var coursesDict = {};
              var courses1 = []; var courses1Correq = [];
              var course2 = "";
              var coursesDictCorreq = {};
              var i;

              for (i = 0; i < prerrequisites.length; i++) {
                prerrequisite = prerrequisites[i];
                course2 = prerrequisite.course_code;
                courses1 = prerrequisite.prerequisites;
                courses1Correq = prerrequisite.corequisites;

                coursesDict[course2] = courses1;
                coursesDictCorreq[course2] = courses1Correq;
              }

              var prerrequisitesMatrix = [];
              var correquisitesMatrix = [];
              var lineZeros = new Array(numTotalCourses+1).join('0').split('');
              var lineZeros2 = [];
              var j; var indexCourses1 = -1;
              for (i = 0; i < numTotalCourses; i++) {
                course2 = totalCourses[i];
                courses1 = coursesDict[course2];
                courses1Correq = coursesDictCorreq[course2];

                if(courses1){
                  lineZeros2 = [];
                  for (j = 0; j < numTotalCourses; j++) {
                    indexCourses1 = courses1.indexOf(totalCourses[j]);
                    if (indexCourses1 > -1){
                      lineZeros2.push("1");
                    }
                    else{
                      lineZeros2.push("0");
                    }
                  }
                  prerrequisitesMatrix.push(lineZeros2);
                }
                else {
                  prerrequisitesMatrix.push(lineZeros);
                }

                if(courses1Correq){
                  lineZeros2 = [];
                  for (j = 0; j < numTotalCourses; j++) {
                    indexCourses1 = courses1Correq.indexOf(totalCourses[j]);
                    if (indexCourses1 > -1){
                      lineZeros2.push("2");
                    }
                    else{
                      lineZeros2.push("0");
                    }
                  }
                  correquisitesMatrix.push(lineZeros2);
                }
                else {
                  correquisitesMatrix.push(lineZeros);
                }
              }

              // CALL GAMS
              // writeGAMS:
              var stream = fs.createWriteStream(optimizerPath+optimizerFilename);
              stream.once('open', function(fd) {
                stream.write("$Set NUM_MAX_CREDITOS "+maxCredits+"\n");
                stream.write("$Set NUM_MAX_CREDITOS_PRIM "+maxCreditsFirstSemester+"\n");
              	stream.write("$Set NUM_MAX_SEMESTRES "+maxSemesters+"\n");
              	stream.write("Sets\n");
              	//stream.write("materias_i   materias por codigo / ISIS1001, ISIS1002, ISIS1003, FISI1002, MATE1001, MATE1002 /\n");
                stream.write("materias_i   materias por codigo / " + materias_i + " /\n");
              	stream.write("semestres_j  semestres /s1*s%NUM_MAX_SEMESTRES% /\n");
              	stream.write("alias(materias_i, materias_k)\n");
              	stream.write("alias(semestres_j, semestres_l)\n");
              	stream.write("Table requisitos(materias_i, materias_k) vale 0 si no hay req 1 si hay pre de i a j y 2 si es correq\n");

                stream.write(header_requisitos+"\n");
                var j = 0; var k = 0;
                var numSpaces = 0;
                var lineToWrite = "";
                for (i = 0; i < numTotalCourses; i++) {
                  if (totalCourses[i].length == 8){
                    lineToWrite += totalCourses[i]+"  ";
                  }
                  else{
                    lineToWrite += totalCourses[i]+" ";
                  }

                  for (j = 0; j < numTotalCourses; j++) {
                    numSpaces = totalCourses[j].length;
                    if (prerrequisitesMatrix[i][j] == 1){
                      lineToWrite += prerrequisitesMatrix[i][j];
                    }
                    else{
                      lineToWrite += correquisitesMatrix[i][j];
                    }

                    for (k = 0; k < numSpaces; k++){
                      lineToWrite += " ";
                    }
                  }
                  stream.write(lineToWrite+"\n");
                  lineToWrite = "";
                }

                //stream.write("ISIS1001 ISIS1002 ISIS1003 FISI1002 MATE1001 MATE1002\n");
              	// stream.write("ISIS1001 0        0        0        0        0        0\n");
              	// stream.write("ISIS1002 1        0        0        0        0        0\n");
              	// stream.write("ISIS1003 0        1        0        0        0        0\n");
              	// stream.write("FISI1002 0        0        0        0        1        0\n");
              	// stream.write("MATE1001 0        0        0        0        0        0\n");
              	// stream.write("MATE1002 0        0        0        0        1        0\n");

              	stream.write("Parameter creditos(materias_i) num de creditos de cada materia / " + creditos_materias_i + " /;\n");
              	stream.write("Variables\n");
              	stream.write("x(materias_i, semestres_j)        vale 1 si veo la materia_i en el semestre_j\n");
              	stream.write("n                                 numero minimo de semestres;\n");
              	stream.write("Binary Variable x;\n");
              	stream.write("Equations\n");
              	stream.write("funcion_objetivo                                         funcion objetivo\n");
              	stream.write("no_repitis_materia(materias_i)                           una materia se aprueba solo una vez\n");
              	stream.write("creditos_maximos(semestres_j)                            numero maximo de creditos al semestre\n");
                stream.write("creditos_maximos_prim(semestres_j)                       numero maximo de creditos en primer semestre  \n");
                stream.write("correquisitos(materias_i, materias_k, semestres_j)       coreqs se deben cumplir\n");
              	stream.write("prerrequisitos(materias_i, materias_k, semestres_j)      prereqs se deben cumplir\n");
              	stream.write("prerrequisitos_prim(materias_i, materias_k, semestres_j) no se puede ver una materia que tenga prerequisito en primer semestre;\n");
              	stream.write("funcion_objetivo                                 ..      n =E= sum((semestres_j), (sum((materias_i), x(materias_i, semestres_j)))*power(ord(semestres_j),5) );\n");
              	stream.write("no_repitis_materia(materias_i)                   ..      sum( (semestres_j), x(materias_i, semestres_j) ) =E= 1;\n");
                stream.write("creditos_maximos(semestres_j)$(ord(semestres_j) ge 2)                    ..      sum( (materias_i), x(materias_i, semestres_j)*creditos(materias_i) ) =L= %NUM_MAX_CREDITOS%;\n");
              	stream.write("creditos_maximos_prim(semestres_j)$(ord(semestres_j) eq 1)               ..      sum( (materias_i), x(materias_i, semestres_j)*creditos(materias_i) ) =L= %NUM_MAX_CREDITOS_PRIM%;\n");
                stream.write("correquisitos(materias_i, materias_k, semestres_j)$(requisitos(materias_i, materias_k) eq 2)                                  ..      sum( semestres_l$(ord(semestres_l) ge 1 and ord(semestres_l) le ord(semestres_j)), x(materias_i, semestres_l)) =L= sum( semestres_l$(ord(semestres_l) ge 1 and ord(semestres_l) le ord(semestres_j)), x(materias_k, semestres_l) );\n");
              	stream.write("prerrequisitos(materias_i, materias_k, semestres_j)$(requisitos(materias_i, materias_k) eq 1 and ord(semestres_j) ge 2)       ..      sum( semestres_l$(ord(semestres_l) ge 2 and ord(semestres_l) le ord(semestres_j)), x(materias_i, semestres_l)) =L= sum( semestres_l$(ord(semestres_l) ge 1 and ord(semestres_l) le ord(semestres_j)-1), x(materias_k, semestres_l) );\n");
              	stream.write("prerrequisitos_prim(materias_i, materias_k, semestres_j)$(requisitos(materias_i, materias_k) eq 1 and ord(semestres_j) eq 1)  ..      x(materias_i, semestres_j) =E= 0;\n");
              	stream.write("Model modelo /all/ ;\n");
              	stream.write("option mip=CBC;\n");
              	stream.write("Solve modelo using mip minimizing n;\n");
              	stream.write("file GAMSresults /"+optimizerPath+resultsFilename+"/;\n");
              	stream.write("put GAMSresults;\n");
              	stream.write("loop((materias_i,semestres_j)$(x.l(materias_i, semestres_j) eq 1), put materias_i.tl, @12, semestres_j.tl, @18, creditos(materias_i) /);\n");

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
                var credits = [];
                var sem = ""; var cred = "";
                var n = 0; var c=0;
                var numSemesters = 0;

                for (i = 0; i < lines.length-1; i++) { //-1 because the results has a \n at the end
                  line = lines[i];
                  line_elements = line.split(" ");
                  line_elements_length = line_elements.length;

                  //TODO: arreglar estos indices (que el output de gams este separado solo por un espacio)
                  //console.log(line_elements);
                  //console.log(line_elements_length);
                  sem = line_elements[3];
                  n = parseInt(sem.split("s")[1]);
                  cred = line_elements[15-(sem.length-2)];
                  c = parseInt(cred.split("\r")[0]);

                  courses.push(line_elements[0]);
                  semesters.push(n);
                  credits.push(c);

                  if (n >= numSemesters){
                    numSemesters = n;
                  }
                }

                // TRANSFORM RESULTS TO RESPONSE
                var response = {};
                response.numSemesters = numSemesters;

                var responseSemesters = [];
                var semesterCourses = [];
                var semesterCredits = [];
                var sem = {};
                var j = 0;
                for (i = 0; i < numSemesters; i++) {
                  sem.num = i+1;

                  for (j = 0; j < courses.length; j++) {
                    if (semesters[j] == i+1){
                      semesterCourses.push(courses[j]);
                      semesterCredits.push(credits[j]);
                    }
                  }
                  sem.courses = semesterCourses;
                  sem.credits = semesterCredits;

                  semesterCourses = [];
                  semesterCredits = [];

                  responseSemesters.push(sem);
                  sem = {};
                }

                response.semesters = responseSemesters;

                // send it to the Angular interface
                res.json(response);
              });

              execution.on('exit', function (code) {
                 console.log('Child process exited with exit code '+code);
              });
            });
          });
        });
    });
})

module.exports = router;
