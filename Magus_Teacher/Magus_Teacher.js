let spreadsheetId = '1ZP7CV62b-xUMhna4JfBgJC8UkXJCl9GfrexKFh4BfKA';
let apikey = 'AIzaSyAgebuGDMcuSoaxY5khfYeQpsX3SlzTGB8';
let discoveryDocs = [];
discoveryDocs.push('https://sheets.googleapis.com/$discovery/rest?version=v4');

let myWidth = 1366;
let myHeight = 1000;
let scl;

let statusBar = "";
let dudes = [];
let theDude;

let className = 'Introducción a la programación';
let semester;

let mockupImage;
let backgroundImage;
let headerImage;
let statsBackgroundImage;
let cutBanner;
let cutBackground;

let mainFont;
let secondaryFont;

let darkColor = '#142624';

function preload() {
  mainFont = loadFont('assets/TimesBold.ttf');
  secondaryFont = loadFont('assets/GothamBook.ttf');
  mockupImage = loadImage('assets/mockup.png');
  backgroundImage = loadImage('assets/background.png');
  headerImage = loadImage('assets/header.png');
  statsBackground = loadImage('assets/statsBackground.png');
  cutBanner = loadImage('assets/cutBanner.png');
  cutBackground = loadImage('assets/cutBackground.png');
}


function setup() {
  updateScale();
  createCanvas(windowWidth, myHeight*scl);
  semester = year()+'-'+((month() <= 6)?'1':'2');
}


function draw() {
  scale(scl);
  background(255, 255, 200);
  
  //drawImage(mockupImage, 0, 0);
  drawImage(backgroundImage, 0, 0);
  drawImage(headerImage, 0, 0);
  drawImage(statsBackground, 40, 180);
  drawImage(cutBanner, 372, 180);
  drawImage(cutBanner, 372, 454);
  drawImage(cutBanner, 372, 728);
  drawImage(cutBackground, 566, 180);
  drawImage(cutBackground, 566, 454);
  drawImage(cutBackground, 566, 728);
  
  
  textAlign(LEFT, BASELINE);
  
  textFont(mainFont);
  textSize(40);
  fill(darkColor);
  text(className, 40, 67);
  let xSem = 40+textWidth(className);
  textSize(25);
  text(' / '+semester, xSem, 67);
  
  if(theDude){
    textFont(secondaryFont);
    textSize(24);
    text(theDude.Nombres+' '+theDude.Apellidos, 40, 96);
    textSize(16);
    text(theDude.Id, 40, 115);
  }
  
  
  //Barra de mensajes
  textAlign(RIGHT, BOTTOM);
  textSize(10);
  text(statusBar, myWidth, myHeight);
  
}

function drawImage(theImage, x, y){
  if(theImage){
    image(theImage, x, y);
  }
}

//function setBackgroundImage(data) {
//  backgroundImage = data;
//}

//function setHeaderImage(data) {
//  headerImage = data;
//}

//function setMockup(data) {
  //mockup = data;
//}

function windowResized() {
  updateScale();
  resizeCanvas(windowWidth, myHeight*scl);
}

function updateScale(){
  scl = windowWidth/myWidth;
}

////////// Metodos de la API de consulta //////////

function apiLoaded() {
  statusBar += 'Api cargada!\t|\t';
  gapi.load('client:auth2', initClient);
}

function initClient() {
  statusBar += 'Cliente cargado!\t|\t';
  gapi.client.init(
    {
      'apiKey': apikey, 
      'discoveryDocs': discoveryDocs,
    }
  ).then(
    function() {
      statusBar += 'Cliente iniciado!\t|\t';
      loadData();
    }
  );
}

function getDude(id) {
  for (let d = 0; d < dudes.length; d++) {
    if (dudes[d].Id == id) {
      return dudes[d];
    }
  }
}

function loadData() {
  //Define parametros de consulta
  var params = {   
    spreadsheetId: spreadsheetId, // The ID of the spreadsheet to retrieve data from.
    ranges: [
      "Notas!A1:Z1000", //0
      "Ausencias!A1:D1000", //1    
      "Q&T 1!A1:Z1000", //2
      "Taller 1!A1:Z1000", //3
      "Parcial 1!A1:Z1000", //4
      "Q&T 2!A1:Z1000", //5
      "Taller 2!A1:Z1000", //6
      "Parcial 2!A1:Z1000", //7
      "Q&T 3!A1:Z1000", //8
      "Taller 3!A1:Z1000", //9
      "Parcial 3!A1:Z1000", //10
    ],
  };

  //Ejecuta la consulta
  let request = gapi.client.sheets.spreadsheets.values.batchGet(params);
  request.then(
    function(response) {
  
      crearEstudiantes(response.result.valueRanges[0].values);
      agregarAusencias(response.result.valueRanges[1].values);
      
      for(let corte = 0; corte < 3; corte++){
        for(let grupo = 0; grupo < 3; grupo++){
          let hoja = 2 + ((corte*3) + grupo);
          agregarGrupoNotas(response.result.valueRanges[hoja].values, corte, grupo);    
        }
      }
      statusBar += 'Estudiantes disponibles:'+dudes.length+'!\t|\t';
      theDude = dudes[0];
      statusBar += 'Estudiante cargado:'+theDude.Nombres+'!\t|\t';
    }, 
  
    function(reason) {
      console.error('error: ' + reason.result.error.message);
    }
  );
}

function crearEstudiantes(estudiantes){ 
  for (let i = 1; i < estudiantes.length; i++) {
    dude = {
      [estudiantes[0][0]]: estudiantes[i][0],
    };
  
    //Agrega el resto de datos de la primera hoja
    for (let k = 0; k < estudiantes[i].length; k++) { 
      dude[''+estudiantes[0][k]] = estudiantes[i][k];      
      dude.notas = [[[], [], [],], [[], [], [],], [[], [], [],],];
      dude.promedioGrupo = [[], [], [],];
    }
    dudes.push(dude);
  }
}

function agregarAusencias(ausencias){
  for(let i = 1; i < ausencias.length; i++){
    getDude(ausencias[i][0])[ausencias[0][3]] = ausencias[i][3];
  }
}

function agregarGrupoNotas(notas, corte, grupo){
  
  for(let f = 1; f < notas.length; f++){
    
    getDude(notas[f][0]).promedioGrupo[corte][grupo] = notas[f][3];
    
    let actividades = [];
    
    let primeraColumna = 5;
    if(grupo == 0){
      primeraColumna = 6;
    }
    
    for(let c = primeraColumna; c < notas[f].length; c++){
      actividad = {
        nombre: notas[0][c],
        nota: notas[f][c], 
      };
    
      actividades.push(actividad);
    }
    
      
    getDude(notas[f][0]).notas[corte][grupo] = actividades; 
  }
  
}
