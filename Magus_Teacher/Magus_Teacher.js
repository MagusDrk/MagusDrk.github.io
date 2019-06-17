let spreadsheetId = '1ZP7CV62b-xUMhna4JfBgJC8UkXJCl9GfrexKFh4BfKA';

let apikey = 'AIzaSyAgebuGDMcuSoaxY5khfYeQpsX3SlzTGB8';

let discovery_docs = [];
discovery_docs.push('https://sheets.googleapis.com/$discovery/rest?version=v4');

let status_bar = "";

let dudes = [];



function setup() {
  createCanvas(500, 500);
}


function draw() {
  background(255, 255, 200);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("Under construction", width/2, height/2);

  textAlign(RIGHT, BOTTOM);
  textSize(10);
  text(status_bar, width, height);
}

function apiLoaded() {
  status_bar += 'Api cargada!\t|\t';
  gapi.load('client:auth2', initClient);
}

function initClient() {
  status_bar += 'Cliente cargado!\t|\t';
  gapi.client.init(
    {
      'apiKey': apikey, 
      'discoveryDocs': discovery_docs,
    }
  ).then(
    function() {
      status_bar += 'Cliente iniciado!\t|\t';
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
      status_bar += 'Notas cargadas:'+dudes.length+'!\t|\t';
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
