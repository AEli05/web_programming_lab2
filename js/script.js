function test() {
    console.log("test");

    const title = document.createElement("h1");
    title.textContent = "My TO-DO LIST";
    document.body.append(title);
}

test();