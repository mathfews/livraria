/**
 * book-details.js — Livraria Book Details & Delete Modal Controller
 */
import { BookStore } from "./global.js";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  const detailsContent = document.getElementById("detailsContent");
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
    if (detailsContent) detailsContent.style.display = "none";
    if (notFoundState) notFoundState.style.display = "flex";
  }

  // Populate Details
  detailsContent.style.display = "block";
  document.title = `${book.title} — Livraria`;

  // Cover
  const detailsBookCover = document.getElementById("detailsBookCover");
  const coverTitle = document.getElementById("coverTitle");
  const coverAuthor = document.getElementById("coverAuthor");
  const coverEmblemWrap = document.getElementById("coverEmblemWrap");
  const coverEmblemImg = document.getElementById("coverEmblemImg");

  detailsBookCover.style.backgroundColor = book.coverColor || "#344F43";
  if (book.coverImage) {
    detailsBookCover.innerHTML = `
      <div class="spine-rule"></div>
      <img src="${book.coverImage}" alt="Cover of ${escapeHtml(book.title)}" class="book-cover-img">
    `;
  } else {
    coverTitle.textContent = book.title;
    coverAuthor.textContent = book.author;
    coverEmblemImg.src = `../assets/icons/${book.coverEmblem || "flower-2.svg"}`;
  }

  // Library Status
  document.getElementById("addedStatusText").textContent = 
    `In your library · Added ${book.addedDate || "24 Oct 2026"}`;

  // Title & Author
  document.getElementById("bookTitleDisplay").textContent = book.title;
  document.getElementById("bookAuthorDisplay").textContent = `by ${book.author}`;

  // Edit Link
  document.getElementById("editBookBtn").href = `edit-book.html?id=${encodeURIComponent(book.id)}`;

  // Bibliographic Data
  document.getElementById("bibTitle").textContent = book.title;
  document.getElementById("bibAuthor").textContent = book.author;
  document.getElementById("bibPublisher").textContent = book.publisher || "—";
  document.getElementById("bibYear").textContent = book.year || "—";

  const bibIsbnRow = document.getElementById("bibIsbnRow");
  const isbnLabel = document.getElementById("isbnLabel");
  const bibIsbn = document.getElementById("bibIsbn");
  if (book.isbn) {
    const cleanIsbn = book.isbn.replace(/[-\s]/g, "");
    isbnLabel.textContent = cleanIsbn.length === 13 ? "ISBN-13" : "ISBN-10";
    bibIsbn.textContent = book.isbn;
  } else {
    isbnLabel.textContent = "ISBN";
    bibIsbn.textContent = "—";
  }

  // Description
  const descriptionSection = document.getElementById("descriptionSection");
  const bibDescription = document.getElementById("bibDescription");
  if (book.description) {
    bibDescription.textContent = book.description;
  } else {
    bibDescription.textContent = "No description provided for this edition.";
  }

  // Delete Modal Setup
  const openDeleteModalBtn = document.getElementById("openDeleteModalBtn");
  const deleteModalBackdrop = document.getElementById("deleteModalBackdrop");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  const dialogMiniCover = document.getElementById("dialogMiniCover");
  const dialogBookTitle = document.getElementById("dialogBookTitle");
  const dialogBookAuthor = document.getElementById("dialogBookAuthor");

  function openModal() {
    // Populate mini preview in dialog
    dialogMiniCover.style.backgroundColor = book.coverColor || "#344F43";
    if (book.coverImage) {
      dialogMiniCover.innerHTML = `
        <div class="spine-rule"></div>
        <img src="${book.coverImage}" alt="" class="book-cover-img">
      `;
    } else {
      document.getElementById("dialogCoverTitle").textContent = book.title;
      document.getElementById("dialogCoverAuthor").textContent = book.author;
      document.getElementById("dialogCoverEmblemImg").src = `../assets/icons/${book.coverEmblem || "flower-2.svg"}`;
    }

    dialogBookTitle.textContent = book.title;
    dialogBookAuthor.textContent = book.author;

    deleteModalBackdrop.classList.add("open");
    cancelDeleteBtn.focus();
  }

  function closeModal() {
    deleteModalBackdrop.classList.remove("open");
    openDeleteModalBtn.focus();
  }

  openDeleteModalBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);
  cancelDeleteBtn.addEventListener("click", closeModal);

  // Keyboard navigation & accessibility
  document.addEventListener("keydown", (e) => {
    if (deleteModalBackdrop.classList.contains("open")) {
      if (e.key === "Escape") {
        closeModal();
      }
    }
  });

  // Confirm delete action
  confirmDeleteBtn.addEventListener("click", () => {
    BookStore.deleteBook(book.id);
    window.location.href = "catalog.html";
  });

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
