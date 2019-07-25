class ViewManager {

  constructor() {
    //Propiedades para escalar el diseño
    this.myWidth = 1368;
    this.myHeight = 1072;
    this.scl = 1;
    this.maxGroupNameWidth = 0;
    this.activityIndicator = null;
    this.activityDetail = null;

    //Paleta de colores
    this.mainColor = '#993300';
    this.secondaryColor = '#F1BD22';
    this.neutralColor = '#A0A0A0';
    this.darkTextColor = '#142624';
    this.clearTextColor = '#FFFFE8';

    //Tipografías
    this.mainFont = null;
    this.secondaryFont = null;

    //Imagenes
    this.mockupImage = null;
    this.reticleImage = null;
    this.backgroundImage = null;
    this.headerBackground = null;
    this.statsBackground = null;
    this.cutBannerImage = null;
    this.cutBackground = null;
    this.activityBackground = null;
    //this.welcomeBannerM; // Despues
    this.ring = [];
    this.shield = [];

    //DOM para manejo de sesiones
    this.courseSelect = null;
    this.idInput = null;
    this.loginButton = null;
    this.logoutButton = null;
    this.loginErrorMessage = null;

    //Propiedad para mostrar mensajes de estado 
    this.statusBar = '';
  }

  loadAssets() {
    this.loadFonts();
    this.loadImages();
    this.createDOM();
  }

  loadFonts() {
    loadFont('assets/TimesBold.ttf', font => {
      this.mainFont = font;
    }
    );
    loadFont('assets/GothamBook.ttf', font => {
      this.secondaryFont = font;
    }
    );
  }

  loadImages() {
    loadImage('assets/mockup.png', img => {
      this.mockupImage = img;
    }
    );
    loadImage('assets/reticle.png', img => {
      this.reticleImage = img;
    }
    );
    loadImage('assets/background.png', img => {
      this.backgroundImage = img;
    }
    );
    loadImage('assets/headerBackground.png', img => {
      this.headerBackground = img;
    }
    );
    loadImage('assets/statsBackground.png', img => {
      this.statsBackground = img;
    }
    );
    loadImage('assets/cutBanner.png', img => {
      this.cutBannerImage = img;
    }
    );
    loadImage('assets/cutBackground.png', img => {
      this.cutBackground = img;
    }
    );
    loadImage('assets/activityBackground.png', img => {
      this.activityBackground = img;
    }
    );
    loadImage('assets/welcomeBanner.png', img => {
      this.welcomeBanner = img;
    }
    );

    this.shield = [];
    for (let i = 0; i < 6; i++) {
      loadImage('assets/shield'+i+'.png', img => {
        this.shield[i] = img;
      }
      );
      loadImage('assets/ring'+i+'.png', img => {
        this.ring[i] = img;
      }
      );
    }
  }

  createDOM() {
    this.courseSelect = createSelect('Seleccione su curso');
    this.courseSelect.option('Seleccione su curso', '');
    this.courseSelect.hide();

    this.idInput = createInput();
    this.idInput.attribute('placeholder', 'Ingrese aquí su código');
    this.idInput.hide();

    this.loginButton = createButton('Ingresar');
    this.loginButton.mousePressed(studentLogin);
    this.loginButton.hide();

    this.logoutButton = createButton('Salir');
    this.logoutButton.mousePressed(studentLogout);
    this.logoutButton.hide();
  }

  createView() {
    //createCanvas(windowWidth, windowHeight);
    view.updateScale();
    createCanvas(windowWidth, max(this.myHeight*this.scl, windowHeight));
  }
  
  showOptions(options){
    //this.courseSelect.clear();
    for(let i = 0; i < options.length; i++){
      this.courseSelect.option(options[i].name, options[i].url);  
    }
  }

  displayLogin() {

    let cx = windowWidth/2;
    let cy = windowHeight/2;

    imageMode(CENTER);
    simage(this.welcomeBanner, cx, cy);
    stextFont(this.mainFont);
    fill(this.darkTextColor);
    textAlign(CENTER, BASELINE);
    textSize(20);// texthierarchy[?];
    text("Bienvenido", cx, cy - 90);
    textSize(30); // texthierarchy[?];
    text("Consulta de notas", cx, cy - 50);
    stextFont(this.secondaryFont);
    textSize(16); // texthierarchy[?];
    text("Seleccione su curso e ingrese su código para consultar sus notas", cx - 200, cy - 20, 400, 200);

    // Acomodar los componentes aquí
    this.courseSelect.position(cx-100, cy+20);
    this.courseSelect.size(200);
    this.courseSelect.show();

    this.idInput.position(cx-100, cy+50);
    this.idInput.size(200);
    this.idInput.show();

    this.loginButton.position(cx-50, cy+80);
    this.loginButton.size(100);
    this.loginButton.show();
    
    //Zona de errores:
    
    if(this.loginErrorMessage){
      fill(color(0, 0, 0, 180));
      rect(cx - 200, cy + 180, 400, 100, 10);
      
      textSize(14);
      fill(this.clearTextColor);
      textAlign(CENTER, TOP);
      text(this.loginErrorMessage, cx - 200, cy + 180 + 14, 400, 100);
    }
  }
  
  setError(msg){
    this.loginErrorMessage = msg;
  }

  displayMobileLogin() {
    //Pendiente este ajuste
    this.displayLogin();
  }

  display(model) {

    this.drawBackground();

    if (model.student) {
      this.displayModel(model);
    } else {
      if (deviceOrientation == 'undefined' || deviceOrientation == LANDSCAPE) {
        this.displayLogin();
      } else {
        this.displayMobileLogin();
      }
    }
    this.displayStatusBar();
  }

  displayModel(model) {

    this.updateScale();
    push();
    scale(this.scl);
    
    //imageMode(CORNER);
    //simage(this.mockupImage, 0, 0);
    //simage(this.reticleImage, 0, 0);
    
    this.drawHeader(model.course, model.student);
    this.drawStats(model.student, model.course);

    this.activityIndicator = undefined;

    this.drawCut(model.student.cuts[0], 378, 188);
    this.drawCut(model.student.cuts[1], 378, 482);
    this.drawCut(model.student.cuts[2], 378, 776);

    if (this.activityIndicator) {
      this.activityIndicator.display();
    }

    if (this.activityDetail) {
      this.activityDetail.display();
    }
    pop();
  }

  drawBackground() {
    background(this.clearTextColor);
    imageMode(CENTER);
    simage(this.backgroundImage, width/2, height/2);
  }

  drawHeader(course, student) {
    imageMode(CORNER);
    simage(this.headerBackground, 0, 0);
    if (course) {
      
      //Título del curso
      textAlign(LEFT, BASELINE);
      noStroke();
      textFont(this.mainFont);
      textSize(30);// texthierarchy[?];
      fill(this.darkTextColor);
      text(course.name, 48, 48 + (20));
    
      let xSem = 48 + textWidth(course.name+" ");
      textSize(20);
      text(' / '+course.semester, xSem, 48 + (20));
    }
    if (student) {
      textFont(this.secondaryFont);
      textSize(20);
      text(student.names+' '+student.lastnames, 48, 48 + 44);
    
      textSize(14);
      text(student.id, 48, 48 + 62);

      this.logoutButton.show();
      let xb = (this.myWidth-48)*this.scl - (this.logoutButton.width);
      let yb = 48*this.scl;
      this.logoutButton.position(xb, yb);
    }
  }

  drawStats(student, course) {
    
    if (student) {
    imageMode(CORNER);
    simage(this.statsBackground, 48, 188);
    
    this.drawGrade(student.grade, 72, 212, 234, 240);
    
      //Indicador de liga
      let currentLeague = 'Liga '+this.getGradeLeagueName(int(student.grade));
      let nextLeague = this.getGradeLeagueName(int(student.grade) + 1);
      let min = int(student.grade);
      let max = min+1;

      if (student.grade >= 5) {
        min = 4;
        max = 5;
      }

      //title, next, curr, min, max, x, y, w, h
      this.drawIndicator(currentLeague, nextLeague, student.grade, min, max, 72, 476, 234, 96);

      //indicador de meta
      //title, next, curr, min, max, x, y, w, h
      this.drawIndicator('Meta', 'tu meta', student.grade, 0, student.target, 72, 596, 234, 96);

      //Contador de ausencias
      //this.drawLivesIndicator(72, 716, 234, 96, course.maxAbsences-student.absences, course.maxAbsences);
      this.drawLivesIndicator(72, 716, 234, 96, student.absences, course.maxAbsences);

      //Indicador de puesto en el curso.
      let graph = course.graph;
      let grade = student.grade;
      let pos = student.position;
      let count = course.studentsCount;
      this.drawPositionIndicator(72, 836, 234, 162, graph, grade, pos, count);
    }
  }
  
  drawGrade(grade, x, y, w, h){
    
    //Dibuja el circulo de progreso
    
    //Primero la imagen
    let theRing = this.ring[int(grade)];
    let sclR = 234/theRing.width;
    simage(theRing, x, y, theRing.width*(sclR), theRing.height*(sclR));
    
    //Luego el arco de progreso
    let xmid = x + (w/2);
    let ymid = y + (w/2);
    // Sobre el ancho, no el alto, porque es un circulo perfecto,
    // el alto se usa para ubicar el escudo
    
    let prog = map(grade, 0, 5, 1, 350);
    
    noFill();
    
    strokeWeight(5);
    stroke(this.getGradeColor(grade));
    arc(xmid, ymid-2, w-22, w-22, radians(100), radians(100+prog));
    
    //Dibuja el escudo a escala
    imageMode(CENTER);
    let theShield = this.shield[int(grade)];
    let sclS = 216/theShield.width;
    simage(theShield, xmid, y+h-60, theShield.width*(sclS), theShield.height*(sclS)); //216/800
    
    //Dibuja la nota
    textSize(80);
    noStroke();
    textFont(this.mainFont);
    fill(this.darkTextColor);
    textAlign(CENTER, CENTER);
    text(float(grade).toFixed(1), xmid, ymid-20);
  }

  displayStatusBar() {
    fill(this.darkTextColor);
    noStroke();
    textSize(10); //hierar
    stextFont(this.secondaryFont);
    textAlign(RIGHT, BOTTOM);
    text(this.statusBar, width, height);
  }

  drawIndicator(title, next, curr, min, max, x, y, w, h) {
    
    //Información del puesto
    noStroke();
    textSize(20);
    stextFont(this.secondaryFont);
    fill(this.darkTextColor);
    textAlign(LEFT, BASELINE);
    
    text(title, x, y+16);
    
    min = float(min).toFixed(1);
    max = float(max).toFixed(1);
    textFont(this.secondaryFont);
    textSize(14);
    noStroke();
    fill(this.darkTextColor);  
    textAlign(LEFT, BASELINE);
    text(min, x, y + 48-2);
    
    textAlign(RIGHT, BASELINE);
    text(max, x+w, y + 48-2);

    let fulfillment = map(curr, min, max, 0, 1);//curr - min;
    this.drawProgressBar(x, y+48, w, h-80, 'horizontal', fulfillment);

    let missing = max - curr;
    let txt = missing.toFixed(1)+' para '+next;
    if (missing < 0) {
      txt = 'Haz alcanzado '+next+ ' (+'+(-missing.toFixed(1))+')';
    }
    
    noStroke(0);
    fill(this.darkTextColor);
    text(txt, x+w, y+h-16);
    
    strokeWeight(1);
    stroke(this.darkTextColor);
    line(x, y+h, x+w, y+h);
  }

  drawProgressBar(x, y, w, h, direction, p, m) {

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

    if (p > 1) {
      p = 1;
      exceeded = true;
    } else if (p < m) {
      missed = true;
    }

    let myColor = this.mainColor;

    //formatos previos
    if (exceeded) { //Poner un estilo si ya se pasó
    } else if (missed) { //poner otro estilo si ha faltado
      myColor = this.secondaryColor;
    }

    //Area para rellenar
    fill(myColor);
    noStroke();
    if (direction == 'horizontal') {
      rect(x, y, w*p, h, 3);
    } else if (direction == 'vertical') {
      rect(x, y + (h*(1-p)), w, h*p, 3);
    }

    //formatos posteriores
    if (exceeded) { //Poner un estilo si ya se pasó
      stroke('#00D0D0');
      strokeWeight(2);
      rect(x, y, w, h, 3);
    } else if (missed) { //poner otro estilo si ha faltado
    }
  }

  drawLivesIndicator(x, y, w, h, curr, max) {
    
    let txt = 'Ausencias '+curr;
    //Información del puesto
    noStroke();
    fill(this.darkTextColor);
    textAlign(LEFT, BASELINE);
    textSize(20);
    text(txt, x, y+16);
    
    let msgWidth = textWidth(txt);
    textSize(15);
    text('/'+max, x+msgWidth, y+16);

    let rem = max - curr;
    
    let unitMargin = 8;
    let unitW = (w / max) + (unitMargin/max); //La segunda parte es para ajustar las vidas al ancho disponible

    for (let i = 0; i < max; i++) {
      let full = 0;
      if (i < rem) {
        full = 1;
      }
      this.drawProgressBar(x + (unitW)*i, y+32, unitW-unitMargin, h-64, 'horizontal', full);
    }

    noStroke();
    textSize(14);
    fill(this.darkTextColor);
    textAlign(RIGHT, BASELINE);
    textFont(this.secondaryFont);
    
    if(rem < 0){
      txt = 'Has perdido por ausencias. (' + rem + ')';
    } else {
      if(rem == 1){
        txt = 'te queda '+rem+' ausencia';
      } else {
        txt = 'te quedan '+rem+' ausencias';
      }
    }
    text(txt, x+w, y+h-16);
    
    strokeWeight(1);
    stroke(this.darkTextColor);
    line(x, y+h, x+w, y+h);
  }

  drawPositionIndicator(x, y, w, h, data, curr, pos, rel) {
    
    let txt = 'Puesto '+pos;
    //Información del puesto
    noStroke();
    fill(this.darkTextColor);
    textAlign(LEFT, BASELINE);
    textSize(20);
    text(txt, x, y+16);
    
    let msgWidth = textWidth(txt);
    textSize(15);
    text('/'+rel, x+msgWidth, y+16);

    //Grafica de distribución
    let sep = w / (data.length-1);
    
    noStroke();
    fill(this.mainColor);
    
    beginShape();
    curveVertex(x, y+h-32);
    curveVertex(x, y+h-32);
    
    for (let i = 0; i < data.length; i++) {  
      let theVal = (h-82)*(data[i]/max(data));
      let theX = x+(i*sep);
      let theY = y+h-32-(theVal);
      vertex(theX, theY);
    }
    
    curveVertex(x+w, y+h-32);
    curveVertex(x+w, y+h-32);
    endShape();

    stroke(this.mainColor);
    strokeWeight(3);
    line(x, y+h-32, x+w, y+h-32);

    //Indicador de la nota
    stroke(this.secondaryColor);
    strokeWeight(3);
    let px = map(curr, 0, 5, 0, w);
    line(x+px, y+48, x+px, y+h-32);
    
    noStroke();
    textSize(14);
    textAlign(CENTER, BASELINE);
    fill(this.darkTextColor);
    text(curr, x+px, y+46);
    
    //Indicadores del grafico
    for (let i = 0; i < data.length; i++) {  
      
      let val = float(i).toFixed(1);
      if(i == 0){
        val = '';
      }
      
      let theX = x+(i*sep);
      
      noStroke();
      textSize(14);
      fill(this.darkTextColor);
      textAlign(RIGHT, BASELINE);
      text(val, theX, y+h-16);
      
      strokeWeight(1);
      stroke(this.darkTextColor);
      line(theX, y+h-35, theX, y+h-25);
    }
    
    strokeWeight(1);
    stroke(this.darkTextColor);
    line(x, y+h, x+w, y+h);
  }

  //cut viene desde 0
  drawCut(cut, x, y) {
       
    if (cut) {
      
      //Imagenes de fondo
      imageMode(CORNER);
      simage(this.cutBannerImage, x, y);
      simage(this.cutBackground, x+152, y);
      
      //Textos del banner
      noStroke();
      fill(this.clearTextColor);
      textAlign(CENTER, BASELINE);
      
      stextFont(this.mainFont);
      textSize(30);
      text(cut.name, x+64, y+74);

      textSize(50);
      text(cut.average, x+64, y+136);

      stextFont(this.secondaryFont);
      textSize(20);
      text(cut.percentage, x+64, y+180);
       
      // Separadores horizontales
      strokeWeight(1);
      stroke(this.darkTextColor);
      line(x+176, y+86, x+914 , y+86);
      line(x+176, y+160, x+914 , y+160);
      
      // Grupos de notas
      this.drawGroup(cut.groups[0], x+152, y+24);
      this.drawGroup(cut.groups[1], x+152, y+98);
      this.drawGroup(cut.groups[2], x+152, y+172);
    }
  }

  //cut y group vienen desde 0
  drawGroup(group, x, y) {
  
    //Nota del grupo
    noStroke();
    fill(this.darkTextColor);
    
    textAlign(CENTER, TOP);
    textSize(30);
    text(group.average, x + 24 + 24, y+22); // 22 = workaround for TOP 
    
    //Porcentaje del grupo
    textSize(20);
    textAlign(CENTER, BASELINE);
    text(group.percentage, x + 24 + 24, y + 50);
    
    //Nombre del grupo
    textSize(20);
    textLeading(20);
    textAlign(LEFT, TOP);
    text(group.name, x+84, y+24 - 10, 146, 50); //-10 = workaround TOP

    ////Dibuja cada cuadro de nota
    let firstX = 784;//x + 64 + this.maxGroupNameWidth + 20; 
    for (let n = 0; n < group.activities.length; n++) {
      this.drawActivity(group.activities[n], firstX + (52*n), y);
    }
  }

  drawActivity(note, x, y) {

    //Muestra la nota
    noStroke();
    textSize(14);
    fill(this.darkTextColor);
    textAlign(CENTER, CENTER);
    stextFont(this.secondaryFont);
    text(note.score, x + 20, y + 50 + 5);// 5 = workaround for CENTER 
    
    let per = note.score/5.0;
    this.drawProgressBar(x, y, 40, 40, 'vertical', per, 0.6);

    if ((mouseX/this.scl) >= x && (mouseX/this.scl) <= x+40) { 
      if ((mouseY/this.scl) >= y && (mouseY/this.scl) <= y+40) { 
        this.activityIndicator = new ClickIndicator(x, y, 40, 40, ['Activity', note, ]);
      }
    }
  }


  addToStatusBar(message) {
    this.statusBar += '\t|\t'+message;
  }

  getGradeColor(val) {
    if (val >= 5.0) {
      return '#00CCCC';
    } else if (val >= 4.0) {
      return this.mainColor;
    } else if (val >= 3.0) {
      return this.secondaryColor;
    } else {
      return '#CC0000';
    }
  }

  getGradeLeagueName(val) {
    if (val >= 5.0) {
      return 'Diamante';
    } else if (val >= 4.0) {
      return 'Oro';
    } else if (val >= 3.0) {
      return 'Plata';
    } else {
      return 'Bronce';
    }
  }

  hideLogin() {
    //this.courseSelect = createSelect('Seleccione su curso');
    this.courseSelect.value('');
    this.courseSelect.hide();
    this.idInput.value(''); 
    this.idInput.hide();
    this.loginButton.hide();
    this.loginErrorMessage = '';
  }

  hideLogout() {
    this.logoutButton.hide();
  }

  updateScale() {
    this.scl = windowWidth/this.myWidth;
  }
}

function simage(img, x, y, w, h) {
  if (img) {
    if (w && h) {
      image(img, x, y, w, h);
    } else {
      image(img, x, y);
    }
  }
}

function stextFont(font) {
  if (font) {
    textFont(font);
  }
}

function isMobile() { 
  return (window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function windowResized() {
  view.updateScale();
  resizeCanvas(windowWidth, max(view.myHeight*view.scl, windowHeight));
}

// Clases gráficas //
class ClickIndicator {
  constructor(x, y, w, h, data) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.data = data;
  }

  display() {
    noFill();
    strokeWeight(3);
    stroke(view.secondaryColor);
    rect(this.x, this.y, this.w, this.h, 3);
  }
}

class ActivityDetail {
  constructor(x, y, activity) {
    this.x = x;
    this.y = y;
    this.xi = x;
    this.yi = y;
    this.activity = activity;
    this.myColor = view.mainColor;
    this.opacity = 0;
  }

  display() {

    if (this.x + view.activityBackground.width > view.myWidth) {
      this.x = view.myWidth - view.activityBackground.width;
    }

    if (this.y + view.activityBackground.height > view.myHeight) {
      this.y = view.myHeight - view.activityBackground.height;
      this.myColor = view.clearTextColor;
    }

    tint(255, this.opacity);
    simage(view.activityBackground, this.x+20, this.y);
    tint(255, 255);
    
    let c = color(this.myColor);
    c.setAlpha(this.opacity);
    
    fill(c);
    c = color("#ff9933");
    c.setAlpha(this.opacity);
    stroke(c, this.opacity);
    strokeWeight(5);
    beginShape();
    vertex(this.xi+22, this.yi+2.5);
    vertex(this.xi, this.yi+10.5);
    vertex(this.xi+22, this.yi+18.5);
    endShape();
    
    c = color(view.darkTextColor);
    c.setAlpha(this.opacity);

    fill(c, this.opacity);
    stextFont(view.mainFont);
    noStroke();
    textSize(20);
    textAlign(CENTER, BASELINE);
    let myCenterX = this.x + 120;

    text(this.activity.name, this.x+30, this.y+30, 185, 25);

    stextFont(view.secondaryFont);
    textSize(16);
    text(this.activity.score + '\t\t' + this.activity.percentage, myCenterX, this.y+80);
    let perWidth = textWidth(this.activity.score);

    textSize(14);
    text(this.activity.comment, this.x+30, this.y+90+20, 180, 100);

    if (this.opacity < 300) {
      this.opacity+=50;
    }
  }
}

// Eventos //

function mouseClicked() {

  if (view.activityIndicator) {
    let x = view.activityIndicator.x;
    let y = view.activityIndicator.y;
    let w = view.activityIndicator.w;
    let activity = view.activityIndicator.data[1];
    view.activityDetail = new ActivityDetail(x + w, y, activity);
  } else {
    view.activityDetail = null;
  }
}
