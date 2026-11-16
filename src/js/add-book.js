import "./global.js"

const titleInput = document.getElementById("bookTitle")
const authorInput = document.getElementById("bookAuthor")
const isbnInput = document.getElementById("bookIsbn")
const publisherInput = document.getElementById("bookPublisher")
const dateInput = document.getElementById("bookYear")
const descriptionInput = document.getElementById("bookDescription")
const coverUrlInput = document.getElementById("coverUrl")
const submitButton = document.getElementById("submitBtn")
const previewTitle = document.getElementById("previewTitle")
const previewAuthor = document.getElementById("previewAuthor")
const previewImage = document.getElementById("previewImg")
const submitBookButton = document.getElementById("submitBtn")
const bookAddedDialog = document.getElementById("bookAddedDialog")
const bookAddedMessage = document.getElementById("bookAddedMessage")
const closeBookAddedDialog = document.getElementById("closeBookAddedDialog")
const addBookError = document.getElementById("addBookError")

const inputs = [titleInput, authorInput, coverUrlInput, isbnInput, publisherInput, dateInput, descriptionInput]

const preview_inputs = [titleInput, authorInput, coverUrlInput]
let isSubmitting = false
let bookWasAdded = false

preview_inputs.forEach(input => {
  input.addEventListener("input", () => {
    updatePreview()
  })
})

inputs.forEach(input => {
  input.addEventListener("input", () => {
    updateSubmitButton()
  })
})

function updatePreview() {
  previewTitle.textContent = titleInput.value.trim()
  previewAuthor.textContent = authorInput.value.trim()

  const coverUrl = coverUrlInput.value.trim()
  try {
    const url = new URL(coverUrl)
    if (url.protocol === "http:" || url.protocol === "https:") {
      previewImage.src = url.href
      previewImage.hidden = false
      return
    }
  } catch {
    // Keep the placeholder cover visible until a valid URL is entered.
  }

  previewImage.removeAttribute("src")
  previewImage.hidden = true
}

function updateSubmitButton() {
  const canSubmit = inputs.every(input => input.value.trim() !== "") && !isSubmitting && !bookWasAdded

  submitButton.disabled = !canSubmit

  submitButton.classList.toggle("btn-disabled", !canSubmit)
  submitButton.classList.toggle("btn-primary", canSubmit)
}

async function addBook() {
  if (isSubmitting || bookWasAdded || submitButton.disabled) return

  isSubmitting = true
  addBookError.hidden = true
  updateSubmitButton()

  const data = getBookData()
  try {
    const response = await fetch("/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`Could not add book (${response.status})`)
    }

    bookWasAdded = true
    bookAddedMessage.textContent = `“${data.title}” is now part of your personal library.`
    bookAddedDialog.showModal()
  } catch (error) {
    console.error("Could not add book:", error)
    addBookError.hidden = false
  } finally {
    isSubmitting = false
    updateSubmitButton()
  }
}

submitBookButton.addEventListener("click", addBook)
closeBookAddedDialog.addEventListener("click", () => bookAddedDialog.close())
bookAddedDialog.addEventListener("click", event => {
  if (event.target === bookAddedDialog) bookAddedDialog.close()
})

function getBookData() {
  return {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    publisher: publisherInput.value.trim(),
    publication_year: dateInput.value.trim(),
    cover_url: coverUrlInput.value.trim(),
    isbn: isbnInput.value.trim(),
    description: descriptionInput.value.trim()
  }
}

coverUrlInput.addEventListener("input", updatePreview)
previewImage.addEventListener("error", () => {
  previewImage.hidden = true
})

updatePreview()
updateSubmitButton()