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

await getBookById(id)
    .then(book => {
        console.log(book)
    })
    .catch(error => {
        console.error(error)
        // window.location.href = "/404.html"
    })