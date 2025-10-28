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
}

test();