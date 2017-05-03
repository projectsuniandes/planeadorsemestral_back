var config     = require('./config');
var path       = require('path');
var pg         = require('pg');
var query      = require('pg-query');

// process for building and returning a matrix

// 1. given the restrictions, identify all the classes that the matrix should consider. For this it should know which classes the user has already seen and take those out
// 2. save such classes into an array or any other type of Data Structure.
// 3. Traverse through all such classes and for each one identify its correqusities, prerequisites.
// 4. build matrix as a string, considering codes like ISIS1001, not ISIS 1001 (with the space in between)




var matrix_Builder = {}


function getProgramId() {

}

// gets DB id and uni code in order to build the matrix
function getCoursesInProgram() {

}

function getPrerequisitesOfCourse(){

}

function getCorequisitesOfCourse(){

}




matrix_Builder.getCourseMatrix = function(){
// in here we call the functions of this module.

}

module.exports = matrix_Builder;
