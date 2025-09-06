let fetchData = (url) => {
    return fetch(url)
        .then((res) => res.json())
        .then((json) => json.data);
};
// load learn btn functionality
let displayData = () => {
    let url = "https://openapi.programming-hero.com/api/levels/all";
    fetchData(url).then((data) => {
        let lesson_container = document.getElementById(
            "lesson_level-container"
        );
        lesson_container.innerHTML = "";

        data.forEach((lesson) => {
            let divlesson = document.createElement("div");
            divlesson.innerHTML = `<button onclick="loadLevelWord(${lesson.level_no},${lesson.id})" id="learn-${lesson.id}" class="btn btn-outline btn-primary">
                                <i class="fa-solid fa-book-open-reader"></i>Learn-${lesson.level_no}
                            </button>`;
            lesson_container.append(divlesson);
        });
    });
};
let showNotFound = (word, state) => {
    if (state === "lesson") {
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
    } else if (state === "search") {
        word.innerHTML = `<div
                    id="word-select-msge"
                    class="min-h-52 flex flex-col items-center justify-center gap-3 col-span-full"
                >
                    <p class="text-sm">
                        No matching Word found.
                    </p>
                    <h1 class="font-bold text-2xl">Please try again</h1>
                </div>`;
    } else {
        console.log("Untracked Call");
    }
};
// load word crad functionality
let loadWordCards = (data) => {
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
                            <button 
                            onclick="pronounceWord('${[
                                data.word,
                                data.meaning,
                            ]}')" 
                            class="btn bg-[#1a91ff10] hover:bg-[#1a91ff80]">
                                <i
                                    class="fa-solid fa-volume-high text-2xl lg:text-[36px]"
                                >
                                </i>
                            </button>
                        </div>
                    </div>`;
            word.append(divWord);
            manageSpinner(false);
        });
    } else {
        showNotFound(word, "lesson");
        manageSpinner(false);
    }
};

let loadLevelWord = (lessonId, btnId) => {
    manageSpinner(true);
    let url = `https://openapi.programming-hero.com/api/level/${lessonId}`;
    let btn = document.querySelectorAll("#lesson_level-container button");
    btn.forEach((childbtn) => {
        childbtn.classList.remove("btn-blue");
    });
    btnId = "learn-" + btnId;
    document.getElementById(btnId).classList.add("btn-blue");

    fetchData(url).then((data) => loadWordCards(data));
};
// show word details functionality
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
// spinner manage functionality
let manageSpinner = (status) => {
    if (status) {
        document.getElementById("spinnerSection").classList.remove("hidden");
        document
            .getElementById("lesson-word-container")
            .classList.add("hidden");
    } else {
        document.getElementById("spinnerSection").classList.add("hidden");
        document
            .getElementById("lesson-word-container")
            .classList.remove("hidden");
    }
};

// handle search
let handleSearch = () => {
    let srch = document.getElementById("serch-field");
    let sr = srch.value.trim().toLowerCase();
    document.getElementById("word-select-msge").style.display = "none";
    manageSpinner(true);
    let url = `https://openapi.programming-hero.com/api/words/all`;
    fetchData(url).then((data) => {
        let list = [];
        data.forEach((item) => {
            if (item.word.toLowerCase().includes(sr)) {
                list.push(item);
            }
        });
        manageSpinner(false);
        if (list.length === 0) {
            let word = document.getElementById("lesson-word-container");
            word.innerHTML = "";
            showNotFound(word, "search");
            return;
        } else {
            loadWordCards(list);
        }
    });
};
document.getElementById("btn-search").addEventListener("click", handleSearch);
document
    .getElementById("serch-field")
    .addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault(); // stop form submit / reload
            handleSearch();
        }
    });

function pronounceWord(list) {
    const synth = window.speechSynthesis;
    list = list.split(",");
    const [word, meaning] = list;

    // Step 1: pronounce English word
    const utterWord = new SpeechSynthesisUtterance(word);
    utterWord.lang = "en-EN";
    utterWord.rate = 0.8;

    // Step 2: pronounce "অর্থ" (means in Bangla)
    const utterMeans = new SpeechSynthesisUtterance("অর্থ");
    utterMeans.lang = "bn-BD";
    utterMeans.rate = 0.8;

    // Step 3: pronounce Bangla meaning
    const utterMeaning = new SpeechSynthesisUtterance(meaning);
    utterMeaning.lang = "bn-BD";
    utterMeaning.rate = 0.8;

    // Queue properly instead of setTimeout
    utterWord.onend = () => synth.speak(utterMeans);
    utterMeans.onend = () => synth.speak(utterMeaning);

    synth.speak(utterWord);
}

displayData();
