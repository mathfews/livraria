/**
 * edit-book.js — Livraria Edit Book Controller
 */
import { BookStore } from "./global.js";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  const editContent = document.getElementById("editContent");
  const notFoundState = document.getElementById("notFoundState");

  if (!bookId) {
    showNotFound();
    return;
  }

  const book = BookStore.getBook(bookId);
  if (!book) {
    showNotFound();
    return;
  }

  function showNotFound() {
    if (editContent) editContent.style.display = "none";
    if (notFoundState) notFoundState.style.display = "flex";
  }

  editContent.style.display = "block";
  document.title = `Edit ${book.title} — Livraria`;

  // Links & Header
  document.getElementById("editPageDescription").textContent = `Edit the details for ${book.title}.`;
  const bookUrl = `book-details.html?id=${encodeURIComponent(book.id)}`;
  document.getElementById("backToBookLink").href = bookUrl;
  document.getElementById("cancelBtn").href = bookUrl;

  // Form Fields
  const form = document.getElementById("editBookForm");
  const bookTitle = document.getElementById("bookTitle");
  const bookAuthor = document.getElementById("bookAuthor");
  const bookIsbn = document.getElementById("bookIsbn");
  const bookPublisher = document.getElementById("bookPublisher");
  const bookYear = document.getElementById("bookYear");
  const bookDescription = document.getElementById("bookDescription");
  const descGuidance = document.getElementById("descGuidance");

  const titleGroup = document.getElementById("titleGroup");
  const authorGroup = document.getElementById("authorGroup");
  const isbnGroup = document.getElementById("isbnGroup");
  const saveChangesBtn = document.getElementById("saveChangesBtn");

  // Cover Elements
  const uploadDropzone = document.getElementById("uploadDropzone");
  const uploadedPreviewContainer = document.getElementById("uploadedPreviewContainer");
  const coverFileInput = document.getElementById("coverFileInput");
  const browseFilesBtn = document.getElementById("browseFilesBtn");
  const replaceCoverBtn = document.getElementById("replaceCoverBtn");
  const removeCoverBtn = document.getElementById("removeCoverBtn");
  const previewCover = document.getElementById("previewCover");
  const previewCoverTitle = document.getElementById("previewCoverTitle");
  const previewCoverAuthor = document.getElementById("previewCoverAuthor");
  const previewEmblemWrap = document.getElementById("previewEmblemWrap");
  const previewEmblemImg = document.getElementById("previewEmblemImg");
  const previewCoverImg = document.getElementById("previewCoverImg");
  const previewFileMeta = document.getElementById("previewFileMeta");
  const uploadErrorAlert = document.getElementById("uploadErrorAlert");

  let currentCoverImage = book.coverImage || "";
  let currentFileName = book.fileName || (book.coverImage ? "cover.jpg" : "");
  let currentFileSize = book.fileSize || (book.coverImage ? "420 KB" : "");

  // Pre-fill values
  bookTitle.value = book.title;
  bookAuthor.value = book.author;
  bookIsbn.value = book.isbn || "";
  bookPublisher.value = book.publisher || "";
  bookYear.value = book.year || "";
  bookDescription.value = book.description || "";
  descGuidance.textContent = `${bookDescription.value.length} / 2,000 characters`;

  // Pre-fill cover preview
  previewCover.style.backgroundColor = book.coverColor || "#344F43";
  function renderCoverPreview() {
    if (currentCoverImage) {
      previewCoverImg.src = currentCoverImage;
      previewCoverImg.style.display = "block";
      previewCoverTitle.style.display = "none";
      previewCoverAuthor.style.display = "none";
      previewEmblemWrap.style.display = "none";
      previewFileMeta.textContent = `${currentFileName || "cover.jpg"} · ${currentFileSize || "420 KB"}`;
      uploadDropzone.style.display = "none";
      uploadedPreviewContainer.classList.add("has-preview");
    } else {
      previewCoverImg.style.display = "none";
      previewCoverTitle.style.display = "block";
      previewCoverAuthor.style.display = "block";
      previewEmblemWrap.style.display = "flex";
      previewCoverTitle.textContent = bookTitle.value || book.title;
      previewCoverAuthor.textContent = bookAuthor.value || book.author;
      previewEmblemImg.src = `../assets/icons/${book.coverEmblem || "flower-2.svg"}`;
      previewFileMeta.textContent = `${(bookTitle.value || book.title).toLowerCase().replace(/[^a-z0-9]/g, "-")}.jpg · 420 KB`;
      uploadDropzone.style.display = "none";
      uploadedPreviewContainer.classList.add("has-preview");
    }
  }
  renderCoverPreview();

  // Helper: validate ISBN
  function validateIsbn(val) {
    if (!val) return true;
    const clean = val.replace(/[-\s]/g, "");
    return (clean.length === 10 || clean.length === 13) && /^[0-9xX]+$/.test(clean);
  }

  // Validity
  function updateFormValidity() {
    const isTitleValid = Boolean(bookTitle.value.trim());
    const isAuthorValid = Boolean(bookAuthor.value.trim());
    const isIsbnValid = validateIsbn(bookIsbn.value.trim());

    if (isTitleValid && isAuthorValid && isIsbnValid) {
      saveChangesBtn.disabled = false;
      saveChangesBtn.classList.remove("btn-disabled");
      saveChangesBtn.classList.add("btn-primary");
    } else {
      saveChangesBtn.disabled = true;
      saveChangesBtn.classList.remove("btn-primary");
      saveChangesBtn.classList.add("btn-disabled");
    }
  }

  bookTitle.addEventListener("input", () => {
    if (bookTitle.value.trim()) {
      titleGroup.classList.remove("has-error");
    }
    previewCoverTitle.textContent = bookTitle.value || book.title;
    updateFormValidity();
  });

  bookAuthor.addEventListener("input", () => {
    if (bookAuthor.value.trim()) {
      authorGroup.classList.remove("has-error");
    }
    previewCoverAuthor.textContent = bookAuthor.value || book.author;
    updateFormValidity();
  });

  bookIsbn.addEventListener("input", () => {
    const val = bookIsbn.value.trim();
    if (val && !validateIsbn(val)) {
      isbnGroup.classList.add("has-error");
    } else {
      isbnGroup.classList.remove("has-error");
    }
    updateFormValidity();
  });

  bookDescription.addEventListener("input", () => {
    const len = bookDescription.value.length;
    descGuidance.textContent = `${len} / 2,000 characters`;
  });

  // Cover actions
  replaceCoverBtn?.addEventListener("click", () => coverFileInput.click());
  browseFilesBtn?.addEventListener("click", () => coverFileInput.click());

  function handleFile(file) {
    uploadErrorAlert.classList.remove("visible");
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      uploadErrorAlert.textContent = "This image is too large. Choose a file smaller than 5 MB.";
      uploadErrorAlert.classList.add("visible");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      currentCoverImage = e.target.result;
      currentFileName = file.name;
      const sizeKb = Math.round(file.size / 1024);
      currentFileSize = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
      renderCoverPreview();
    };
    reader.readAsDataURL(file);
  }

  coverFileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  removeCoverBtn.addEventListener("click", () => {
    currentCoverImage = "";
    currentFileName = "";
    currentFileSize = "";
    coverFileInput.value = "";
    uploadedPreviewContainer.classList.remove("has-preview");
    uploadDropzone.style.display = "flex";
  });

  // Form Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = bookTitle.value.trim();
    const author = bookAuthor.value.trim();
    const isbn = bookIsbn.value.trim();
    let hasError = false;

    if (!title) {
      titleGroup.classList.add("has-error");
      hasError = true;
    }
    if (!author) {
      authorGroup.classList.add("has-error");
      hasError = true;
    }
    if (isbn && !validateIsbn(isbn)) {
      isbnGroup.classList.add("has-error");
      hasError = true;
    }

    if (hasError) {
      updateFormValidity();
      return;
    }

    BookStore.updateBook(book.id, {
      title,
      author,
      isbn,
      publisher: bookPublisher.value.trim(),
      year: bookYear.value.trim(),
      description: bookDescription.value.trim(),
      coverImage: currentCoverImage,
      fileName: currentFileName,
      fileSize: currentFileSize
    });

    window.location.href = bookUrl;
  });

  updateFormValidity();
});
