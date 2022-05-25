function addDataForm(index, student) {  //student table
    const tableBody = document.getElementById('tableBody')
    let row = document.createElement('tr')
    let cell = document.createElement('th')
    cell.setAttribute('scope', 'row')

    //index
    cell.innerHTML = index
    row.appendChild(cell)

    //name
    cell = document.createElement('td')
    cell.innerHTML = `${student.name} ${student.surname}`
    row.appendChild(cell)

    //image
    cell = document.createElement('td')
    let someDiv = document.createElement('div')
    cell.append(someDiv)
    let img = document.createElement('img')
    someDiv.append(img)
    img.setAttribute('src', student.image)
    img.style.height = '200px'
    img.classList.add('img-thumbnail')
    row.appendChild(someDiv)

    //description
    cell = document.createElement('td')
    cell.innerHTML = student.description
    row.appendChild(cell)

    //edit
    cell = document.createElement('td')
    let edit = document.createElement('button')
    edit.classList.add('btn')
    edit.classList.add('btn-warning')
    edit.setAttribute('type', 'button')
    edit.innerText = 'edit'
    edit.addEventListener('click', (e)=>{
        showAddDataPage()
        fillData(student)
        e.stopPropagation();

        document.getElementById('addButton').setAttribute('hidden', 'hidden')
        document.getElementById('editButton').removeAttribute('hidden')
    })
    cell.appendChild(edit)
    row.appendChild(cell)

    //delete
    cell = document.createElement('td')
    let button = document.createElement('button')
    button.classList.add('btn')
    button.classList.add('btn-danger')
    button.setAttribute('type', 'button')
    button.innerText = 'delete'
    button.addEventListener('click', (e)=>{
        let cf = confirm(`Delete student named ${student.name} ?`)
        if(cf) {
            deleteStudent(student.id)
        }
        e.stopPropagation();
    })
    cell.appendChild(button)
    row.appendChild(cell)

    row.addEventListener('click', ()=>{
        showEachStuPage()
        addStudentData(student)
    })

    tableBody.appendChild(row)
}
function addStudentList(students) { //add student array to student table
    let count = 1
    const tableBody = document.getElementById('tableBody')
    tableBody.innerHTML = '' //ลบข้อมูลเก่าที่showออกก่อน
    for (let stu of students) {
        addDataForm(count++, stu)
    }
}
function showAllStudents() { //show all on table
    fetch('https://dv-student-backend-2019.appspot.com/students')
    .then((response) => {
        return response.json()
    }).then(data => {
        addStudentList(data)
    })
}

//show 1 student
function addStudentData(student){ 
    let idElem = document.getElementById('id')
    idElem.innerHTML = student.id
    let studentIdElem = document.getElementById('studentId')
    studentIdElem.innerHTML = student.studentId
    let nameElem = document.getElementById('name')
    nameElem.innerHTML = `${student.name} ${student.surname}`
    let gpaElem = document.getElementById('gpa')
    gpaElem.innerHTML = student.gpa
    let profileElem = document.getElementById('image')
    profileElem.setAttribute('src', student.image)
}

//search
document.getElementById('searchButton').addEventListener('click', () => { 
    let id = document.getElementById('inputText').value
    console.log(id)
    fetch(`https://dv-student-backend-2019.appspot.com/student/${id}`)
    .then(response => {
        return response.json()
    }) 
    .then(student => {
        console.log(student)
        showEachStuPage()
        addStudentData(student)
    })
})

//post function
function addStudentToDB(student) { 
    fetch('https://dv-student-backend-2019.appspot.com/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    }).then(response => {
        return response.json()
    }).then(data => {
        console.log('success', data)
        showAllStudents()
        addStudentData(data)
    })
}
//delete function
function deleteStudent(id) { 
    fetch(`https://dv-student-backend-2019.appspot.com/student/${id}`, {
        method: 'DELETE'
    }).then(response => {
        if(response.ok) {
            return response.json()
        } else {
            throw Error(response.statusText)
        }
    }).then(data => {
        alert(`student name ${data.name} is now delete`)
        showAllStudents()
    }).catch(error => {
        alert('your input student id is not in the database')
    })
}
//edit (put)
function editStudent(student) {
    fetch('https://dv-student-backend-2019.appspot.com/students', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    }).then(response => {
        return response.json()
    }).then(data => {
        console.log('edit success', data)
        showAllStudents()
        addStudentData(data)
    })
}

//click to post, edit
function onAddStudentClick(funcCallback) { 
    let student = {}
    student.id = document.getElementById('idStudent').value
    student.name = document.getElementById('nameInput').value
    student.surname = document.getElementById('surnameInput').value
    student.studentId = document.getElementById('studentIdInput').value
    student.gpa = document.getElementById('gpaInput').value
    student.image = document.getElementById('imageLinkInput').value
    //addStudentToDB(student)
    funcCallback(student)

    showEachStuPage()
    //addStudentData(student)
}
document.getElementById('addButton').addEventListener('click', ()=> onAddStudentClick(addStudentToDB))
document.getElementById('editButton').addEventListener('click', ()=> onAddStudentClick(editStudent))

//edit details
function fillData(student) {
    document.getElementById('idStudent').value = student.id
    document.getElementById('nameInput').value = student.name
    document.getElementById('surnameInput').value = student.surname
    document.getElementById('studentIdInput').value = student.studentId
    document.getElementById('gpaInput').value = student.gpa
    document.getElementById('imageLinkInput').value = student.image
}
function blank() {
    document.getElementById('idStudent').value = ''
    document.getElementById('nameInput').value = ''
    document.getElementById('surnameInput').value = ''
    document.getElementById('studentIdInput').value = ''
    document.getElementById('gpaInput').value = ''
    document.getElementById('imageLinkInput').value = ''
}

const singleStudentResult = document.getElementById('sinigle_student_result')
const listStudentResult = document.getElementById('output')
const addUserDetail = document.getElementById('addUserDetail')

function hideAll() {
    singleStudentResult.style.display = 'none'
    listStudentResult.style.display = 'none'
    addUserDetail.style.display = 'none'
}
function showAllPage() {
    hideAll()
    listStudentResult.style.display = 'block'
    showAllStudents()
}
function showEachStuPage() {
    hideAll()
    singleStudentResult.style.display = 'block'
}
function showAddDataPage() {
    hideAll()
    blank()
    addUserDetail.style.display = 'block'

    document.getElementById('addButton').removeAttribute('hidden')
    document.getElementById('editButton').setAttribute('hidden', 'hidden')
}

document.getElementById('allStudentMenu').addEventListener('click', () => showAllPage())
document.getElementById('serachMenu').addEventListener('click', () => showEachStuPage())
document.getElementById('addStudentMenu').addEventListener('click', () => showAddDataPage())


function onLoad() {
    //showAllStudents()
    hideAll()
}

window.addEventListener('load', onLoad)