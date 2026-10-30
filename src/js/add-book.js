/**
 * add-book.js — Livraria Add Book Form Controller
 */
import { BookStore } from "./global.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addBookForm");
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

  const submitBtn = document.getElementById("submitBtn");
  const submitGuidance = document.getElementById("submitGuidance");

  // Cover upload elements
  const uploadDropzone = document.getElementById("uploadDropzone");
  const coverFileInput = document.getElementById("coverFileInput");
  const browseFilesBtn = document.getElementById("browseFilesBtn");
  const uploadedPreviewContainer = document.getElementById("uploadedPreviewContainer");
  const previewImg = document.getElementById("previewImg");
  const previewFileMeta = document.getElementById("previewFileMeta");
  const replaceCoverBtn = document.getElementById("replaceCoverBtn");
  const removeCoverBtn = document.getElementById("removeCoverBtn");
  const uploadErrorAlert = document.getElementById("uploadErrorAlert");
  const noCoverNote = document.getElementById("noCoverNote");

  let uploadedCoverDataUrl = "";
  let uploadedFileName = "";
  let uploadedFileSize = "";

  // Helper: validate ISBN (10 or 13 digits)
  function validateIsbn(val) {
    if (!val) return true;
    const clean = val.replace(/[-\s]/g, "");
    return (clean.length === 10 || clean.length === 13) && /^[0-9xX]+$/.test(clean);
  }

  // Update Submit Button State
  function updateFormValidity() {
    const isTitleValid = Boolean(bookTitle.value.trim());
    const isAuthorValid = Boolean(bookAuthor.value.trim());
    const isIsbnValid = validateIsbn(bookIsbn.value.trim());

    if (isTitleValid && isAuthorValid && isIsbnValid) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("btn-disabled");
      submitBtn.classList.add("btn-primary");
      submitGuidance.textContent = "Ready to add your book to your library.";
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.remove("btn-primary");
      submitBtn.classList.add("btn-disabled");
      submitGuidance.textContent = "Add a title and an author to save your book.";
    }
  }

  // Real-time & blur validation
  bookTitle.addEventListener("input", () => {
    if (bookTitle.value.trim()) {
      titleGroup.classList.remove("has-error");
    }
    updateFormValidity();
  });

  bookTitle.addEventListener("blur", () => {
    if (!bookTitle.value.trim()) {
      titleGroup.classList.add("has-error");
    } else {
      titleGroup.classList.remove("has-error");
    }
    updateFormValidity();
  });

  bookAuthor.addEventListener("input", () => {
    if (bookAuthor.value.trim()) {
      authorGroup.classList.remove("has-error");
    }
    updateFormValidity();
  });

  bookAuthor.addEventListener("blur", () => {
    if (!bookAuthor.value.trim()) {
      authorGroup.classList.add("has-error");
    } else {
      authorGroup.classList.remove("has-error");
    }
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

  // Description character counter
  bookDescription.addEventListener("input", () => {
    const len = bookDescription.value.length;
    if (len > 0) {
      descGuidance.textContent = `${len} / 2,000 characters`;
    } else {
      descGuidance.textContent = "Up to 2,000 characters. You can edit this later.";
    }
  });

  // File Upload Handlers
  browseFilesBtn?.addEventListener("click", () => coverFileInput.click());
  replaceCoverBtn?.addEventListener("click", () => coverFileInput.click());

  function handleFile(file) {
    uploadErrorAlert.classList.remove("visible");
    if (!file) return;

    // Check size limit: 5 MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      uploadErrorAlert.textContent = "This image is too large. Choose a file smaller than 5 MB.";
      uploadErrorAlert.classList.add("visible");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedCoverDataUrl = e.target.result;
      uploadedFileName = file.name;
      const sizeKb = Math.round(file.size / 1024);
      uploadedFileSize = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

      previewImg.src = uploadedCoverDataUrl;
      previewFileMeta.textContent = `${uploadedFileName} · ${uploadedFileSize}`;

      uploadDropzone.style.display = "none";
      uploadedPreviewContainer.classList.add("has-preview");
      if (noCoverNote) noCoverNote.style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  coverFileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  // Drag and drop
  uploadDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadDropzone.classList.add("drag-over");
  });

  uploadDropzone.addEventListener("dragleave", () => {
    uploadDropzone.classList.remove("drag-over");
  });

  uploadDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadDropzone.classList.remove("drag-over");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // Remove Cover
  removeCoverBtn.addEventListener("click", () => {
    uploadedCoverDataUrl = "";
    uploadedFileName = "";
    uploadedFileSize = "";
    coverFileInput.value = "";
    previewImg.src = "";
    uploadedPreviewContainer.classList.remove("has-preview");
    uploadDropzone.style.display = "flex";
    if (noCoverNote) noCoverNote.style.display = "block";
  });

  // Form Submission
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

    const newBook = BookStore.addBook({
      title,
      author,
      isbn,
      publisher: bookPublisher.value.trim(),
      year: bookYear.value.trim(),
      description: bookDescription.value.trim(),
      coverImage: uploadedCoverDataUrl,
      fileName: uploadedFileName,
      fileSize: uploadedFileSize
    });

    // Navigate to book details
    window.location.href = `book-details.html?id=${encodeURIComponent(newBook.id)}`;
  });

  updateFormValidity();
});
