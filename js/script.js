let tasks = [];

function createTaskElement(task, list) {
    const point = document.createElement("li");
    point.draggable = true;

    const box_with_sign = document.createElement("input");
    box_with_sign.type = "checkbox";
    box_with_sign.checked = task.done;

    box_with_sign.addEventListener("change", () => {
        point.classList.toggle("done", box_with_sign.checked);
        task.done = box_with_sign.checked;
        saveTasks();
        if (window.applyFilters) window.applyFilters();
    });

    const taskFull = document.createElement("span");
    taskFull.textContent = task.text;

    const timeEl = document.createElement("time");
    if (task.due) {
        timeEl.dateTime = task.due;
        timeEl.textContent = task.due;
    }

    point.dataset.due = task.due || "";


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

    point.append(box_with_sign, taskFull, timeEl, editBtn, deleteButton);
    point.classList.toggle("done", task.done);


    point.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.text);
        point.classList.add("dragging");
    });

    point.addEventListener("dragend", () => {
        point.classList.remove("dragging");
    });

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
    title.textContent = "✨ My TO-DO LIST ✨";
    document.body.append(title);

    const container = document.createElement("div");
    document.body.append(container);

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = 'Введите Вашу задачу......'

    const dateInput = document.createElement("input");
    dateInput.type = "date";

    const button = document.createElement("button");
    button.textContent = 'Добавить'

    container.append(input, dateInput, button);


    button.addEventListener("click", () => {
        console.log("clicked the test button");
    })

    const list = document.createElement("ul");
    list.id = "listId"
    document.body.append(list);

    list.addEventListener("dragover", (e) => {
        e.preventDefault(); // обязательно, чтобы drop сработал

        const dragging = document.querySelector(".dragging");
        const siblings = [...list.querySelectorAll("li:not(.dragging)")];


        const nextEl = siblings.find(el => e.clientY <= el.getBoundingClientRect().top + el.offsetHeight / 2);
        if (nextEl) {
            list.insertBefore(dragging, nextEl);
        } else {
            list.append(dragging);
        }
    });

    list.addEventListener("drop", () => {
        const newOrder = [];
        for (const li of list.children) {
            const text = li.querySelector("span").textContent;
            const task = tasks.find(t => t.text === text);
            if (task) newOrder.push(task);
        }
        tasks = newOrder;
        saveTasks();
    });


    const filterBar = document.createElement("div");
    const dateFilter = document.createElement("input");
    dateFilter.type = "date";
    filterBar.append(dateFilter);

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder = "Поиск по названию";
    filterBar.append(searchInput);

    let statusFilter = "all";

    const allBtn    = document.createElement("button");
    allBtn.textContent = "Все";
    allBtn.dataset.value = "all";

    const activeBtn = document.createElement("button");
    activeBtn.textContent = "Активные";
    activeBtn.dataset.value = "active";

    const doneBtn   = document.createElement("button");
    doneBtn.textContent = "Выполненные";
    doneBtn.dataset.value = "done";

    filterBar.append(allBtn, activeBtn, doneBtn);

    function updateStatusButtons() {
        for (const b of [allBtn, activeBtn, doneBtn]) {
            b.toggleAttribute("aria-pressed", b.dataset.value === statusFilter);
        }
    }

    function setStatusFilter(val) {
        statusFilter = val;
        updateStatusButtons();
        applyFilters();
    }

    allBtn   .addEventListener("click", () => setStatusFilter("all"));
    activeBtn.addEventListener("click", () => setStatusFilter("active"));
    doneBtn  .addEventListener("click", () => setStatusFilter("done"));

    updateStatusButtons();

    document.body.insertBefore(filterBar, list);

    function applyFilters() {
        const qDate = dateFilter.value;
        const qText = (searchInput.value || "").toLowerCase().trim();

        for (const li of list.children) {
            const due  = li.dataset.due || "";
            const text = (li.querySelector("span")?.textContent || "").toLowerCase();
            const isDone = li.classList.contains("done");

            const matchDate   = !qDate || due === qDate;
            const matchText   = !qText || text.includes(qText);
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "done"   && isDone) ||
                (statusFilter === "active" && !isDone);

            li.style.display = (matchDate && matchText && matchStatus) ? "" : "none";
        }
    }

    window.applyFilters = applyFilters;


    dateFilter.addEventListener("input", applyFilters);
    searchInput.addEventListener("input", applyFilters);



    for (const t of tasks) {
        createTaskElement(t, list);
    }

    applyFilters();

    ///новая запись
    button.addEventListener("click", () => {
        const textTask = input.value.trim();
        if (!textTask) return;

        const due = dateInput.value || "";
        const newTask = { text: textTask, done: false, due };
        tasks.push(newTask);
        saveTasks();

        createTaskElement(newTask, list);
        applyFilters();
        input.value = "";
        dateInput.value = "";
    });
}

test();