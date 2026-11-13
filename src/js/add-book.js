import "./global.js"

const titleInput = document.getElementById("bookTitle")
const authorInput = document.getElementById("bookAuthor")
const coverUrlInput = document.getElementById("coverUrl")
const submitButton = document.getElementById("submitBtn")
const previewTitle = document.getElementById("previewTitle")
const previewAuthor = document.getElementById("previewAuthor")
const previewImage = document.getElementById("previewImg")

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
  const canSubmit = Boolean(titleInput.value.trim() && authorInput.value.trim())
  submitButton.disabled = !canSubmit
  submitButton.classList.toggle("btn-disabled", !canSubmit)
  submitButton.classList.toggle("btn-primary", canSubmit)
}

titleInput.addEventListener("input", () => {
  updatePreview()
  updateSubmitButton()
})
authorInput.addEventListener("input", () => {
  updatePreview()
  updateSubmitButton()
})
coverUrlInput.addEventListener("input", updatePreview)
previewImage.addEventListener("error", () => {
  previewImage.hidden = true
})

updatePreview()
updateSubmitButton()