/**
 * MODULE PATTERN
 */

var existStudent = [
    {}
]

//Local Storage
var LSController = (function () {

    return {
        storeData: function (data) {
            localStorage.setItem('data', JSON.stringify(data));
        },
        getData: function () {
            if (localStorage.getItem('data')) {
                return JSON.parse(localStorage.getItem('data'));
            }
            return {
                students: []
            }
        }
    }
}());

//Data
var dataControler = (function (Student, LSCtrl) {

    function convertStudentsData(studentsData) {
        // 'd' that mean 'student'
        var newData = studentsData.reduce((acc, d) => {
            var newStudent = new Student(d.code, d.name, d.cmnd, d.phone, d.email,
                d.scoreMath, d.scorePhysics, d.scoreChemistry);
            acc.push(newStudent);
            return acc;
        }, []);
        return newData;
    }

    function convertDataFromLS(data) {
        if (data.student !== []) {
            data.students = convertStudentsData(data.students);
        }
        return data;
    }

    function sortListStudentsByName(type) {
        var result = [];
        if (type == "az") {
            result = data.students.sort(function (a, b) {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                if (nameA > nameB) {
                    return 1;
                }
                if (nameA < nameB) {
                    return -1;
                }
                return 0;
            });
        } else if (type == 'za') {
            result = data.students.sort(function (a, b) {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                if (nameA > nameB) {
                    return -1;
                }
                if (nameA < nameB) {
                    return 1;
                }
                return 0;
            });
        }
        return result;
    }

    function sortListStudentsByScore(type) {
        var result = [];
        if (type == 'up') {
            result = data.students.sort(function (a, b) {
                var scoreA = a.calcAvg();
                var scoreB = b.calcAvg();
                return scoreA - scoreB;
            });
        } else if (type == 'down') {
            result = data.students.sort(function (a, b) {
                var scoreA = a.calcAvg();
                var scoreB = b.calcAvg();
                return scoreB - scoreA;
            });
        }
        return result;
    }

    var data = convertDataFromLS(LSCtrl.getData());

    return {
        addNewStudent: function (d) {
            var student = new Student(d.code, d.name, d.cmnd, d.phone, d.email,
                d.scoreMath, d.scorePhysics, d.scoreChemistry);

            data.students.push(student);
            //Store data in local storage
            LSCtrl.storeData(data);
        },
        addNewStudentInPosiTion: function (d, index) {
            var student = new Student(d.code, d.name, d.cmnd, d.phone, d.email,
                d.scoreMath, d.scorePhysics, d.scoreChemistry);

            data.students.splice(index, 0, student);
            //Store data in local storage
            LSCtrl.storeData(data);
        },
        deleteStudent: function (id) {
            var index = data.students.findIndex(cur => cur.code === id);
            data.students.splice(index, 1);
            //Store data in local storage
            LSCtrl.storeData(data);
            return index;
        },
        findStudent: function (id) {
            var index = data.students.findIndex(cur => cur.code === id);
            return data.students[index];
        },
        getStudentData: function () {
            return data.students;
        },
        getDataLS: function(){
            return convertDataFromLS(LSCtrl.getData());
        },
        getData: function () {
            return data;
        },
        searchStudents: function (value) {
            var result = data.students.reduce((acc, cur) => {
                if (cur.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                    acc.push(cur);
                }
                return acc;
            }, []);

            return result;
        },
        sortListStudents(value) {
            var result = [];
            if (value === 'sort-score-down') {
                result = sortListStudentsByScore('down');
            } else if (value === 'sort-score-up') {
                result = sortListStudentsByScore('up');
            } else if (value === 'sort-letter-az') {
                result = sortListStudentsByName('az');
            } else if (value === 'sort-letter-za') {
                result = sortListStudentsByName('za');
            }
            return result;
        }
    }
}(Student, LSController));


//UI
var UIController = (function (Validation) {
    var DOMStrings = {
        studentCode: '#student-code',
        studentName: '#student-name',
        studentCMND: '#student-cmnd',
        studentPhone: '#student-phone',
        studentEmail: '#student-email',
        studentMathScore: '#score-math',
        studentPhysicsScore: '#score-physics',
        studentChemistryScore: '#score-chemistry',
        errorText: '.error-text',
        btnAdd: '#addBtn',
        btnUpdate1: '.updateBtn',
        btnUpdate2: '#updateBtn-2',
        btnSort: '#sortBtn',
        btnRemove: '.removeBtn',
        btnGroup: '.button-group',
        searchStudents: '#student-search',
        sortSelect: '#student-sort',
        listStudents: '#student__list'
    }

    function getInputValue(selector) {
        return document.querySelector(selector).value;
    }

    function clearAllFields(arr) {
        arr.forEach(cur => {
            document.querySelector(cur).value = '';
        });
    }

    function createStudent(student, count) {
        return `
        <tr class="student__item" data-id="${student.code}">
        <th scope="row">${count}</th>
        <td>${student.code}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.cmnd}</td>
        <td>${student.phone}</td>
        <td>${student.calcAvg()}</td>
        <td>${student.rankStudent()}</td>
        <td class="student__item-btns">
            <i class="fa fa-trash-alt removeBtn"></i>
            <i class="fa fa-pencil-alt updateBtn"></i>
        </td>
        </tr>
        `;
    }

    return {
        getDOMStrings: function () {
            return DOMStrings;
        },
        validationForm: function () {
            var validation = new Validation();
            var valid = true;
            valid &= validation.checkEmpty(DOMStrings.studentCode, 'Mã sinh viên')
                & validation.checkEmpty(DOMStrings.studentName, 'Tên sinh viên')
                & validation.checkEmpty(DOMStrings.studentCMND, 'Số CMND')
                & validation.checkEmpty(DOMStrings.studentPhone, 'Số điện thoại')
                & validation.checkEmpty(DOMStrings.studentEmail, 'Email')
                & validation.checkEmpty(DOMStrings.studentMathScore, 'Điểm số')
                & validation.checkEmpty(DOMStrings.studentPhysicsScore, 'Điểm số')
                & validation.checkEmpty(DOMStrings.studentChemistryScore, 'Điểm số')
                & validation.checkAllNumbers(DOMStrings.studentCMND, 'Số CMND')
                & validation.checkAllNumbers(DOMStrings.studentPhone, 'Số điện thoại')
                & validation.checkEmail(DOMStrings.studentEmail, 'Email')
                & validation.checkMinMaxNumber(DOMStrings.studentMathScore, 'Điểm số', 0, 10)
                & validation.checkMinMaxNumber(DOMStrings.studentPhysicsScore, 'Điểm số', 0, 10)
                & validation.checkMinMaxNumber(DOMStrings.studentChemistryScore, 'Điểm số', 0, 10);

            return !!valid;
        },
        getInput: function () {
            return {
                code: getInputValue(DOMStrings.studentCode),
                name: getInputValue(DOMStrings.studentName),
                cmnd: getInputValue(DOMStrings.studentCMND),
                phone: getInputValue(DOMStrings.studentPhone),
                email: getInputValue(DOMStrings.studentEmail),
                scoreMath: parseFloat(getInputValue(DOMStrings.studentMathScore)),
                scorePhysics: parseFloat(getInputValue(DOMStrings.studentPhysicsScore)),
                scoreChemistry: parseFloat(getInputValue(DOMStrings.studentChemistryScore))
            }
        },
        clearFields: function () {
            clearAllFields([DOMStrings.studentCode, DOMStrings.studentName, DOMStrings.studentCMND,
            DOMStrings.studentPhone, DOMStrings.studentEmail, DOMStrings.studentMathScore, DOMStrings.studentPhysicsScore,
            DOMStrings.studentChemistryScore]);

            document.querySelector(DOMStrings.studentCode).focus();
        },
        displayStudents: function (studentsData) {
            var list = document.querySelector(DOMStrings.listStudents);
            list.innerHTML = '';
            var count = 1;
            studentsData.forEach(student => {
                var markup = createStudent(student, count);
                count++;
                list.insertAdjacentHTML('beforeend', markup);
            });
        },
        updateStudent: function (student) {
            document.querySelector(DOMStrings.btnGroup).classList.add('update');

            document.querySelector(DOMStrings.studentCode).value = student.code;
            document.querySelector(DOMStrings.studentName).value = student.name;
            document.querySelector(DOMStrings.studentCMND).value = student.cmnd;
            document.querySelector(DOMStrings.studentPhone).value = student.phone;
            document.querySelector(DOMStrings.studentEmail).value = student.email;
            document.querySelector(DOMStrings.studentMathScore).value = student.scoreMath;
            document.querySelector(DOMStrings.studentPhysicsScore).value = student.scorePhysics;
            document.querySelector(DOMStrings.studentChemistryScore).value = student.scoreChemistry;
        },
        getSortSelectValue: function () {
            return document.querySelector(DOMStrings.sortSelect).value;
        }
    }
}(Validation));

/**
 * STATE
 */
var state = {};

//Main Controler
var controler = (function (dataCtrl, UICtrl) {
    var DOM = UICtrl.getDOMStrings();
    function setupEventListeners() {
        document.querySelector(DOM.btnAdd).addEventListener('click', addStudent);
        document.querySelector(DOM.listStudents).addEventListener('click', function (e) {
            e.preventDefault();
            if (e.target.matches(DOM.btnRemove)) {
                //Remove item
                var id = e.target.closest('.student__item').dataset.id;
                removeStudent(id);

            } else if (e.target.matches(DOM.btnUpdate1)) {
                //Update item
                var id = e.target.closest('.student__item').dataset.id;
                updateStudent(id);
            }
        });
        //Btn update click event & get data from UI and store in Data structure
        document.querySelector(DOM.btnUpdate2).addEventListener('click', function (e) {
            e.preventDefault();
            addStudentsInPosition(state.indexUpdate);
        });

        //Search students
        document.querySelector(DOM.searchStudents).addEventListener('keyup', searchStudents);

        //Sort students
        document.querySelector(DOM.btnSort).addEventListener('click', sortStudents);
    }

    function sortStudents(e) {
        e.preventDefault();
        //Get value from select tag
        var value = UICtrl.getSortSelectValue();

        if (value) {
            //Case 5:
            if (value == 'sort-normal') {
                //Normal
                //Get data from LS
                var data = dataCtrl.getDataLS();
                UICtrl.displayStudents(data.students);
            } else {
                //Sort in data structure and return result (case 2, 3, 4, 5)
                var result = dataCtrl.sortListStudents(value);
                //Display result in UI
                UICtrl.displayStudents(result);
            }
        }
    }

    function searchStudents() {
        var value = document.querySelector(DOM.searchStudents).value.trim();
        if (value !== '') {
            //Search students in data structure and return result
            var result = dataCtrl.searchStudents(value);
            //Display result in UI
            if (result) {
                UICtrl.displayStudents(result);
            }
        } else {
            displayStudentsData();
        }
    }

    function removeStudent(id) {
        //Delete from data structure
        dataCtrl.deleteStudent(id);

        //Get data and display in UI
        displayStudentsData();
    }

    function updateStudent(id) {
        //Get student and display in UI
        var student = dataCtrl.findStudent(id);
        UICtrl.updateStudent(student);
        state.indexUpdate = dataCtrl.deleteStudent(id);
    }

    function addStudent(e) {
        e.preventDefault();

        if (UICtrl.validationForm()) {

            //Form is valid
            //1. Get input from UI
            var inputData = UICtrl.getInput();
            //Clear fields
            UICtrl.clearFields();
            //2.Store and calculate in data structure
            dataCtrl.addNewStudent(inputData);

            //3. Get data and display in UI
            displayStudentsData();
        } else {
            alert('Dữ liệu không hợp lệ');
        }
    }
    function addStudentsInPosition(index) {
        // console.log(UICtrl.validationForm());
        if (UICtrl.validationForm()) {

            //Form is valid
            //1. Get input from UI
            var inputData = UICtrl.getInput();
            //Clear fields
            UICtrl.clearFields();
            //2.Store and calculate in data structure
            dataCtrl.addNewStudentInPosiTion(inputData, index);

            //3. Get data and display in UI
            displayStudentsData();

            //4. Toggle btn
            document.querySelector(DOM.btnGroup).classList.remove('update');
        } else {
            console.log('NO');
            alert('Dữ liệu cập nhật không hợp lệ');
        }
    }

    function displayStudentsData() {
        //1. Get data from LS
        var studentsData = dataCtrl.getStudentData();
        //2. Display data in UI
        UICtrl.displayStudents(studentsData);
    }

    return {
        init: function () {
            setupEventListeners();
            displayStudentsData();
        }
    }
}(dataControler, UIController));

controler.init();
