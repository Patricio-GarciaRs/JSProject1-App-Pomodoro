const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;

const bAdd = document.querySelector('#bAdd')
const itTask = document.querySelector('#itTask')
const form = document.querySelector('#form')
const taskName = document.querySelector('#time #taskName');
const upperMsg = document.querySelector('#time #upperMsg');
let breakActive = false;

renderTime();
renderTasks();

form.addEventListener('submit', e => {
    e.preventDefault();
    if(itTask.value !== ''){
        createTask(itTask.value);
        itTask.value = '';
        renderTasks();
    }
});

function createTask(value) {

    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        title: value,
        completed: false,
    };

    tasks.unshift(newTask);
}

function renderTasks () {
    const html = tasks.map(task => {
        return `
                <div class="task row mb-3 data-id="${task.id}">
                    <div class="completed col-2 order-last">${
                        task.completed
                        ? `<button class="done" data-id="${task.id}">Done</button>`
                        : `<button class="startBtn" data-id="${task.id}">Start</button>`
                    }</div>
                    <div class="title col order-first">${task.title}</div>
                </div>
        `;
    });
    const taskContainer = document.querySelector("#tasks");
    taskContainer.innerHTML = html.join("")
    const startBtns = document.querySelectorAll('.task .startBtn');

    startBtns.forEach(button => {
        button.addEventListener('click', e =>{
            if(!breakActive && !timer){
                const id = button.getAttribute('data-id');
                startBtnHandler(id);
                button.textContent = 'In progress...'
            }
        })
    })
    const deleteBtns = document.querySelectorAll('.task .done');

    deleteBtns.forEach(button => {
        button.addEventListener('click', e =>{
            const id = button.getAttribute('data-id');
            removeTaskById(id)
        })
    })
}

function removeTaskById(id){
    const taskToDelete = tasks.findIndex(task => task.id === id)
    tasks.splice(taskToDelete, 1);
    renderTasks();
}

function startBtnHandler(id){
    time = 5;
    current = id;
    const taskIndex = tasks.findIndex(task => task.id === id);
    taskName.textContent = tasks[taskIndex].title;
    upperMsg.textContent = 'Focus'

    timer = setInterval(() =>{
        timeHandler(id);
    }, 1000);
}

function timeHandler(id){
    time--;
    renderTime();

    if(time === 0){
        clearInterval(timer);
        markCompleated(id);
        timer = null;
        renderTasks();
        startBreak();
    }
}

function startBreak(){
    time = 5;
    taskName.textContent = '';
    upperMsg.textContent = 'Break';
    breakActive = true;
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
}

function timerBreakHandler(){
    time--;
    renderTime();

    if(time === 0){
        clearInterval(timerBreak);
        current = null;
        timerBreak = null;
        upperMsg.textContent = '';
        breakActive = false;
        renderTasks();
    }
}

function renderTime(){
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds <10 ? "0" : ""}${seconds}`;
}

function markCompleated(id){
    const taskIndex = tasks.findIndex((task) => task.id === id);
    tasks[taskIndex].completed = true;
}