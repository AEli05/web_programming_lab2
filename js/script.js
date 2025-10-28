function test() {
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

    button.addEventListener("click", () => {
        const textTask = input.value.trim();
        if (!textTask) return;

        const point = document.createElement("li");

        const box_with_sign = document.createElement("input");
        box_with_sign.type = "checkbox";

        box_with_sign.addEventListener("change", () => {
            point.classList.toggle("done", box_with_sign.checked);
        });

        const taskFull = document.createElement("span");
        taskFull.textContent = textTask;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = 'Удалить'

        deleteButton.addEventListener("click", () => {
            point.remove();
        });

        point.append(box_with_sign, taskFull, deleteButton);
        list.append(point);

        input.value = ""
    })
}

test();