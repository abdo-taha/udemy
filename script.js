// let url = "https://my-json-server.typicode.com/abdo-taha/udemy";
let url = "http://localhost:3000";

const btns = {
    "btn-python": "python",
    "btn-excel": "excel",
    "btn-web": "web",
    "btn-java": "js",
    "btn-data": "data",
    "btn-aws": "aws",
    "btn-drawing": "draw"
}
let activeBtn = "btn-python"

let globalData, filteredData;

let nCourses = 5;

const getStars = (n) => {
    stars = "";
    left = 5;
    for (let i = 0; i < Math.floor(n); i++) {
        stars += '<img  src="./img/star-full.png">'
            --left;
    }
    if (Math.floor(n) != Math.round(n)) {
        --left;
        stars += '<img  src="./img/star-half.png">'
    }
    for (let i = 0; i < left; i++) {
        stars += '<img  src="./img/star-empty.png">'
    }
    return stars

}

const courseItem = ({ title, instructors, image, price, rating, people, bestseller }) => {

    let author = ""
    instructors.forEach(((instructor, index) => author += (index ? "," : "") + instructor["name"]));

    return `<div class="course-item">
        <img class="course-img" src="${image}">
        <h3>${title}</h3>
        <p class="author">${author}</p>
        <div class="rating">
            <p class="rating-score">${rating.toFixed(1)}</p><span class="star">${getStars(rating)}</span>
            <p class="rating-n">(${(people?people:1999).toLocaleString('en-US')})</p>
        </div>
        <p class="price">E£${price.toLocaleString('en-US')}</p>
        ${bestseller?'<p class="bestseller">Bestseller</p>':''}
    </div>`

}
const courseList = ({ data, active }) => {
    return `<div class = "courses-list carousel-item ${active?"active":""}" >
        ${data.join("\n")}
    </div>`
}

const drawCourses = async() => {

    let coursesCarousel = document.getElementById("courses-carousel");
    coursesCarousel.innerHTML = "";
    let page = [];
    active = true;
    filteredData.forEach((element, index) => {
        if (index % nCourses === 0) {
            if (page.length) {
                coursesCarousel.appendChild(new DOMParser().parseFromString(courseList({ data: page, active }), "text/html").body
                    .firstElementChild)
                active = false;
            }
            page = [];
        }
        page.push(courseItem(element))
    });
    if (page.length) {
        coursesCarousel.appendChild(new DOMParser().parseFromString(courseList({ data: page, active }), "text/html").body
            .firstElementChild)
    }

}


const drawCoursesInf = ({ header, description, category }) => {
    const head = document.getElementsByClassName("courses-content-head")[0];
    const _header = head.getElementsByTagName("h2")[0]
    const _description = head.getElementsByTagName("p")[0]
    const _btn = head.getElementsByTagName("a")[0]
    _header.textContent = header
    _description.textContent = description
    _btn.textContent = `Explore ${category}`
}


const updateCourses = async(major) => {

    let data = await fetch(`${url}/courses?name=${major}`).then(x => x.json())
    data = data[0]

    globalData = filteredData = data["courses"];
    drawCourses();
    drawCoursesInf(data);
}


const searchCourses = (search) => {
    filteredData = globalData.filter(course => course["title"].toLowerCase().includes(search.toLowerCase()));
    drawCourses();
}



const catItem = ({ image, title }) => {
    return `<div class="col-lg-3 col-md-4 col-xs-12 justify-content-center d-flex">
                <a class=" cat-item ">
                    <div class="img-frame">
                        <img src="${image}">
                    </div>
                    <div class="cat-card">
                        <span>${title}</span>
                    </div>
                </a>
            </div>`
}

const updateCat = async() => {
    const categories = document.getElementById("cat")
    const catData = await fetch(`${url}/categories`).then(x => x.json())
    catData.forEach(element => {
        categories.appendChild(new DOMParser().parseFromString(catItem(element), "text/html").body
            .firstElementChild)
    });
}


const activateBtn = (btnId) => {
    const oldBtn = document.getElementById(activeBtn)
    const newBtn = document.getElementById(btnId)
    oldBtn.classList.remove("topic-btn-active")
    newBtn.classList.add("topic-btn-active")
    activeBtn = btnId;
}


const btnsListeners = () => {
    for (const btnId in btns) {
        const btn = document.getElementById(btnId);
        btn.addEventListener("click", (e) => {
            updateCourses(btns[btnId]);
            activateBtn(btnId);
        })
    }
}

const changeNCourses = (n) => {
    nCourses = n;
    drawCourses();
}

const mediaQuery = () => {
    let screens = [
        window.matchMedia("(min-width: 100px) and (max-width: 599px)"),
        window.matchMedia("(min-width: 600px) and (max-width: 699px)"),
        window.matchMedia("(min-width: 700px) and (max-width: 969px)"),
        window.matchMedia("(min-width: 970px) and (max-width: 1199px)"),
        window.matchMedia("(min-width: 1200px)")
    ]
    screens.forEach((screen, index) => {
        screen.addListener((x) => { if (x.matches) changeNCourses(index + 1) });
        if (screen.matches) changeNCourses(index + 1);
    })
}




const main = async() => {
    await updateCat();
    btnsListeners();
    await updateCourses(btns[activeBtn]);

    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input")

    searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        searchCourses(searchInput.value)
    })
    mediaQuery()
}

main()