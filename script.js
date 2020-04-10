//START -- setup
const arrDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const arrMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const arrTest = [
    {
        id: 0,
        name: "Clean Surfaces",
        dateTimeCreated: "Mon Apr 06 2020 11:56:11 GMT+0200 (Central European Summer Time)",
        completed: false
    },
    {
        id: 1,
        name: "Marinate Chicken",
        dateTimeCreated: "Mon Apr 06 2020 11:56:11 GMT+0200 (Central European Summer Time)",
        completed: false
    }
]

if (!localStorage.toDo || localStorage.toDo == "[]") {
    localStorage.setItem("toDo", JSON.stringify(arrTest));
}

let toDo = JSON.parse(localStorage.toDo);

read();
document.getElementById("date").innerHTML = formatDateHeader();
//END -- setup



//START -- event listeners
document.onclick = function (event) {
    //code inspired by link:
    //https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript 
    const elm = event.target;

    if(elm.id == "submit") { //create
        const elmInput = document.getElementById("task-input");
        if (elmInput.value != "") {
            create(elmInput.value);
            elmInput.value = null;
        } else {
            document.getElementById("warning").style.opacity = 1;
        }
    }

    if(elm.classList.contains("check")) {
        const parent = elm.closest("li");
        const itemKey = "completed";
        if (parent.classList.contains("task-done")) {
            alter(parent.id, itemKey, false);
            document.getElementById(parent.id).classList.remove("task-done");
        } else {
            alter(parent.id, itemKey, true);
            document.getElementById(parent.id).classList.add("task-done");
        }
    }

    if(elm.id == "clear") {
        let arrIds = [];
        for (let task in toDo) {
            if (toDo[task].completed === true) {
                arrIds.push(toDo[task].id);
            }
        }
        arrIds.forEach(id => { purge(id); });
    }

    if(elm.id == "clear-all") {
        const list = document.getElementById("toDo-list");
        while (list.childNodes[2]) {
            list.removeChild(list.childNodes[2]);
        }
        toDo = [];
        localStorage.removeItem("toDo");
    }

    if(elm.id == "check-all") {
        for (let task in toDo) {
            if (toDo[task].completed === false) {
                toDo[task].completed = true;
                document.getElementById(toDo[task].id).classList.add("task-done");
            }
        }
        localStorage.setItem("toDo");
    }

    if(elm.classList.contains("trash")) {
        const parent = elm.closest("li");
        purge(parent.id);
    }
}

document.addEventListener("keydown", event => {
    const activeElm = document.activeElement;
    
    if (document.getElementById("task-input") == activeElm) {
        document.getElementById("warning").style.opacity = 0;
    }

    if (event.key === "Enter" && activeElm == document.getElementById("task-input")) {
        const inputElm = document.getElementById("task-input");
        if (inputElm == activeElm && inputElm.value != "") {
            create(inputElm.value);
            inputElm.value = null;
        }
    }

    if (event.key === "Enter" && activeElm.classList.contains("name")) {
        activeElm.blur();
        event.preventDefault();
    }

    if (activeElm.classList.contains("name")) {
        //code inspired by link:
        //https://www.samanthaming.com/tidbits/32-html-contenteditable/
        activeElm.addEventListener("input", function() {
            const parent = activeElm.closest("li");
            const itemKey = "name";
            const itemVal = activeElm.innerHTML;
            alter(parent.id, itemKey, itemVal);
        });
    }
});
//END -- event listeners



//START -- data persistence
function create(name) { 
    const id = generateId();
    const dateTimeCreated = new Date().toString();
    const task = {
        id,
        name,
        dateTimeCreated,
        "completed": false
    }
    toDo.push(task);
    localStorage.setItem("toDo", JSON.stringify(toDo));
    appendTaskDOM(id, name, dateTimeCreated, false);
}

function read() {
   for (let task in toDo) {
        const created = new Date(toDo[task].dateTimeCreated);
        appendTaskDOM(toDo[task].id, toDo[task].name, created, toDo[task].completed);
   }
}

function alter(id, key, newVal) {
    toDo.forEach(item => {
        if (item.id == id) {
            item[key] = newVal;
            localStorage.setItem("toDo", JSON.stringify(toDo));
        }
    });
}

function purge(id) {
    if (typeof id !== "number") { id = parseInt(id); }
    for (let item in toDo) {
        if (toDo[item].id == id) {
            toDo.splice(toDo.indexOf(toDo[item]), 1);
            document.getElementById(id).remove();
            localStorage.setItem("toDo", JSON.stringify(toDo));
        }
    }
}
//END -- data persistence



//START -- functions
function generateId() {
    let newId = "";
    if (toDo.length == 0) {
        newId = 1;
    } else {
        for (item in toDo) {
            while(newId === item || newId === "") {
            newId = Math.floor(Math.random() * 10000000);
            }
        }
    }
    return newId;
}

function appendTaskDOM(id, name, createdStr, completed) {
    const created = new Date(createdStr); 
    let taskDOM = document.createElement("li");
        taskDOM.id = id;
        taskDOM.className = "task";
        taskDOM.innerHTML = `
            <span class="name" contenteditable="true">${name}</span>
            <i class="fas fa-trash trash"></i>
            <i class="fas fa-check check"></i>
            `;
    if (completed == true) { taskDOM.classList.add("task-done"); }
    document.getElementById("toDo-list").insertBefore(taskDOM, document.getElementById("toDo-list").childNodes[2]);
}

function formatDateHeader() {
    const today = new Date();
    const str = arrMonth[today.getMonth()] + " " + today.getDate().toString() + ", " + today.getFullYear().toString();
    return str;
}
//END -- functions