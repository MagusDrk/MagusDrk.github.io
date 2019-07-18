class DataManager {

  constructor() {
    /*Cadenas de conexión con la API*/
    //this.spreadsheetId = '1ZP7CV62b-xUMhna4JfBgJC8UkXJCl9GfrexKFh4BfKA';
    this.apikey = 'AIzaSyAgebuGDMcuSoaxY5khfYeQpsX3SlzTGB8';
    this.discoveryDocs = [];
    this.discoveryDocs.push('https://sheets.googleapis.com/$discovery/rest?version=v4');
  }

  loadGapi() {
    gapi.load('client:auth2', initClient);
  }

  gapiClientInit() {
    let params = { 'apiKey': this.apikey, 'discoveryDocs': this.discoveryDocs, };
    gapi.client.init(params).then(clientInited, errorHandler);
  }
  
  loadData(theSpreadsheetId, fileName) {
    
    //Define parametros de consulta
    var params = {   
      spreadsheetId: theSpreadsheetId, // The ID of the spreadsheet to retrieve data from.
      ranges: [
        "Curso!A1:J50",//0
        "Notas!A1:Z1000", //1
        "Q&T 1!A1:Z100", //2
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
    gapi.client.sheets.spreadsheets.values.batchGet(params).then(dataLoaded, function(response){ //Función de error
    
      let msg = 'ERROR: ';
      switch(response.result.error.code){
        case 400:
          msg += 'No se encuentra la hoja \'';
          msg += response.result.error.message.replace('Unable to parse range: ', '').split('!')[0];
          msg += '\' en el archivo '+fileName+'. ';
        break;
        case 403:
          msg += 'El programa no cuenta con permisos para el archivo '+fileName+'. ';
        break;
        case 404:
          msg += 'No se encuentra el archivo '+fileName+'. ';
        break;
      }
      
      msg += 'Por favor, comuníquese con el administrador del sistema para solucionar el incidente.';
        //let msg = 'ERROR: no se ha podido cargar el archivo para el curso '+fileName+
        //', por favor, comuníquese con el administrador del sistema para solucionar el incidente.\n\n';
        //response.error.message + '('+response.error.code+')';
      view.setError(msg);
      console.log(response.result.error);
      }
     );
  }
  
  loadCourseList() {
    
    //Define parametros de consulta
    var params = {   
      spreadsheetId: '1KmDmgK4e1xRsT2jTwqYQ8CbuzrU3gh5d0UTZXbe719U', // The ID of the spreadsheet to retrieve data from.
      range: [
        "Cursos!A:B",//0
      ],
    };
  
    //Ejecuta la consulta
    gapi.client.sheets.spreadsheets.values.get(params).then(coursesLoaded, 
      function(reason){ //Función de error
      
        let msg = 'ERROR: No se encuentra la lista de cursos. '+
          'por favor, comuníquese con el administrador del sistema para solucionar el incidente.';
        view.setError(msg);
      }
    );
  }

}
