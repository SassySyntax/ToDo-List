/* START -- var declarations */
const arrMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const arrDefault = [
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

let activeListItem = "";
/* END -- var declarations */



/* START -- data persistence functions (C.R.A.P.) */
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
        if (item.id === id) {
            item[key] = newVal;
            localStorage.setItem("toDo", JSON.stringify(toDo));
        }
    });
}

function purge(id) {
    if (typeof id !== "number") { 
        id = parseInt(id); 
    }
    for (let item in toDo) {
        if (toDo[item].id === id) {
            toDo.splice(toDo.indexOf(toDo[item]), 1);
            document.getElementById(id).remove();
            localStorage.setItem("toDo", JSON.stringify(toDo));
        }
    }
}
/* END -- data persistence functions (C.R.A.P.) */



/* START -- event listeners */
const ul_toDo = document.getElementById("toDo-list");
//insert dynamic elm event listener here?

const btn_submit = document.getElementById("submit");
btn_submit.onclick = function () { //create
    submitTask();
}

const btn_checkAll = document.getElementById("check-all");
btn_checkAll.onclick = function () { //alter
    for (let task in toDo) {
        if (toDo[task].completed === false) {
            toDo[task].completed = true;
            document.getElementById(toDo[task].id).classList.add("task-done");
        }
    }
    return localStorage.setItem("toDo", JSON.stringify(toDo));
}

const btn_uncheckAll = document.getElementById("uncheck-all");
btn_uncheckAll.onclick = function () { //alter
    for (let task in toDo) {
        if (toDo[task].completed === true) {
            toDo[task].completed = false;
            document.getElementById(toDo[task].id).classList.remove("task-done");
        }
    }
    return localStorage.setItem("toDo", JSON.stringify(toDo));
}

const btn_clearCompleted = document.getElementById("clear-completed");
btn_clearCompleted.onclick = function () { //purge completed
    let arrIds = [];
    for (let task in toDo) {
        if (toDo[task].completed === true) {
            arrIds.push(toDo[task].id);
        }
    }
    return arrIds.forEach(id => { purge(id); });
}

const btn_clearAll = document.getElementById("clear-all");
btn_clearAll.onclick = function () { //purge all
    while (ul_toDo.childNodes.length > 0) {
        ul_toDo.removeChild(ul_toDo.childNodes[0]);
    }
    toDo = [];
    return localStorage.removeItem("toDo");
}


document.onclick = function (event) {
    //code inspired by link:
    //https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript 
    const elm = event.target;

    if (elm.isContentEditable === true) {
        const parent = elm.closest("li");
        activeListItem = parent.id;
    }

    if (elm.isContentEditable === false && activeListItem != "") {
        const taskElm = document.getElementById(activeListItem).getElementsByClassName("name")[0];
        const str = taskElm.textContent.trim();
        if (str.length === 0) {
            return document.getElementById("warning").style.opacity = 1;
        }
        const newKey = "name";
        alter(activeListItem, newKey, str);
        taskElm.innerHTML = str;
        return activeListItem = "";
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

    if(elm.classList.contains("trash")) {
        const parent = elm.closest("li");
        return purge(parent.id);
    }
}

document.addEventListener("keydown", event => {
    const activeElm = document.activeElement;

    if (document.getElementById("task-input") === activeElm || activeElm.classList.contains("name")) {
        document.getElementById("warning").style.opacity = 0; //disable warning
    }

    if (event.key === "Enter" && activeElm === document.getElementById("task-input")) {
        submitTask();
    }

    if (event.key === "Enter" && activeElm.classList.contains("name")) {
        let str = activeElm.textContent.toString();
            str = str.trim();
            console.log(str);
        if (str != "") {
            const parent = activeElm.closest("li");
            alter(parent.id, "name", str);
            activeElm.innerHTML = str;
            activeElm.blur();
            event.preventDefault();
        } else if (str === "") {
            event.preventDefault();
            document.getElementById("warning").style.opacity = 1;
        }
    }

});
/* END -- event listeners */



/* START -- functions */
function generateId() {
    let newId = "";
    if (toDo.length === 0) {
        newId = 1;
        return;
    } else {
        for (item in toDo) {
            while(newId === item || newId === "") {
                return newId = Math.floor(Math.random() * 10000000);
            }
        }
    }
}

function submitTask() {
    const inputElm = document.getElementById("task-input");
    let str = inputElm.value.toString();
        str = str.trim();
    if (str.length != 0) {
        create(str);
        inputElm.value = null;
    } else {
        document.getElementById("warning").style.opacity = 1;
        inputElm.value = null;
    }
}

function appendTaskDOM(id, name, completed) {
    let taskDOM = document.createElement("li");
        taskDOM.id = id;
        taskDOM.className = "task";
        taskDOM.innerHTML = `
            <span class="name" contenteditable="true">${name}</span>
            <i class="fas fa-trash trash"></i>
            <i class="fas fa-check check"></i>
            `;
    if (completed === true) { 
        taskDOM.classList.add("task-done");
    }
    document.getElementById("toDo-list").insertBefore(taskDOM, document.getElementById("toDo-list").childNodes[1]);
}

function formatDateHeader() {
    const today = new Date();
    const str = arrMonth[today.getMonth()] + " " + today.getDate().toString() + ", " + today.getFullYear().toString();
    return str;
}
/* END -- functions */



/* INIT */

if (!localStorage.toDo || localStorage.toDo === "[]") {
    localStorage.setItem("toDo", JSON.stringify(arrDefault));
}
let toDo = JSON.parse(localStorage.toDo);

read();

document.getElementById("date").innerHTML = formatDateHeader();