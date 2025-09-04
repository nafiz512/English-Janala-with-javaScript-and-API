let fetchData = (url) => {
    return fetch(url)
        .then((res) => res.json())
        .then((json) => json.data);
};

let displayData = () => {
    let url = "https://openapi.programming-hero.com/api/levels/all";
    fetchData(url).then((data) => {
        let lesson_container = document.getElementById(
            "lesson_level-container"
        );
        lesson_container.innerHTML = "";

        data.forEach((lesson) => {
            let divlesson = document.createElement("div");
            divlesson.innerHTML = `<button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary">
                                <i class="fa-solid fa-book-open-reader"></i>Learn-${lesson.level_no}
                            </button>`;
            lesson_container.append(divlesson);
        });
    });
};
let loadLevelWord = (id) => {
    let url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetchData(url).then((data) => {
        data.forEach((data) => {
            console.log(data.word);
        });
    });
};

displayData();
