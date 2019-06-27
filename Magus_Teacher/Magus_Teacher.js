//Cadenas de conexión con la API
let spreadsheetId = '1ZP7CV62b-xUMhna4JfBgJC8UkXJCl9GfrexKFh4BfKA';
let apikey = 'AIzaSyAgebuGDMcuSoaxY5khfYeQpsX3SlzTGB8';
let discoveryDocs = [];
discoveryDocs.push('https://sheets.googleapis.com/$discovery/rest?version=v4');

//Información auxiliar para el dibujo
let myWidth = 1366;
let myHeight = 1000;
let scl = 1;
let statusBar = "Iniciando";
let maxGroupNameWidth = 0;
let activityIndicator;
let activityDetail;

//DOM para login
let idInput;
let loginButton;
let logoutButton;

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
let activityBanner;
let welcomeBannerD;
let welcomeBannerM;
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
 
  mainFont = loadFont('assets/TimesBold.ttf');
  secondaryFont = loadFont('assets/GothamBook.ttf');
  
  mockupImage = loadImage('assets/mockup.png');
  backgroundImage = loadImage('assets/background.png');
  headerImage = loadImage('assets/header.png');
  statsBackground = loadImage('assets/statsBackground.png');
  cutBanner = loadImage('assets/cutBanner.png');
  cutBackground = loadImage('assets/cutBackground.png');
  activityBanner = loadImage('assets/activityBanner.png');
  welcomeBannerD = loadImage('assets/welcomeBannerD.png');
  welcomeBannerM = loadImage('assets/welcomeBannerM.png');
  
  for(let i = 0; i < 6; i++){
    shield[i] = loadImage('assets/shield'+i+'.png');
  }
}


function setup() {
  updateScale();
  createCanvas(windowWidth, myHeight*scl);
  
  idInput = createInput();
  idInput.hide();
  
  loginButton = createButton('Ingresar');
  loginButton.mousePressed(studentLogin);
  loginButton.hide();
  
  logoutButton = createButton('Salir');
  logoutButton.mousePressed(studentLogout);
  logoutButton.hide();
}

function draw() {
  scale(scl);
  smooth();
  background(255, 255, 200);

  drawBackground();
  
  if(student){
    drawHeader();
    drawStats();
  
    activityIndicator = undefined;
    
    drawCut(0, 372, 180);
    drawCut(1, 372, 454);
    drawCut(2, 372, 728);
    
    if(activityIndicator){
      activityIndicator.display();
    }
    
    if(activityDetail){
      activityDetail.display();
    }
  } else {
    
    let cx = myWidth/2;
    let cy = myHeight/3;
    if(isMobileDevice()){
      imageMode(CENTER);
      image(welcomeBannerM, cx, cy);
      textFont(mainFont);
      fill(darkColor);
      textAlign(CENTER, BASELINE);
      
      textSize(30);
      text("Bienvenido", cx, cy - 150);
      
      textSize(50);
      text("Consulta de notas", cx, cy - 80);
      
      textFont(secondaryFont);
      textSize(20);
      text("Ingrese su código para consultar sus notas", cx - 200, cy - 30, 400, 200);
    } else {
      imageMode(CENTER);
      image(welcomeBannerD, cx, cy);
      textFont(mainFont);
      fill(darkColor);
      textAlign(CENTER, BASELINE);
      
      textSize(20);
      text("Bienvenido", cx, cy - 90);
      
      textSize(30);
      text("Consulta de notas", cx, cy - 50);
      
      textFont(secondaryFont);
      textSize(16);
      text("Ingrese su código para consultar sus notas", cx - 200, cy - 10, 400, 200); 
    }
    
    idInput.show();
    idInput.position((cx*scl) - idInput.width/2, (cy+20)*scl);
    loginButton.show();
    loginButton.position((cx*scl) - loginButton.width/2, (cy*scl)+50);
  }
  
  displayStatusBar();
}

function drawBackground(){
  imageMode(CORNER);
  image(mockupImage, 0, 0);
  image(backgroundImage, 0, 0);
}

function drawHeader() {
  imageMode(CORNER);
  image(headerImage, 0, 0);
  if(course){
    textAlign(LEFT, BASELINE);
    noStroke();
    textFont(mainFont);
    textSize(40);
    fill(darkColor);
    text(course.name, 40, 67);
    let xSem = 40+textWidth(course.name);
    textSize(25);
    text(' / '+course.semester, xSem, 67);
  }
  if (student) {
    textFont(secondaryFont);
    textSize(24);
    text(student.names+' '+student.lastnames, 40, 96);
    textSize(16);
    text(student.id, 40, 115);
    
    logoutButton.show();
    logoutButton.position((myWidth-40)*scl - (logoutButton.width), (headerImage.height/2)*scl - logoutButton.height/2);
    
  }
}

function drawStats() {
  imageMode(CORNER);
  image(statsBackground, 40, 180);
  
  if (student) {

    //Dibuja el escudo
    let grade = student.grade;
    let theShield = shield[int(grade)];
    image(theShield, 64, 200, theShield.width*0.5, theShield.height*0.5);
    textFont(mainFont);
    textSize(30);
    textAlign(CENTER, BASELINE);
    fill(darkColor);
    text(float(grade).toFixed(1), 186, 375);

    // Indicador de progreso del escudo
    stroke(getGradeColor(grade));
    strokeWeight(3);
    noFill();
    let sAng = 150;
    let maxAng = 390;
    let angs = maxAng-sAng;
    let per = grade/5.0;
    arc(186, 365, 82, 82, radians(sAng), radians(sAng + (angs*per)));
    
    //Indicador de liga
    let nextLeague = getGradeLeagueName(int(student.grade) + 1);
    let min = int(student.grade);
    let max = min+1;
    
    if(student.grade >= 5){
      min = 4;
      max =5;
    }
    
    drawIndicator(nextLeague, student.grade, min, max, 60, 488, 251, 12);
    
    //indicador de meta
    drawIndicator('la meta', student.grade, 0, student.target, 60, 582, 251, 12);
    
    //Contador de ausencias
    drawLivesIndicator(60, 660, 251, 50, course.maxAbsences, course.maxAbsences-student.absences);
    
    //Indicador de puesto en el curso.
    drawPositionIndicator(60, 780, 251, 100, course.graph, student.grade, student.position, course.students.length);
    
  }
}

function drawPositionIndicator(x, y, w, h, data, curr, pos, rel){
  
  //Grafica de distribución
  let sep = w / (data.length-1);
  noStroke();
  fill(mainColor);
  beginShape();
  curveVertex(x, y+h);
  curveVertex(x, y+h);
  for(let i = 0; i < data.length; i++){
    vertex(x+(i*sep), y+h-(h*(data[i]/max(data))));
  }
  curveVertex(x+w, y+h);
  curveVertex(x+w, y+h);
  endShape();
  
  stroke(mainColor);
  strokeWeight(3);
  line(x, y+h, x+w, y+h);
  
  //posición de la nota
  stroke(highlightColor);
  strokeWeight(3);
  let px = map(curr, 0, 5, 0, w);
  line(x+px, y-2, x+px, y+h+2);
  
  //Indicadores del grafico
  for(let i = 0; i < data.length; i++){
    strokeWeight(1);
    stroke(ligthColor);
    let theX = x+(i*sep); 
    
    //line(theX, theY, theX, y+h);
    noStroke();
    fill(darkColor);
    textSize(15);
    textAlign(CENTER, BOTTOM);
    text(float(i).toFixed(1), theX, y+h+20);
  }

  //Información del puesto
  noStroke();
  fill(darkColor);
  textAlign(LEFT, BASELINE);
  textSize(20);
  text('Puesto', x, y+20);
  text(pos, x, y+40);
  let msgWidth = textWidth(pos+'');
  textSize(15);
  text('/'+rel, x+msgWidth, y+40);
}

function drawLivesIndicator(x, y, w, h, max, curr){
  
  let unitMargin = 5;
  let unitW = w / max;
  
  for(let i = 0; i < max; i++){
    let full = 0;
    if(i < curr){
      full = 1;
    }
    progressBar(x + (unitW)*i, y, unitW-unitMargin, h, 'horizontal', full);
  }
  
  textFont(secondaryFont);
  textSize(20);
  noStroke();
  fill(darkColor); 
  textAlign(RIGHT, BASELINE);
  if(curr >= 0){
    text('Te queda'+((curr>1)?'n':'')+' '+curr+' vida'+((curr>1)?'s':'')+'', x+w, y+h+20);
  } else {
    text('Game Over ('+curr+')', x+w, y+h+20);
  }
  
}

function drawIndicator(name, curr, min, max, x, y, w, h){

    min = float(min).toFixed(1);
    max = float(max).toFixed(1);
    textFont(secondaryFont);
    textSize(20);
    noStroke();
    fill(darkColor);  
    textAlign(LEFT, BASELINE);
    text(min, x, y - 5);
    textAlign(RIGHT, BASELINE);
    text(max, x+w, y - 5);
    
    let fulfillment = map(curr, min, max, 0, 1);//curr - min;
    progressBar(x, y, w, h, 'horizontal', fulfillment);
    
    fill(darkColor);
    noStroke(0);
  
    let missing = max - curr;
    if(missing >= 0){  
      text(missing.toFixed(1)+' para '+name, x+w, y+h+20);
    } else {
      text('pasaste '+name+ ' por '+(-missing.toFixed(1)), x+w, y+h+20);
    }
}

function progressBar(x, y, w, h, direction, p, m){
  
  //Area para mostrar
  rectMode(CENTER);
  noFill();
  stroke(0, 8);
  let thick = 5;
  for (let i = thick; i > 0; i--) {
    strokeWeight(thick-i);
    rect(x + (w/2), y + (h/2), w-thick+i, h-thick+i, 3);
  }
  noStroke();
  fill(0, 16);
  rectMode(CORNER);
  rect(x, y, w, h, 3);
  
  //Variables de estilo adicional
  let exceeded = false;
  let missed = false;
    
  if(p > 1){
    p = 1;
    exceeded = true;
  } else if (p < m){
    missed = true;
  }
  
  let myColor = mainColor;
  
  //formatos previos
  if(exceeded){ //Poner un estilo si ya se pasó
  } else if(missed){ //poner otro estilo si ha faltado
    myColor = highlightColor;
  }
  
  //Area para rellenar
  fill(myColor);
  noStroke();
  if(direction == 'horizontal'){
    rect(x, y, w*p, h, 3);
  } else if(direction == 'vertical'){
    rect(x, y + (h*(1-p)), w, h*p, 3);
  }
  
  //formatos posteriores
  if(exceeded){ //Poner un estilo si ya se pasó
    stroke('#00D0D0');
    strokeWeight(2);
    rect(x, y, w, h, 3);
  } else if(missed){ //poner otro estilo si ha faltado
    
  }
  
}

//cut viene desde 0
function drawCut(cutIndex, x, y) {
  imageMode(CORNER);
  image(cutBanner, x, y);
  image(cutBackground, x+194, y);
  textAlign(CENTER, BASELINE);
  textFont(mainFont);
  textSize(30);
  noStroke();
  
  if(student){
    
    let theCut = student.cuts[cutIndex];
    
    fill(ligthColor);
    text(theCut.name, x+88, y+60);
  
    textSize(50);
    text(theCut.average, x+88, y+118);
    
    textFont(secondaryFont);
    textSize(20);
    text(theCut.percentage, x+88, y+158);
  
    drawGroup(cutIndex, 0, x+216, y+20);
    drawGroup(cutIndex, 1, x+216, y+88);
    drawGroup(cutIndex, 2, x+216, y+156);
  }
}

//cut y group vienen desde 0
function drawGroup(cutIndex, groupIndex, x, y) {
  
  let theGroup = student.cuts[cutIndex].groups[groupIndex];
  
  fill(darkColor);
  noStroke();
  textAlign(LEFT, BASELINE);
  textSize(30);
  text(theGroup.average, x, y+26);
  text(theGroup.name, x+64, y+26);

  let groupNameWidth = textWidth(theGroup.name);
  if (groupNameWidth > maxGroupNameWidth) {
    maxGroupNameWidth = groupNameWidth;
  }

  textSize(20);
  text(theGroup.percentage, x+64, y+54);

  //Dibuja cada cuadro de nota
  let firstX = x + 64 + maxGroupNameWidth + 20; 
  for (let n = 0; n < theGroup.activities.length; n++) {
    drawActivity(cutIndex, groupIndex, n, firstX + (45*n), y);
  }
  firstX += 45;
  
}

function drawActivity(cutIndex, groupIndex, actIndex, x, y){
    
  //Muestra la nota
  noStroke();
  fill(darkColor);
  textAlign(CENTER, BASELINE);
  textSize(14);
  let note = student.cuts[cutIndex].groups[groupIndex].activities[actIndex];
  text(note.score, x + 20, y + 54);
  
  let per = note.score/5.0;
  progressBar(x, y, 40, 40, 'vertical', per, 0.6);

  if((mouseX/scl) >= x && (mouseX/scl) <= x+40 && (mouseY/scl) >= y && (mouseY/scl) <= y+40){
    activityIndicator = new ClickIndicator(x, y, 40, 40, ['Activity', cutIndex, groupIndex, actIndex,]);
  }

}

function getGradeColor(val) {
  
  if(val >= 5.0){
    return '#00D0D0';
  } else if(val >= 4.0){
    return '#00D000';
  } else if(val >= 3.0){
    return '#FFD000';
  } else {
    return '#D00000';
  }
}

function getGradeLeagueName(val){
  if(val >= 5.0){
    return 'Diamante';
  } else if(val >= 4.0){
    return 'Oro';
  } else if(val >= 3.0){
    return 'Plata';
  } else {
    return 'Bronce';
  }
}

function updateScale() {
  scl = windowWidth/myWidth;
}

function windowResized() {
  updateScale();
  resizeCanvas(windowWidth, myHeight*scl);
}

function addToStatusBar(message) {
  statusBar += '\t|\t'+message;
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
  addToStatusBar('Api cargada!');
  gapi.load('client:auth2', initClient);
}

function initClient() {
  addToStatusBar('Cliente cargado!');
  gapi.client.init({
    'apiKey': apikey, 
    'discoveryDocs': discoveryDocs,
  }).then(
    function() {
      addToStatusBar('Cliente iniciado!');
      loadData();
    }
  );
}

function loadData() { 
  //Define parametros de consulta
  var params = {   
    spreadsheetId: spreadsheetId, // The ID of the spreadsheet to retrieve data from.
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
  var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
  request.then(function(response) {
    addToStatusBar('datos cargados!');
    dataLoaded(response);
  }, function(reason) {
    addToStatusBar('error: ' + reason.result.error.message);
  });
}

function dataLoaded(response){
  
  let data = response.result.valueRanges;
  
  createCurse(data[0].values);   //"Curso!A1:C50",//0
  createStudents(data[1].values);//"Notas!A1:Z1000", //1
  addActivities(data[2].values, 1, 1);  //"Q&T 1!A1:Z100", //2
  addActivities(data[3].values, 1, 2);  //"Taller 1!A1:Z100", //3
  addActivities(data[4].values, 1, 3);  //"Parcial 1!A1:Z100", //4
  addActivities(data[5].values, 2, 1);  //"Q&T 2!A1:Z100", //5
  addActivities(data[6].values, 2, 2);  //"Taller 2!A1:Z100", //6
  addActivities(data[7].values, 2, 3);  //"Parcial 2!A1:Z100", //7
  addActivities(data[8].values, 3, 1); //"Q&T 3!A1:Z100", //8
  addActivities(data[9].values, 3, 2); //"Taller 3!A1:Z100", //9
  addActivities(data[10].values,3, 3); //"Parcial 3!A1:Z100", //10
}

function createCurse(data){
  
  let name = data[0][0];
  let group = data[1][1];
  let semester = data[2][1];
  let teacher = data[3][1];
  let maxAbsences = int(data[4][1]);
  let average = float(data[5][1].replace(',','.')).toFixed(1);
  let cutsCount = int(data[6][1]);
  
  let f = 6;
  let titles = [];
  for(let c = 1; c < data[f].length; c++){
    let t = data[f][c];
    if(c == 1){
      t = 'Corte';
    }
    titles.push(t);
  }
  f++;
  
  let cutPercentages = [];
  for(let cut = 0; cut < cutsCount; cut++){
    let cutInfo = [];
    for(let c = 1; c < data[f].length; c++){
      cutInfo.push([titles[c-1], data[f][c],]);
    }
    cutPercentages.push(cutInfo);
    f++;
  }  
  course = new Course(name, group, semester, teacher, maxAbsences, average, cutPercentages);
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
    
    for(let c = 0; c < course.cutPercentages.length; c++){
      let name = data[0][c+5];
      let average = float(data[f][c+5].replace(',', '.')).toFixed(1);
      let percentage = course.cutPercentages[c][0][1];
      let cut = new Cut(name, average, percentage);
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
  //Y luego los vuelve a dejar como estaba, por si acaso.
  course.students.sort((a, b) => (a.lastnames+' '+a.names > b.lastnames+' '+b.names) ? 1 : -1);
}

// cut viene de 1 a 3, group viene de 1 a 3
function addActivities(data, cut, group){
  
  let firstColumn = 5;
  if(group == 1){
    firstColumn = 6;
  }   
  
  for(let f = 1; f < data.length; f++){ 
    
    //Se crea cada uno de los grupos de notas
    let gName = course.cutPercentages[cut-1][group][0];
    let gAverage = float(data[f][3].replace(',','.')).toFixed(1);
    let gPercentage = course.cutPercentages[cut-1][group][1]; 
    let aGroup = new ActivityGroup(gName, gAverage, gPercentage);
    
    //Se crea cada una de las actividades
    if(group != 3){
      for(let c = firstColumn; c < data[f].length; c++){
        let aName = data[0][c];
        let aScore = float(data[f][c].replace(',', '.')).toFixed(1);
        let anActivity = new Activity(aName, aScore);
        aGroup.activities.push(anActivity);
      }
    } else { // si es la nota de parcial
      let aName = course.cutPercentages[cut-1][group][0];
      let aScore = float(data[f][3].replace(',', '.')).toFixed(1);
      let anActivity = new Activity(aName, aScore);
      aGroup.activities.push(anActivity);
    }
    
    //Se pone el % de cada actividad del grupo
    let gPerFloat = float(aGroup.percentage.replace('%', '')/100); 
    let indPer = gPerFloat/aGroup.activities.length;
    indPer = (indPer*100).toFixed(2);
    
    let individualPercentage = indPer+'%';
    for(let a = 0; a < aGroup.activities.length; a++){
      aGroup.activities[a].percentage = individualPercentage;
    }
    
    //Se agrega el grupo al corte respectivo.
    let studentId = data[f][0];
    course.getStudent(studentId).cuts[cut-1].groups.push(aGroup); 
  }
}

///// Clases /////

class Activity {
  constructor(name, score) {
    this.name = name;
    this.score = score;
    this.comment = "<No hay comentarios disponibles>";
    this.percentage = 0.0;
  }
}

class ActivityGroup {
  constructor(name, average, percentage) {
    this.name = name;
    this.average = average;
    this.percentage = percentage;
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
  constructor(id, names, lastnames, email, program, grade, target, absences) {
    this.id = id;
    this.names = names;
    this.lastnames = lastnames;
    this.email = email;
    this.program = program;
    //--//
    this.grade = grade;
    this.target = target;
    this.absences = absences;
    //--//
    this.position = 0;
    this.cuts = [];
  }
}

class Course {
  constructor(name, group, semester, teacher, maxAbsences, average, cutPercentages) {
    this.name = name;
    this.group = group;
    this.semester = semester;
    this.teacher = teacher;
    this.maxAbsences = maxAbsences;
    this.average = average;
    this.students = [];
    this.cutPercentages = cutPercentages; //Esto es un arreglo de porcentajes
    this.graph = [0, 0, 0, 0, 0, 0,];
  }
  
  getStudent(studentId){
    for(let s = 0; s < this.students.length; s++){
      if(this.students[s].id == studentId){
        return this.students[s];
      }
    }
  }
}

// Clases gráficas //
class ClickIndicator{
  constructor(x, y, w, h, data){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.data = data;
  }
  
  display(){
    noFill();
    strokeWeight(3);
    stroke(highlightColor);
    rect(this.x, this.y, this.w, this.h, 3);
  }
}

class ActivityDetail{
  constructor(x, y, activity){
    this.x = x;
    this.y = y;
    this.xi = x;
    this.yi = y;
    this.activity = activity;
    this.myColor = mainColor;
  }
  
  display(){
    
    if(this.x + activityBanner.width > myWidth){
      this.x = myWidth - activityBanner.width;
    }
    
    if(this.y + activityBanner.height > myHeight){
      this.y = myHeight - activityBanner.height;
      this.myColor = ligthColor;
    }
    
    image(activityBanner, this.x+20, this.y);
    
    fill(this.myColor);
    stroke('#ff9933');
    strokeWeight(5);
    beginShape();
    vertex(this.xi+22, this.yi+2.5);
    vertex(this.xi, this.yi+10.5);
    vertex(this.xi+22, this.yi+18.5);
    endShape();
    
    fill(darkColor);
    textFont(mainFont);
    noStroke();
    textSize(20);
    textAlign(CENTER, BASELINE);
    let myCenterX = this.x + 120;
    
    text(this.activity.name, this.x+30, this.y+30, 185, 25);
    
    textFont(secondaryFont);
    textSize(16);
    text(this.activity.score + '\t\t' + this.activity.percentage, myCenterX, this.y+80);
    let perWidth = textWidth(this.activity.score);
    
    textSize(14);
    text(this.activity.comment, this.x+30, this.y+90+20, 180, 100);
  }
}

// Eventos //

function mouseClicked(){
  
  if(activityIndicator){
    let x = activityIndicator.x;
    let y = activityIndicator.y;
    let w = activityIndicator.w;
    let c = activityIndicator.data[1];
    let g = activityIndicator.data[2];
    let a = activityIndicator.data[3];
    let activity = student.cuts[c].groups[g].activities[a];
    
    activityDetail = new ActivityDetail(x + w, y, activity);
 
  } else {
    activityDetail = null;
  }
}

function studentLogin(){
  let id = idInput.value();
  
  if(id == 'DEMOUNIR'){
    student = course.students[int(random(course.students.length))];
  } else {
    student = course.getStudent(id);
  }
   
  idInput.value(''); 
  idInput.hide();
  loginButton.hide();
}

function studentLogout(){
  logoutButton.hide();
  student = null;
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}
