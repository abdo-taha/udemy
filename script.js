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

const courseItem = ({ title, author, image, price, rating, people, bestseller }) => {

    return `<div class="course-item">
        <img class="course-img" src="${image}">
        <h3>${title}</h3>
        <p class="author">${author}</p>
        <div class="rating">
            <p class="rating-score">${rating}</p><span class="star">${getStars(rating)}</span>
            <p class="rating-n">(${people.toLocaleString('en-US')})</p>
        </div>
        <p class="price">E£${price.toLocaleString('en-US')}</p>
        ${bestseller?'<p class="bestseller">Bestseller</p>':''}
    </div>`

}

const updateCourses = async(search) => {

    const coursesList = document.getElementsByClassName("courses-list")[0]
    coursesList.innerHTML = ""
        /* change to local host*/
        // let url = "https://my-json-server.typicode.com/abdo-taha/udemy";
    let url = "http://localhost:3000";

    const coursesData = await fetch(`${url}/courses?title_like=${search}`).then(x => x.json())
    coursesData.forEach(element => {
        coursesList.appendChild(new DOMParser().parseFromString(courseItem(element), "text/html").body
            .firstElementChild)
    });

}


const main = async() => {
    await updateCourses("");

    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input")

    searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        updateCourses(searchInput.value)
    })
}

main()