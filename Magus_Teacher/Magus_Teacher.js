//Cadenas de conexión con la API
let spreadsheetId = '1ZP7CV62b-xUMhna4JfBgJC8UkXJCl9GfrexKFh4BfKA';
let apikey = 'AIzaSyAgebuGDMcuSoaxY5khfYeQpsX3SlzTGB8';
let discoveryDocs = [];
discoveryDocs.push('https://sheets.googleapis.com/$discovery/rest?version=v4');

//Información auxiliar para el disujo
let myWidth = 1366;
let myHeight = 1000;
let scl;
let statusBar = "";
let maxGroupNameWidth = 0;

//Información cargada
let course;
let student;

//Imagenes
let mockupImage;
let backgroundImage;
let headerImage;
let statsBackgroundImage;
let cutBanner;
let cutBackground;
let shield = [];

//Tipografías
let mainFont;
let secondaryFont;

//Paleta de colores
let mainColor = '#993300';
let highlightColor = '#F1BD22';
let ligthColor = '#FFFFE8';
let grayColor = '#A0A0A0';
let darkColor = '#142624';

function preload() {
  //  mainFont = loadFont('assets/TimesBold.ttf');
  //  secondaryFont = loadFont('assets/GothamBook.ttf');
  //  mockupImage = loadImage('assets/mockup.png');
  //  backgroundImage = loadImage('assets/background.png');
  //  headerImage = loadImage('assets/header.png');
  //  statsBackground = loadImage('assets/statsBackground.png');
  //  cutBanner = loadImage('assets/cutBanner.png');
  //  cutBackground = loadImage('assets/cutBackground.png');
  //  bronzeShield0 = loadImage('assets/bronzeShield0.png');
  //  bronzeShield1 = loadImage('assets/bronzeShield1.png');
  //  bronzeShield2 = loadImage('assets/bronzeShield2.png');
  //  silverShield3 = loadImage('assets/silverShield3.png');
  //  goldShield4 = loadImage('assets/goldShield4.png');
  //  diamondShield5 = loadImage('assets/diamondShield5.png');
}


function setup() {
  //  updateScale();
  //  createCanvas(windowWidth, myHeight*scl);
}


function draw() {
  //  scale(scl);
  //  smooth();
  //  background(255, 255, 200);

  //  imageMode(CORNER);

  //  image(mockupImage, 0, 0);
  //  image(backgroundImage, 0, 0);

  //  drawHeader();
  //  drawStats();
  //  drawCut(1, 372, 180);
  //  drawCut(2, 372, 454);
  //  drawCut(3, 372, 728);

  displayStatusBar();
}

//function drawHeader() {
//  image(headerImage, 0, 0);
//  textAlign(LEFT, BASELINE);
//  noStroke();
//  textFont(mainFont);
//  textSize(40);
//  fill(darkColor);
//  text(className, 40, 67);
//  let xSem = 40+textWidth(className);
//  textSize(25);
//  text(' / '+semester, xSem, 67);
//  if (theDude) {
//    textFont(secondaryFont);
//    textSize(24);
//    text(theDude.Nombres+' '+theDude.Apellidos, 40, 96);
//    textSize(16);
//    text(theDude.Id, 40, 115);
//  }
//}

//function drawStats() {

//  //Dibuja la insignia

//  image(statsBackground, 40, 180);
//  if (theDude) {

//    let grade = float(theDude['Nota Final'].replace(',', '.'));
//    let shield = getShield(grade);
//    image(shield, 64, 230, shield.width*0.5, shield.height*0.5);
//    textFont(mainFont);
//    textSize(30);
//    textAlign(CENTER, BASELINE);
//    text(grade.toFixed(1), 186, 405); // 405

//    // Indicador de progreso del escudo
//    stroke(getGradeColor(grade));
//    strokeWeight(3);
//    noFill();
//    let sAng = 150;
//    let maxAng = 390;
//    let angs = maxAng-sAng;
//    let per = grade/5.0;
//    arc(186, 400-5, 82, 82, radians(sAng), radians(sAng + (angs*per)));
//  }
//}

//function drawCut(cut, x, y) {

//  image(cutBanner, x, y);
//  image(cutBackground, x+194, y);
//  textAlign(CENTER, BASELINE);
//  textFont(mainFont);
//  textSize(30);
//  noStroke();
//  fill(ligthColor);
//  text('Corte '+cut, x+88, y+60);

//  if (theDude) {
//    let cutGrade = float(theDude['Corte '+cut].replace(',', '.'));
//    textSize(50);
//    text(cutGrade.toFixed(1), x+88, y+118);
//    textFont(secondaryFont);
//    textSize(20);

//    //Cargar desde el meta del archivo
//    let per = "30%";
//    if (cut == 3) {
//      per = "40%";
//    }

//    text(per, x+88, y+158);

//    drawGroup(cut, 1, x+216, y+20);
//    drawGroup(cut, 2, x+216, y+88);
//    drawGroup(cut, 3, x+216, y+156);
//  }
//}

//function drawGroup(cut, group, x, y) {
//  fill(darkColor);
//  noStroke();
//  textAlign(LEFT, BASELINE);
//  textSize(30);
//  text(theDude.promedioGrupo[cut-1][group-1].nota.replace(',', '.'), x, y+26);
//  let groupName = theDude.promedioGrupo[cut-1][group-1].nombre;
//  text(groupName, x+64, y+26);

//  let groupNameWidth = textWidth(groupName);
//  if (groupNameWidth > maxGroupNameWidth) {
//    maxGroupNameWidth = groupNameWidth;
//  }

//  textSize(20);
//  text(theDude.promedioGrupo[cut-1][group-1].porcentaje, x+64, y+54);

//  stroke(0);
//  strokeWeight(1);
//  noFill();

//  let firstX = x + 64 + maxGroupNameWidth + 20; 

//  //Dibuja cada cuadro de nota
//  let notes = theDude.notas[cut-1][group-1].length;
//  for (let n = 0; n < notes; n++) {

//    //Muestra la nota
//    noStroke();
//    fill(darkColor);
//    textAlign(CENTER, BASELINE);
//    textSize(14);
//    let note = float(theDude.notas[cut-1][group-1][n].nota.replace(',', '.'));
//    text(note.toFixed(1), firstX + 20, y + 54);

//    //Prepara la caja de mostrar
//    rectMode(CENTER);
//    noFill();
//    stroke(0, 8);
//    let wid = 5;
//    for (let i = wid; i > 0; i--) {
//      strokeWeight(wid-i);
//      rect(firstX + 20, y + 20, 40-wid+i, 40-wid+i, 3);
//    }
//    noStroke();
//    fill(0, 16);
//    rectMode(CORNER);
//    rect(firstX, y, 40, 40, 3);

//    //Rellena la caja
//    let per = note/5;
//    let alt = 40*per;
//    let gradeY = y + 40 - alt;
//    if (note >= 3) {
//      fill(mainColor);
//    } else {
//      fill(highlightColor);//194, 133, 102);
//    }
//    noStroke();
//    rect(firstX, gradeY, 40, alt, 3);

//    /* strokeWeight(1);
//     stroke(highlightColor);
//     line(firstX-3, y + 40 - (40*0.6), firstX+43, y + 40 - (40*0.6));
//     */
//    //Ilumina la caja seleccionada
//    if (mouseX >= firstX && mouseX <= firstX+40 && mouseY >= y && mouseY <= y + 40) {
//      strokeWeight(1);
//      stroke(highlightColor);
//      noFill();
//      rect(firstX, y, 40, 40, 3);
//    }

//    firstX += 45;
//  }
//}

//function getShield(val) {

//  if (val < 1) {
//    return bronzeShield0;
//  } else if (val < 1) {
//    return bronzeShield1;
//  } else if (val < 3) {
//    return bronzeShield2;
//  } else if (val < 4) {
//    return silverShield3;
//  } else if (val < 5) {
//    return goldShield4;
//  } else if (val >= 5) {
//    return diamondShield5;
//  }
//  return bronzeShield0;
//}

//function getGradeColor(val) {

//  if (val < 3) {
//    return '#D00000';
//  } else if (val < 4) {
//    return '#FFD000';
//  } else if (val < 5) {
//    return '#00D000';
//  } else if (val >= 5) {
//    return '#00D0D0';
//  }
//}


//function windowResized() {
//  updateScale();
//  resizeCanvas(windowWidth, myHeight*scl);
//}

//function updateScale() {
//  scl = windowWidth/myWidth;
//}

function addToStatusBar(message) {
  this.statusBar += message;
}

function displayStatusBar() {
  fill(0);
  noStroke();
  textSize(10);
  textFont(secondaryFont);
  textAlign(RIGHT, BOTTOM);
  text(statusBar, myWidth, myHeight);
}

//////////// Metodos de la API de consulta //////////

function apiLoaded() {
  addToStatusBar('Api cargada!\t|\t');
  gapi.load('client:auth2', initClient);
}

function initClient() {
  addToStatusBar('Cliente cargado!\t|\t');
  gapi.client.init({
    'apiKey': apikey, 
    'discoveryDocs': discoveryDocs,
  }).then(
    function() {
      addToStatusBar('Cliente iniciado!\t|\t');
      loadData();
    }
  );
}

function loadData() { 
  //Define parametros de consulta
  var params = {   
    spreadsheetId: spreadsheetId, // The ID of the spreadsheet to retrieve data from.
    ranges: [
      "Curso!A1:C50",//0
      "Notas!A1:Z1000", //1
      "Ausencias!A1:D100", //2
      "Q&T 1!A1:Z100", //3
      "Taller 1!A1:Z100", //3
      "Parcial 1!A1:Z100", //4
      "Q&T 2!A1:Z100", //5
      "Taller 2!A1:Z100", //6
      "Parcial 2!A1:Z100", //7
      "Q&T 3!A1:Z100", //8
      "Taller 3!A1:Z100", //9
      "Parcial 3!A1:Z100", //10
    ],
  };

  //Ejecuta la consulta
  var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
  request.then(function(response) {
    addToStatusBar('datos cargados!\t|\t');
    dataLoaded(response);
  }, function(reason) {
    addToStatusBar('error: ' + reason.result.error.message+'\t|\t');
  });
}

function dataLoaded(response){
  
  let data = response.result.valueRanges;
  
  createCurse(data[0].values);   //"Curso!A1:C50",//0
  createStudents(data[1].values);//"Notas!A1:Z1000", //1
  /*addActivities(data[2], 1, 1);  //"Q&T 1!A1:Z100", //2
  addActivities(data[3], 1, 2);  //"Taller 1!A1:Z100", //3
  addActivities(data[4], 1, 3);  //"Parcial 1!A1:Z100", //4
  addActivities(data[5], 2, 1);  //"Q&T 2!A1:Z100", //5
  addActivities(data[6], 2, 1);  //"Taller 2!A1:Z100", //6
  addActivities(data[7], 2, 1);  //"Parcial 2!A1:Z100", //7
  addActivities(data[8],  3, 1); //"Q&T 3!A1:Z100", //8
  addActivities(data[9], 3, 1); //"Taller 3!A1:Z100", //9
  addActivities(data[10], 3, 1); //"Parcial 3!A1:Z100", //10
  */
  //Aquí se debe seleccionar el estudiante que inicia sesión
}

function createCurse(data){
  
  let f = 0;
  let name = data[f][0];
  f++;
  let group = data[f][1];
  f++;
  let semester = data[f][1];
  f++;
  let teacher = data[f][1];
  f++;
  let maxAbsences = int(data[f][1]);
  f++;
  let average = float(data[f][1].replace(',','.')).toFixed(1);
  f++;
  let cutsAmount = int(data[f][1]);
  f++;
  
  //Cargar los porcentajes de cada corte 
  
  
  course = new Course(name, group, semester, teacher, maxAbsences, average);
  
}

function createStudents(data){
  
  for(let f = 1; f < data.length; f++){
    
    let id = data[f][0];
    let names = data[f][1];
    let lastnames = data[f][2];
    let email = data[f][3];
    let program = data[f][4];
    
    let grade = float(data[f][8].replace(',', '.')).toFixed(1);
    let target = float(data[f][9].replace(',', '.')).toFixed(1);
    let absences = int(data[f][10]);
    let aStudent = new Student(id, names, lastnames, email, program, grade, target, absences);
    
    for(let c = 0; c < course.cuts; c++){
      let name = data[0][c+5];
      let average = data[f][c+5];
      let percentage = course.cutPercentage[c];
      let cut = new Cut(name, average, percentage);
      console.log(cut);
      aStudent.cuts.push(cut);
    }

    course.graph[int(grade)]++;    
    course.students.push(aStudent);
  }
  
  //Arreglar estudiantes por nota de mayor a menor
  course.students.sort((a, b) => (a.grade < b.grade) ? 1 : -1);
  for(let i = 0; i < course.students.length; i++){
    course.students[i].position = i+1;
  }
  course.students.sort((a, b) => (a.lastnames+' '+a.names > b.lastnames+' '+b.names) ? 1 : -1);
  
}

//  function(response) {

//  crearEstudiantes(response.result.valueRanges[0].values);
//  agregarAusencias(response.result.valueRanges[1].values);

//  for (let corte = 0; corte < 3; corte++) {
//    for (let grupo = 0; grupo < 3; grupo++) {
//      let hoja = 2 + ((corte*3) + grupo);
//      agregarGrupoNotas(response.result.valueRanges[hoja].values, corte, grupo);
//    }
//  }
//  statusBar += 'Estudiantes disponibles:'+dudes.length+'!\t|\t';
//  theDude = dudes[(int)(random()*dudes.length)];
//  statusBar += 'Estudiante cargado:'+theDude.Nombres+'!\t|\t';
//}
//, 

//  function(reason) {
//  
//}

//function getDude(id) {
//  for (let d = 0; d < dudes.length; d++) {
//    if (dudes[d].Id == id) {
//      return dudes[d];
//    }
//  }
//}

//
//function crearEstudiantes(estudiantes) { 
//  for (let i = 1; i < estudiantes.length; i++) {
//    dude = {
//    [estudiantes[0][0]]: 
//    estudiantes[i][0],
//  };

//  //Agrega el resto de datos de la primera hoja
//  for (let k = 0; k < estudiantes[i].length; k++) { 
//    dude[''+estudiantes[0][k]] = estudiantes[i][k];      
//    dude.notas = [[[], [], [], ], [[], [], [], ], [[], [], [], ], ];
//    dude.promedioGrupo = [[], [], [], ];
//  }
//  dudes.push(dude);
//}
//}


//function agregarGrupoNotas(notas, corte, grupo) {

//  let nom = 'Tareas';//Cargar desde el meta
//  let por = '5%';
//  if (grupo == 1) {
//    nom = 'Taller';
//  } else if (grupo == 2) {
//    nom = 'Examen';
//    por = '20%';
//  }

//  if (corte == 2) {
//    if (grupo == 2) {
//      por = '25%';
//    }
//    if (grupo == 1) {
//      por = '10%';
//    }
//  }



//  for (let f = 1; f < notas.length; f++) {
//    notaGrupo = {
//    nota: 
//    notas[f][3], 
//    nombre: 
//    nom, 
//    porcentaje: 
//    por,
//  };

//  getDude(notas[f][0]).promedioGrupo[corte][grupo] = notaGrupo;

//  let actividades = [];

//  let primeraColumna = 5;
//  if (grupo == 0) {
//    primeraColumna = 6;
//  }

//  if (grupo != 2) {
//    for (let c = primeraColumna; c < notas[f].length; c++) {
//      actividad = {
//      nombre: 
//      notas[0][c], 
//      nota: 
//      notas[f][c],
//    };

//    actividades.push(actividad);
//  }
//} else { //Si es parcial, se muestra solo la nota global

//  actividad = {
//  nombre: 
//  notas[0][3], 
//  nota: 
//  notas[f][3],
//};

//actividades.push(actividad);

//}


//getDude(notas[f][0]).notas[corte][grupo] = actividades;
//}

//}

///// Clases /////

class Activity {
  constructor() {
    this.name = "Actividad";
    this.score = 0.0;
    this.comment = "<No hay comentarios disponibles>";
  }
}

class ActivityGroup {
  constructor() {
    this.name = "Grupo";
    this.average = 0.0;
    this.percentage = 0.1;
    this.activities = [];
  }
}

class Cut {
  constructor(name, average, percentage) {
    this.name = name;
    this.average = average;
    this.percentage = percentage;
    this.groups = [];
  }
}

class Student {
  constructor(id, names, lastnames, email, program, grade) {
    this.id = id;
    this.names = names;
    this.lastnames = lastnames;
    this.email = email;
    this.program = program;
    //--//
    this.grade = grade;
    this.absences = 0;
    this.target = 3.0;
    this.position = 0;
    this.cuts = [];
  }
}

class Course {
  constructor(name, group, semester, teacher, maxAbsences, average) {
    this.name = name;
    this.group = group;
    this.semester = semester;
    this.teacher = teacher;
    this.maxAbsences = maxAbsences;
    this.average = average;
    this.students = [];
    this.cutPercentages = []; //Esto es un arreglo de porcentajes
    this.graph = [0, 0, 0, 0, 0, 0,];
  }
}
