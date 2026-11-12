const booksGrid = document.getElementById("booksGrid")

async function getBooks() {
    const response = await fetch("http://localhost:3000/books")

    return await response.json()
}

const books = await getBooks()

console.log(books[0])

books.forEach(book => {
    const elemento = document.createElement("p")
    elemento.textContent = book.title
    booksGrid.appendChild(elemento) 
})