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
            //console.log(lesson);

            let divlesson = document.createElement("div");
            divlesson.innerHTML = `<button onclick="loadLevelWord(${lesson.level_no},${lesson.id})" id="learn-${lesson.id}" class="btn btn-outline btn-primary">
                                <i class="fa-solid fa-book-open-reader"></i>Learn-${lesson.level_no}
                            </button>`;
            lesson_container.append(divlesson);
        });
    });
};
let loadLevelWord = (lessonId, btnId) => {
    let url = `https://openapi.programming-hero.com/api/level/${lessonId}`;
    let btn = document.querySelectorAll("#lesson_level-container button");
    btn.forEach((childbtn) => {
        childbtn.classList.remove("btn-blue");
    });
    btnId = "learn-" + btnId;
    document.getElementById(btnId).classList.add("btn-blue");

    fetchData(url).then((data) => {
        document.getElementById("word-select-msge").style.display = "none";
        let word = document.getElementById("lesson-word-container");
        word.innerHTML = "";

        if (data.length) {
            data.forEach((data) => {
                let divWord = document.createElement("div");
                divWord.innerHTML = `
            <div   class="bg-white flex flex-col justify-between rounded-lg max-w-[527px] h-full">
                        <div
                            class="flex flex-col justify-center items-center py-14 px-10 lg:px-36"
                        >
                            <h3 class="font-bold text-3xl">${
                                data.word ? data.word : "missing"
                            }</h3>
                            <p class="text-xl mt-5 mb-8">
                                Meaning/Pronunciation
                            </p>
                            <h3 class="text-xl lg:text-2xl">
                                ${
                                    data.meaning
                                        ? data.meaning
                                        : "missing value"
                                }/
                                ${
                                    data.pronunciation
                                        ? data.pronunciation
                                        : "missing"
                                }
                            </h3>
                        </div>
                        <div class="flex justify-between px-5 py-5">
                            <button onclick="showWordDetails(${
                                data.id
                            })" class="btn  bg-[#1a91ff10] hover:bg-[#1a91ff80]">
                                <i
                                    class="fa-solid fa-circle-info text-2xl lg:text-[36px]"
                                ></i>
                            </button>
                            <button class="btn bg-[#1a91ff10] hover:bg-[#1a91ff80]">
                                <i
                                    class="fa-solid fa-volume-high text-2xl lg:text-[36px]"
                                >
                                </i>
                            </button>
                        </div>
                    </div>`;
                word.append(divWord);
            });
        } else {
            word.innerHTML = `<div
                    id="word-select-msge"
                    class="min-h-52 flex flex-col items-center justify-center gap-3 col-span-full"
                >
                    <img src="./assets/alert-error.png" alt="" />
                    <p class="text-sm">
                        এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
                    </p>
                    <h1 class="font-bold text-2xl">নেক্সট Lesson এ যান</h1>
                </div>`;
        }
    });
};
let showWordDetails = (id) => {
    let url = `https://openapi.programming-hero.com/api/word/${id}`;
    fetchData(url).then((data) => {
        let modalSec = document.getElementById("modalSection");
        let synonymList = data.synonyms
            .map((sym) => {
                return `<button class="btn bg-sky-100">${sym}</button>`;
            })
            .join(" ");
        modalSec.innerHTML = `<dialog id="my_modal_5" class="modal modal-middle">
                    <div class="modal-box">
                        <!-- modal info  -->
                        <div>
                            <h2 class="text-4xl font-semibold">
                                ${data.word} (${data.pronunciation})
                            </h2>
                            <div class="my-6 lg:my-8">
                                <h3 class="text-2xl font-semibold">Meaning</h3>
                                <h3 class="text-2xl">${data.meaning}</h3>
                            </div>
                            <div class="mb-8">
                                <h3>Example</h3>
                                <h3>
                                    ${data.sentence}
                                </h3>
                            </div>
                            <div class="mb-8">
                                <h3 class="mb-2">সমার্থক শব্দ গুলো:</h3>
                                <div>${synonymList}
                                </div>
                            </div>
                        </div>
                        <div>
                            <form method="dialog">
                                <!-- if there is a button in form, it will close the modal -->
                                <button
                                    class="btn btn-primary text-white font-normal"
                                >
                                    Complete Learning
                                </button>
                            </form>
                        </div>
                    </div>
                </dialog>`;

        my_modal_5.showModal();
    });
};
displayData();
//
