const booksGrid = document.getElementById("booksGrid")
const bookCardTemplate = document.getElementById("bookCardTemplate")

async function getBooks() {
    const response = await fetch("http://localhost:3000/books")

    return await response.json()
}

function createBookCard(book) {
    const card = bookCardTemplate.content.firstElementChild.cloneNode(true)

    card.addEventListener("click", () => {
        window.location.href = `/catalog/${book.id}`
    })
    
    card.id = `book-${book.id}`
    // console.log(card.id.substring(5)) - just to verify that the id is being set correctly

    const bookCover = card.querySelector(".book-cover")
    const year = card.querySelector("[data-book-year]")

    card.querySelectorAll("[data-book-title]")[1].textContent = book.title

    card.querySelectorAll("[data-book-author]")[1].textContent = book.author

    /*

    const publicationYear = book.year ?? book.publication_year
    year.textContent = publicationYear ?? ""
    year.hidden = !publicationYear

    */

    bookCover.style.backgroundImage = `url(${book.cover_url})`
    bookCover.style.backgroundSize = "cover"

    return card
}

const books = await getBooks()

books.forEach(book => {
    booksGrid.appendChild(createBookCard(book))
})

const targetId = window.location.hash.slice(1)
if (targetId) {
    document.getElementById(targetId)?.scrollIntoView({ block: "center" })
}