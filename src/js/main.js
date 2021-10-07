"use strict"

//Varliables
let coursesEl = document.getElementById("courses");
let addCourseBtn = document.getElementById("addCourse");
let updateCourseBtn = document.getElementById("updateCourse");
let codeEl = document.getElementById("coursecode");
let nameEl = document.getElementById("coursename");
let progressionEl = document.getElementById("courseprogression");
let syllabusEl = document.getElementById("coursesyllabus");
let formheaderEl = document.getElementById("formheader");

let idHolder = "";

//Eventlisteners
window.addEventListener('load', getCourses);
addCourseBtn.addEventListener('click',createCourse);
updateCourseBtn.addEventListener('click',updateCourse);

//Functions

//function to get courses
function getCourses() {

    coursesEl.innerHTML = '';

    coursesEl.innerHTML +=
    `<div class="courseWrapper">
        <div class="col1">
            <b>Kod:</b>
        </div>
        <div class="col2">
            <b>Kurs namn:</b> 
        </div>
        <div class="col3">
            <b>Progression:</b>
        </div>
        <div class="col4">
            <b>Kursplan:</b>
        </div>
    </div>
    `;


    fetch('http://localhost/moment5ws/api')
    .then(response => response.json())
    .then(data => {
        data.forEach(course => {
            coursesEl.innerHTML +=
            `<div class="courseWrapper">
                <div class="col1">
                    ${course.code}
                </div>
                <div class="col2">
                    ${course.name}
                </div>
                <div class="col3">
                    ${course.progression}
                </div>
                <div class="col4">
                    <a href="${course.syllabus}">Länk</a>
                </div>
                <div class="col5">
                    <button id="${course.id}" class="btn_del" onClick="deleteCourse(${course.id})">Radera</button><br>
                    <button id="${course.id}" class="btn_update" onClick="setFormCourse(${course.id})">Ändra</button>
                </div>
            </div>`;
            
        });
    })

}

//function to delete a specific course
function deleteCourse(id) {

    fetch('http://localhost/moment5ws/api?id=' + id, {
        method: 'DELETE',
    })
    .then(response => response.text())
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.log('Error: ', error);
    })
}

//function to create a course
function createCourse() {

    let code = codeEl.value;
    let name = nameEl.value;
    let progression = progressionEl.value;
    let syllabus = syllabusEl.value;

    let conCourse = {'code': code, 'name': name, 'progression': progression, 'syllabus': syllabus};
    
    fetch('http://localhost/moment5ws/api', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(conCourse),
    })
    .then(response => response.text())
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.log('Error: ', error);
    })
}

//function to populate the form when "Ändra" is pushed next to a course
function setFormCourse(id){

    addCourseBtn.style.display = 'none';
    updateCourseBtn.style.display = 'block';
    formheaderEl.innerHTML = "Ändra kurs";

    idHolder = id;

    fetch('http://localhost/moment5ws/api?id=' + id)
    .then(response => response.json())
    .then(data => {
        data.forEach(course => {
            codeEl.value = course.code;
            nameEl.value = course.name;
            progressionEl.value = course.progression;
            syllabusEl.value = course.syllabus;
                        
        });
    })
}

//fucntion to update a course with new data
function updateCourse(){

    let code = codeEl.value;
    let name = nameEl.value;
    let progression = progressionEl.value;
    let syllabus = syllabusEl.value;
    
    let conCourse = {'id': idHolder, 'code': code, 'name': name, 'progression': progression, 'syllabus': syllabus};
    console.log(conCourse);
    fetch('http://localhost/moment5ws/api?id=' + idHolder, {
        method: 'PUT',
        body: JSON.stringify(conCourse),
    })
    .then(response => response.text())
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.log('Error: ', error);
    })
}