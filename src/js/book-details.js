const id = (window.location.href).substring(window.location.href.lastIndexOf("/") + 1)

const deleteButton = document.querySelector("#deleteBookBtn")
const deleteDialog = document.querySelector("#deleteBookDialog")
const closeDeleteDialogButton = document.querySelector("#closeDeleteBookDialog")
const cancelDeleteButton = document.querySelector("#cancelDeleteBookBtn")
const confirmDeleteButton = document.querySelector("#confirmDeleteBookBtn")
const deleteBookTitle = document.querySelector("#deleteBookTitle")
const deleteBookCoverImage = document.querySelector("#deleteBookCoverImage")
const deleteError = document.querySelector("#deleteBookError")

deleteButton.addEventListener("click", () => {
    deleteError.hidden = true
    deleteDialog.showModal()
})

closeDeleteDialogButton.addEventListener("click", () => deleteDialog.close())
cancelDeleteButton.addEventListener("click", () => deleteDialog.close())
deleteDialog.addEventListener("click", event => {
    if (event.target !== deleteDialog) return

    const bounds = deleteDialog.getBoundingClientRect()
    const clickedOutside = event.clientX < bounds.left
        || event.clientX > bounds.right
        || event.clientY < bounds.top
        || event.clientY > bounds.bottom

    if (clickedOutside) deleteDialog.close()
})

confirmDeleteButton.addEventListener("click", async () => {
    confirmDeleteButton.disabled = true
    try {
        const response = await fetch(`/books/${id}`, {
            method: "DELETE"
        })

        if (!response.ok) {
            throw new Error(`Could not delete book (${response.status})`)
        }

        window.location.href = "/catalog"
    } catch (error) {
        console.error("Could not delete book:", error)
        deleteError.hidden = false
    } finally {
        confirmDeleteButton.disabled = false
    }
})

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
    deleteBookTitle.textContent = book.title
    deleteBookCoverImage.src = book.cover_url
    deleteBookCoverImage.hidden = false
    bookDescription.textContent = book.description
}

deleteBookCoverImage.addEventListener("error", () => {
    deleteBookCoverImage.hidden = true
})

await getBookById(id)
    .then(book => {
        displayBookDetails(book)
    })
    .catch(error => {
        window.location.href = "/404.html"
    })