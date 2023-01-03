function filter_recipes(text) {
    console.log(text);
    console.log(text.length);
    let recipes = document.getElementsByClassName("flex-item");
    for (r of recipes) {
        if ((text.length < 2) || (r.children[0].textContent.includes(text.toUpperCase()))) {
            r.hidden = false;
        }
        else {
            r.hidden = true;
        }
    }
}