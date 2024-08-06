document.getElementById('add-subject-btn').addEventListener('click', addSubject);
document.getElementById('generate-timetable-btn').addEventListener('click', generateTimetable);

let data = {};
let currentSemester = '';
let teacherAssignments = {};

function addSubject() {
    const semesterGroup = document.getElementById('semester-group');
    const semester = document.getElementById('semester').value;
    const subject = document.getElementById('subject').value;
    const teacher = document.getElementById('teacher').value;

    if (subject && teacher) {
        if (!data[semester]) {
            data[semester] = [];
        }
        data[semester].push({ subject, teacher });
        updateSubjectList(semester, subject, teacher);
        clearInputs();
    } else {
        alert('Please enter both subject and teacher.');
    }
}

function updateSubjectList(semester, subject, teacher) {
    const list = document.getElementById('subject-list');
    const listItem = document.createElement('li');
    listItem.textContent = `Semester: ${semester}, Subject: ${subject}, Teacher: ${teacher}`;
    list.appendChild(listItem);
}

function clearInputs() {
    document.getElementById('semester').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('teacher').value = '';
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateTimetable() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const slots = ["9-10", "10-11", "11-12", "12-1", "2-3", "3-4"];

    const timetableContainer = document.getElementById('timetables');
    timetableContainer.innerHTML = '';

    teacherAssignments = {};

    for (let semester in data) {
        const subjects = data[semester];
        let assignments = {};

        for (let day of days) {
            assignments[day] = {};
            let shuffledSubjects = shuffle([...subjects]);
            let subjectIndex = 0;

            for (let slot of slots) {
                let subject = shuffledSubjects[subjectIndex % shuffledSubjects.length];

                while (isTeacherAssigned(day, slot, subject.teacher)) {
                    subjectIndex++;
                    subject = shuffledSubjects[subjectIndex % shuffledSubjects.length];
                }

                assignments[day][slot] = { subject: subject.subject, teacher: subject.teacher };
                assignTeacher(day, slot, subject.teacher);
                subjectIndex++;
            }
        }

        // Display timetable for the current semester
        displayTimetable(semester, assignments);
    }
}

function isTeacherAssigned(day, slot, teacher) {
    return teacherAssignments[`${day}-${slot}`] && teacherAssignments[`${day}-${slot}`].includes(teacher);
}

function assignTeacher(day, slot, teacher) {
    const key = `${day}-${slot}`;
    if (!teacherAssignments[key]) {
        teacherAssignments[key] = [];
    }
    teacherAssignments[key].push(teacher);
}

function displayTimetable(semester, assignments) {
    const timetableContainer = document.getElementById('timetables');
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container';

    const table = document.createElement('table');
    table.className = 'semester-timetable';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Day/Slot</th>
        <th>9-10</th>
        <th>10-11</th>
        <th>11-12</th>
        <th>12-1</th>
        <th>2-3</th>
        <th>3-4</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let day of Object.keys(assignments)) {
        let row = document.createElement('tr');
        let dayCell = document.createElement('td');
        dayCell.textContent = day;
        row.appendChild(dayCell);

        for (let slot of ["9-10", "10-11", "11-12", "12-1", "2-3", "3-4"]) {
            let slotCell = document.createElement('td');
            if (assignments[day] && assignments[day][slot]) {
                let { subject, teacher } = assignments[day][slot];
                slotCell.textContent = `${subject} (${teacher})`;
            }
            row.appendChild(slotCell);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);

    const semesterTitle = document.createElement('h3');
    semesterTitle.textContent = `Timetable for ${semester}`;
    tableContainer.appendChild(semesterTitle);
    tableContainer.appendChild(table);
    timetableContainer.appendChild(tableContainer);
}
