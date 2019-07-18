/*Este es el controlador del programa*/

let model = new Model();
let data = new DataManager();
let view = new ViewManager();

function setup() {
  view.createView();
  view.loadAssets();
}

function draw() {
  view.display(model);
}

function handleClientLoad() {
  view.addToStatusBar('Cliente cargado!');
  data.loadGapi();
}

function initClient() {
  data.gapiClientInit(this);
}

function clientInited() {
  view.addToStatusBar('Cliente iniciado!');
  data.loadCourseList();
}

function errorHandler(error) {
  console.log('Error capturado: '+error);
}

function coursesLoaded(response) {
  let data = response.result.values;

  let info = [];
  for (let i = 1; i < data.length; i++) {
    let anInfo = {
      'name': 
      data[i][0], 
      'url': 
      data[i][1],
    };
  info.push(anInfo);
  }
  model.courseList = info;
  view.showOptions(info);
  view.addToStatusBar('Cursos cargados!');

}

function studentLogin() {
  let course = view.courseSelect.value();
  let courseName = model.getCourseFromList(course);

  if (course != '') {
    let id = view.idInput.value();
    if (id != '') {
      data.loadData(course, courseName);
      view.addToStatusBar('Abriendo curso!');
    } else {
      view.setError('Ingrese un código para acceder');
    }
  } else {
    view.setError('Seleccione un curso para acceder');
  }
}

function dataLoaded(response) {

  let res = model.createModel(response);
  if (res) {
    
    view.addToStatusBar('Datos cargados!');

    let course = view.courseSelect.value();
    let courseName = model.getCourseFromList(course);
    let id = view.idInput.value();

    let res = null;
    if (courseName == 'DEMO UNIR' && id == 'DEMO UNIR') {
      res = model.loadStudent('random');
    } else {
      res = model.loadStudent(id);
    }

    //console.log('res='+res);
    if (res) {
      view.hideLogin();
    }
  }
}

function studentLogout() {
  model.clearStudent();
  view.hideLogout();
}
