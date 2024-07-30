document.getElementById('add-subject-btn').addEventListener('click', addSubject);
document.getElementById('generate-timetable-btn').addEventListener('click', generateTimetable);

let data = {};
let currentSemester = '';

function addSubject() {
    const semesterGroup = document.getElementById('semester-group');
    const semester = document.getElementById('semester').value;
    const subject = document.getElementById('subject').value;
    const teacher = document.getElementById('teacher').value;

    if (subject && teacher) {
        if (!currentSemester) {
            if (semester) {
                currentSemester = semester;
                semesterGroup.style.display = 'none';
            } else {
                alert('Please enter the semester.');
                return;
            }
        }

        if (!data[currentSemester]) {
            data[currentSemester] = [];
        }
        data[currentSemester].push({ subject, teacher });
        updateSubjectList(currentSemester, subject, teacher);
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

    const timetable = document.querySelector('#timetable tbody');
    timetable.innerHTML = '';

    let assignments = {};
    for (let semester in data) {
        let subjects = data[semester];

        assignments[semester] = {};
        
        for (let day of days) {
            assignments[semester][day] = {};
            let shuffledSubjects = shuffle([...subjects]); // Randomize subjects for each day
            let subjectIndex = 0;
            
            for (let slot of slots) {
                let subject = shuffledSubjects[subjectIndex % shuffledSubjects.length];

                // Ensure no teacher is assigned to multiple slots at the same time across different semesters
                while (isTeacherAssigned(assignments, day, slot, subject.teacher)) {
                    subjectIndex++;
                    subject = shuffledSubjects[subjectIndex % shuffledSubjects.length];
                }

                assignments[semester][day][slot] = { subject: subject.subject, teacher: subject.teacher };
                subjectIndex++;
            }
        }
    }

    for (let semester in assignments) {
        for (let day of days) {
            let row = document.createElement('tr');
            let dayCell = document.createElement('td');
            dayCell.textContent = day;
            row.appendChild(dayCell);

            for (let slot of slots) {
                let slotCell = document.createElement('td');
                if (assignments[semester][day] && assignments[semester][day][slot]) {
                    let { subject, teacher } = assignments[semester][day][slot];
                    slotCell.textContent = `${subject} (${teacher})`;
                }
                row.appendChild(slotCell);
            }
            timetable.appendChild(row);
        }
    }
}

function isTeacherAssigned(assignments, day, slot, teacher) {
    for (let semester in assignments) {
        if (assignments[semester][day] && assignments[semester][day][slot] && assignments[semester][day][slot].teacher === teacher) {
            return true;
        }
    }
    return false;
}
