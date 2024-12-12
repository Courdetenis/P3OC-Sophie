// Gallery
async function getWorks(filter) {
    document.querySelector(".gallery").innerHTML = "";
    const response = await fetch("http://localhost:5678/api/works");
    const dataJson = await response.json();
    const filtered = dataJson.filter((data) => data.categoryId === filter);

    if (filter) {
        for (let i = 0; i < filtered.length; i++) {
            setFigure(filtered[i]);
            setFigureModal(filtered[i]);
        }
    } else {
        for (let i = 0; i < dataJson.length; i++) {
            setFigure(dataJson[i]);
            setFigureModal(dataJson[i]);
        }
    }
}

getWorks();

function setFigure(data) {
    const figure = document.createElement("figure");
    figure.setAttribute("data-id", data.id);
    figure.innerHTML = ` <img src=${data.imageUrl} alt=${data.title}>
                       <figcaption>${data.title}</figcaption>`;

    document.querySelector(".gallery").append(figure);
}

// Filters
if (!sessionStorage.token) {
    async function getCategories() {
        const response = await fetch("http://localhost:5678/api/categories");
        const dataJson = await response.json();

        for (let i = 0; i < dataJson.length; i++) {
            setFilter(dataJson[i]);
        }
    }

    getCategories();

    function setFilter(data) {
        const div = document.createElement("div");
        div.className = data.id;
        div.addEventListener("click", () => getWorks(data.id));
        div.innerHTML = `${data.name}`;
        document.querySelector(".filter-container").append(div);
    }
    document.querySelector(".tous").addEventListener("click", () => getWorks());
} else {
    document.querySelector(".filter-container").style.display = "none";
}

// Mode édition + Admin
function adminMode() {
    if (sessionStorage.token) {
        const editBanner = document.createElement("div")
        editBanner.className = "edit"
        editBanner.innerHTML = '<p><a href="#modal" class="js-modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a></p>'
        document.body.append(editBanner)
    }
}

adminMode();

function buttonMode() {
    if (sessionStorage.token) {
        document.querySelector(".loginbutton").style.display = "none";
    } else {
        document.querySelector(".logoutbutton").style.display = "none";
        document.querySelector("#bouton-modifier").style.display = "none"
    }
}

buttonMode();

function logout() {
    sessionStorage.removeItem("token");
    window.location.href = "index.html";
}

document.querySelector(".logoutbutton").addEventListener("click", logout);

// Modal
let modal = null
const focusableSelector = 'button, a, input, textarea'
let focusables = []

const openModal = function (e) {
    e.preventDefault()
    modal = document.querySelector(e.currentTarget.getAttribute('href'))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    focusables[0].focus()
    modal.style.display = null
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelectorAll('.js-close-modal').forEach((e) => e.addEventListener('click', closeModal))
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = 'none'
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-close-modal').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const focusInModal = function (e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
    console.log(focusables)
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e)
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e)
    }
})

function setUploadPhoto(data) {

}

function setFigureModal(data) {
    const figure = document.createElement("figure");
    figure.setAttribute("data-id", data.id);
    figure.innerHTML = ` <div class="figure-wrapper">
            <img src=${data.imageUrl} alt=${data.title}>
            <i class="fa-solid fa-trash-can trash-icon"></i>
        </div>
        <figcaption>${data.title}</figcaption>`;

    document.querySelector(".galleryModal").append(figure);

    const worksidApi = "http://localhost:5678/api/works/";

    async function deleteWork(e) {
        e.preventDefault()

        const response = await fetch(worksidApi + data.id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify(data),
        })

        if (response.ok) {
            e.target.closest("figure").remove();
            document.querySelector(`.gallery figure[data-id="${data.id}"]`).remove();
        } else {
            console.error("Erreur lors de la suppression");
        }

    }
    figure.querySelector(".trash-icon").addEventListener("click", deleteWork);
}

document.querySelector(".add-modal").style.display = "none";
const addPhoto = document.querySelector(".addPhoto")
addPhoto.addEventListener("click", () => {
    document.querySelector(".add-modal").style.display = "flex";
    document.querySelector(".gallery-modal").style.display = "none";
})

const backButton = document.querySelector(".js-back-modal")
backButton.addEventListener("click", () => {
    document.querySelector(".add-modal").style.display = "none";
    document.querySelector(".gallery-modal").style.display = "flex";
})

document.querySelectorAll(".js-close-modal").forEach((closeButton) => {
    closeButton.addEventListener("click", (e) => {
        document.querySelector(".add-modal").style.display = "none";
        document.querySelector(".gallery-modal").style.display = "flex";
    });
});