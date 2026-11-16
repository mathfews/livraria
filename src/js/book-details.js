const id = (window.location.href).substring(window.location.href.lastIndexOf("/") + 1)

async function getBookById(id) {
    return fetch(`http://localhost:3000/books/${id}`)
        .then(async response => {
            if (!response.ok) {
                throw new Error("Book not found")
            }
            return await response.json()
        })
}

function displayBookDetails(book) {
    const bookCover = document.querySelector(".book-detail-cover")
    const bookTitle = document.querySelector(".book-detail-heading")
    const bookDescription = document.querySelector(".book-detail-description")
    const bookAuthor = document.querySelector(".book-detail-fact-author dd")
    const bookPublisher = document.querySelector(".book-detail-fact-publisher dd")
    const bookPublicationYear = document.querySelector(".book-detail-fact-publication-year dd")
    const bookIsbn = document.querySelector(".book-detail-fact-isbn dd")

    bookAuthor.textContent = book.author
    bookPublisher.textContent = book.publisher
    bookPublicationYear.textContent = book.publication_year
    bookIsbn.textContent = book.isbn

    bookCover.style.backgroundImage = `url(${book.cover_url})`
    bookCover.style.backgroundSize = "cover"
    bookTitle.textContent = book.title
    bookDescription.textContent = book.description
}

await getBookById(id)
    .then(book => {
        displayBookDetails(book)
    })
    .catch(error => {
        window.location.href = "/404.html"
    })