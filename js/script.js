let tasks = [];

function createTaskElement(task, list) {
    const point = document.createElement("li");

    const box_with_sign = document.createElement("input");
    box_with_sign.type = "checkbox";
    box_with_sign.checked = task.done;

    box_with_sign.addEventListener("change", () => {
        point.classList.toggle("done", box_with_sign.checked);
        task.done = box_with_sign.checked;
        saveTasks();
    });

    const taskFull = document.createElement("span");
    taskFull.textContent = task.text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Редактировать";


    editBtn.addEventListener("click", () => {
        const inputEdit = document.createElement("input");
        inputEdit.type = "text";
        inputEdit.value = task.text;

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Сохранить";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Отмена";

        point.replaceChild(inputEdit, taskFull);

        editBtn.style.display = "none";
        point.insertBefore(saveBtn, deleteButton);
        point.insertBefore(cancelBtn, deleteButton);

        saveBtn.addEventListener("click", () => {
            const newText = inputEdit.value.trim();
            if (!newText) { inputEdit.focus(); return; }

            task.text = newText;
            taskFull.textContent = newText;
            saveTasks();

            point.replaceChild(taskFull, inputEdit);
            saveBtn.remove();
            cancelBtn.remove();
            editBtn.style.display = "";
        });

        inputEdit.addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveBtn.click();
            if (e.key === "Escape") cancelBtn.click();
        });


        cancelBtn.addEventListener("click", () => {
            point.replaceChild(taskFull, inputEdit);
            saveBtn.remove();
            cancelBtn.remove();
            editBtn.style.display = "";
        });

        inputEdit.focus();
        inputEdit.select();
    });


    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = 'Удалить'

    deleteButton.addEventListener("click", () => {
        point.remove();
        tasks = tasks.filter(t => t !== task);
        saveTasks();
    });

    point.append(box_with_sign, taskFull, editBtn, deleteButton);
    point.classList.toggle("done", task.done);

    list.append(point);
}


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
}


function test() {
    loadTasks();
    console.log("test");

    const title = document.createElement("h1");
    title.textContent = "My TO-DO LIST";
    document.body.append(title);

    const container = document.createElement("div");
    document.body.append(container);

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = 'Введите Вашу задачу......'
    document.body.append(input);

    const button = document.createElement("button");
    button.textContent = 'Добавить'
    document.body.append(button);

    button.addEventListener("click", () => {
        console.log("clicked the test button");
    })

    const list = document.createElement("ul");
    list.id = "listId"
    document.body.append(list);

    for (const t of tasks) {
        createTaskElement(t, list);
    }

    ///новая запись
    button.addEventListener("click", () => {
        const textTask = input.value.trim();
        if (!textTask) return;

        const newTask = { text: textTask, done: false };
        tasks.push(newTask);
        saveTasks();

        createTaskElement(newTask, list);
        input.value = "";
    });
}

test();