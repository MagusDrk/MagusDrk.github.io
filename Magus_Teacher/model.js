/*Clases que contienen el modelo del mundo del programa*/

class Activity {
  constructor(name, score) {
    this.name = name;
    this.score = score;
    this.comment = "";//"<No hay comentarios disponibles>";
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
  
  constructor(name, group, semester, credits, maxAbsences, average, teacher, teacherMail, cutConfig) {
    this.name = name;
    this.group = group;
    this.semester = semester;
    this.credits = credits;
    this.maxAbsences = maxAbsences;
    this.average = average;
    this.teacher = teacher;
    this.teacherMail = teacherMail;
    this.cutConfig = cutConfig;
    this.graph = [0, 0, 0, 0, 0, 0, ];
    this.students = [];
    this.studentsCount = 0;
  }

  getStudent(studentId) {
    for (let s = 0; s < this.students.length; s++) {
      if (this.students[s].id == studentId) {
        return this.students[s];
      }
    }
    view.setError('ERROR: Estudiante no encontrado. '+
      'Por favor, revise el que el código ingresado sea el correcto, no ingrese los ceros de la izquierda.');
  }
}

class Model {
  constructor() {
    this.course = null;
    this.student = null;
    this.courseList = [];
  }

  createCurse(data) {

    let f = 0;
    let name = data[f][0];
    f++;
    let semester = data[f][1]; 
    f++;
    let group = data[f][1];
    f++;
    let credits = data[f][1]; 
    f++; 
    let maxAbsences = int(data[f][1]); 
    f++;
    let average = float(data[f][1].replace(',', '.')).toFixed(1); 
    f++;
    let teacher = data[f][1]; 
    f++;
    let teacherMail = data[f][1]; 
    f++;

    
    let cutConfig = [];   
    for (let c = 1; c < data[f].length; c++) {    
      let t = data[f][c];
      let cut = {
        Nombre: t,
      };
      cutConfig.push(cut);
    }
    f++;
    
    while(data[f][0]){
      for (let c = 1; c < data[f].length; c++) {    
        cutConfig[c-1][''+data[f][0]] = data[f][c];
      }
      f++;
    }

    this.course = new Course(name, group, semester, credits, maxAbsences, average, teacher, teacherMail, cutConfig);
  }

  createStudents(data) {

    for (let f = 1; f < data.length; f++) {

      let col = 0;
      
      let id = data[f][col];
      col++;
      let names = data[f][col];
      col++;
      let lastnames = data[f][col];
      col++;
      let email = data[f][col];
      col++;
      let program = data[f][col];
      col++;

      // Me salto algunas columnas que no necesito por ahora
      col++;
      col++;
      col++;

      let grade = float(data[f][col].replace(',', '.')).toFixed(1);
      col++;
      
      let target = float(data[f][col].replace(',', '.')).toFixed(1);
      col++;
      
      let absences = int(data[f][col]);
      col++;
      
      let aStudent = new Student(id, names, lastnames, email, program, grade, target, absences);

      for (let c = 0; c < this.course.cutConfig.length; c++) {
        let cutInfo = this.course.cutConfig[c];
        let name = cutInfo.Nombre;
        let average = float(data[f][c+5].replace(',', '.')).toFixed(1);
        let percentage = cutInfo.Porcentaje;
        let cut = new Cut(name, average, percentage);
        aStudent.cuts.push(cut);
      }

      this.course.graph[int(grade)]++;    
      this.course.students.push(aStudent);
    }
    
    this.course.studentsCount = this.course.students.length;
    
    // determinar los puestos
    //Crea una lista con las notas diferentes existentes
    let notes = [];
    for (let i = 0; i < this.course.students.length; i++) {
      let theNote = this.course.students[i].grade;
      if(!notes.includes(theNote)){
        notes.push(theNote);
      }
    }
    //ordena de mayor a menor
    notes.sort((a, b) => (float(a) < float(b)) ? 1 : -1);
        
    //asigna a cada estudiante el puesto según se organizan las notas
    for (let i = 0; i < this.course.students.length; i++) {  
      let pos = notes.indexOf(this.course.students[i].grade);
      if(pos < 5){
        this.course.students[i].position = int(pos+1);
      } else if(pos < 10){
        this.course.students[i].position = '>5';
      } else {
        this.course.students[i].position = '>10';
      }
    }
  }

  addActivities(data, cut, group) {
    //data es una matriz con cada una de las celdas de la hoja de notas. Cada hoja de notas es un grupo
    

    let firstColumn = 4;
 
    for (let f = 1; f < data.length; f++) { 
      //Este ciclo se ejecuta para cada una de las filas de notas:
      
      // Se crea el grupo de notas del estudiante
      let keys = Object.keys(this.course.cutConfig[cut-1]);
      let gName = keys[group+1];
      let gAverage = float(data[f][3].replace(',', '.')).toFixed(1);
      let gPercentage = this.course.cutConfig[cut-1][gName];
      let aGroup = new ActivityGroup(gName, gAverage, gPercentage);
      
      //Se crea cada una de las actividades disponibles en la tabla
      if (group != 3) { //Si es el examen final, solo se carga una actividad
        for (let c = firstColumn; c < data[f].length; c++) {
          let aName = data[0][c];
          let aScore = float(data[f][c].replace(',', '.')).toFixed(1);
          let anActivity = new Activity(aName, aScore);
          aGroup.activities.push(anActivity);
        }
      } else { // si es la nota de parcial, toma la nota directamente de la columna principal
        let aName = gName;
        let aScore = float(data[f][3].replace(',', '.')).toFixed(1);
        let anActivity = new Activity(aName, aScore);
        aGroup.activities.push(anActivity);
      }

      //Se pone el % de cada actividad del grupo
      let gPerFloat = float(aGroup.percentage.replace('%', '')/100); 
      let indPer = gPerFloat/aGroup.activities.length;
      indPer = (indPer*100).toFixed(2);

      let individualPercentage = indPer+'%';
      for (let a = 0; a < aGroup.activities.length; a++) {
        aGroup.activities[a].percentage = individualPercentage;
      }

      //Se agrega el grupo al corte respectivo.
      let studentId = data[f][0];
      this.course.getStudent(studentId).cuts[cut-1].groups.push(aGroup);
    }
  }

  createModel(response) {
    let data = response.result.valueRanges;
    let page = '(desconocida)';
    try{
      page = 'Curso';
      this.createCurse(data[0].values);
      page = 'Notas';
      this.createStudents(data[1].values);
      page = 'Q&T 1';
      this.addActivities(data[2].values, 1, 1);
      page = 'Taller 1';
      this.addActivities(data[3].values, 1, 2);
      page = 'Parcial 1';
      this.addActivities(data[4].values, 1, 3);
      page = 'Q&T 2';
      this.addActivities(data[5].values, 2, 1);
      page = 'Taller 2';
      this.addActivities(data[6].values, 2, 2);
      page = 'Parcial 2';
      this.addActivities(data[7].values, 2, 3);
      page = 'Q&T 3';
      this.addActivities(data[8].values, 3, 1);
      page = 'Taller 3';
      this.addActivities(data[9].values, 3, 2);
      page = 'Parcial 3';
      this.addActivities(data[10].values, 3, 3);
      return true;
    } catch (err){
      view.setError('ERROR: La hoja \''+page+'\' no cuenta con el formato correcto. Por favor, comuníquese con el administrador del sistema para solucionar este incidente.');
      return false;
    }
    
  }

  loadStudent(id) {
    if (id == 'random') {
      this.student = this.course.students[int(random(this.course.students.length))];
      this.course.students = [];
    } else {
      this.student = this.course.getStudent(id);
      this.course.students = [];
    }
    return this.student;
  }
  
  clearStudent(){
    this.student = null;
  }
  
  getCourseFromList(url){
    for(let i = 0; i < this.courseList.length; i++){
      if(url == this.courseList[i].url){
        return this.courseList[i].name;
      }
    }
  }
}
