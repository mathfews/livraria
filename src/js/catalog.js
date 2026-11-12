const booksGrid = document.getElementById("booksGrid")
const bookCardTemplate = document.getElementById("bookCardTemplate")

async function getBooks() {
    const response = await fetch("http://localhost:3000/books")

    return await response.json()
}

function createBookCard(book) {
    const card = bookCardTemplate.content.cloneNode(true)
    const bookCover = card.querySelector(".book-cover")
    const coverEmblem = card.querySelector(".book-cover-emblem img")
    const year = card.querySelector("[data-book-year]")

    card.querySelectorAll("[data-book-title]").forEach(element => {
        element.textContent = book.title
    })

    card.querySelectorAll("[data-book-author]").forEach(element => {
        element.textContent = book.author
    })

    const publicationYear = book.year ?? book.publication_year
    year.textContent = publicationYear ?? ""
    year.hidden = !publicationYear

    bookCover.style.backgroundColor = "#815744"
    coverEmblem.src = "../assets/icons/feather.svg"

    return card
}

const books = await getBooks()

books.forEach(book => {
    booksGrid.appendChild(createBookCard(book))
})