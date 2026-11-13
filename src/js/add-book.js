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

const inputs = [titleInput, authorInput, coverUrlInput, isbnInput, publisherInput, dateInput, descriptionInput]

const preview_inputs = [titleInput, authorInput, coverUrlInput]

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
  const canSubmit = inputs.every(input => input.value.trim() !== "")

  console.log(canSubmit)

  submitButton.disabled = !canSubmit

  submitButton.classList.toggle("btn-disabled", !canSubmit)
  submitButton.classList.toggle("btn-primary", canSubmit)
}

function getBookData() {
  return {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    coverUrl: coverUrlInput.value.trim(),
    isbn: isbnInput.value.trim(),
    publisher: publisherInput.value.trim(),
    date: dateInput.value.trim(),
    description: descriptionInput.value.trim()
  }
}

coverUrlInput.addEventListener("input", updatePreview)
previewImage.addEventListener("error", () => {
  previewImage.hidden = true
})

updatePreview()
updateSubmitButton()