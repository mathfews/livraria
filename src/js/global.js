/**
 * global.js — Livraria Data Store & Shared Interactions
 */

const SEED_BOOKS = [
  {
    id: "the-secret-garden",
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    year: "2008",
    isbn: "9780141321066",
    publisher: "Puffin Books",
    description: "When Mary Lennox arrives at her uncle’s house on the Yorkshire moors, she discovers a locked garden that has been forgotten for years. With the help of new friends, Mary brings it back to life—and finds a place to belong. A timeless story of friendship, curiosity, and the restorative power of nature.",
    coverColor: "#344F43",
    coverEmblem: "flower-2.svg",
    coverImage: "",
    addedDate: "24 Oct 2026",
    fileName: "secret-garden.jpg",
    fileSize: "420 KB"
  },
  {
    id: "a-room-of-ones-own",
    title: "A Room of One’s Own",
    author: "Virginia Woolf",
    year: "2000",
    isbn: "9780156030410",
    publisher: "Harcourt",
    description: "A landmark feminist essay exploring women as writers and characters in fiction, arguing that a woman must have money and a room of her own if she is to write fiction.",
    coverColor: "#686047",
    coverEmblem: "sun.svg",
    coverImage: "",
    addedDate: "20 Oct 2026"
  },
  {
    id: "anne-of-green-gables",
    title: "Anne of Green Gables",
    author: "L. M. Montgomery",
    year: "2015",
    isbn: "9780141321073",
    publisher: "Puffin Classics",
    description: "The heartwarming tale of Anne Shirley, an imaginative, red-headed orphan girl mistakenly adopted by an elderly brother and sister on Prince Edward Island.",
    coverColor: "#7F5140",
    coverEmblem: "trees.svg",
    coverImage: "",
    addedDate: "18 Oct 2026"
  },
  {
    id: "jane-eyre",
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    year: "2003",
    isbn: "9780141441146",
    publisher: "Penguin Classics",
    description: "An orphan girl overcomes hardship and cruelty to find employment as a governess at Thornfield Hall, where she falls deeply in love with the enigmatic Mr. Rochester.",
    coverColor: "#655465",
    coverEmblem: "feather.svg",
    coverImage: "",
    addedDate: "15 Oct 2026"
  },
  {
    id: "little-women",
    title: "Little Women",
    author: "Louisa May Alcott",
    year: "1998",
    isbn: "9780141439242",
    publisher: "Signet Classics",
    description: "The beloved story of four sisters—Meg, Jo, Beth, and Amy March—growing up in New England during the American Civil War.",
    coverColor: "#3D5A6C",
    coverEmblem: "flower.svg",
    coverImage: "",
    addedDate: "12 Oct 2026"
  },
  {
    id: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: "2002",
    isbn: "9780141439518",
    publisher: "Penguin Books",
    description: "A witty romance chronicling the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner.",
    coverColor: "#544B3D",
    coverEmblem: "leaf.svg",
    coverImage: "",
    addedDate: "10 Oct 2026"
  },
  {
    id: "wuthering-heights",
    title: "Wuthering Heights",
    author: "Emily Brontë",
    year: "2005",
    isbn: "9780141439556",
    publisher: "Penguin Classics",
    description: "A dark, intense story of obsessive passion and revenge set against the haunting Yorkshire moors, following Heathcliff and Catherine Earnshaw.",
    coverColor: "#4A3C4F",
    coverEmblem: "mountain.svg",
    coverImage: "",
    addedDate: "05 Oct 2026"
  },
  {
    id: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: "2004",
    isbn: "9780743273565",
    publisher: "Scribner",
    description: "Set in the Jazz Age on Long Island, the story follows the mysterious millionaire Jay Gatsby and his quixotic passion and obsession for Daisy Buchanan.",
    coverColor: "#2E4B56",
    coverEmblem: "waves.svg",
    coverImage: "",
    addedDate: "01 Oct 2026"
  }
];

const COVER_COLORS = [
  "#344F43", "#686047", "#7F5140", "#655465",
  "#3D5A6C", "#544B3D", "#4A3C4F", "#2E4B56", "#8D563E", "#946550"
];

const COVER_EMBLEMS = [
  "flower-2.svg", "sun.svg", "trees.svg", "feather.svg",
  "leaf.svg", "flower.svg", "mountain.svg", "waves.svg"
];

const STORAGE_KEY = "livraria_books_store";

export const BookStore = {
  getBooks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveBooks(SEED_BOOKS);
      return [...SEED_BOOKS];
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [...SEED_BOOKS];
    } catch {
      return [...SEED_BOOKS];
    }
  },

  saveBooks(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  },

  getBook(id) {
    const books = this.getBooks();
    return books.find(b => b.id === id) || null;
  },

  addBook(data) {
    const books = this.getBooks();
    const id = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
    
    // Pick deterministic emblem and color if none provided
    const colorIndex = books.length % COVER_COLORS.length;
    const emblemIndex = books.length % COVER_EMBLEMS.length;

    const newBook = {
      id,
      title: data.title.trim(),
      author: data.author.trim(),
      year: data.year ? data.year.trim() : "",
      isbn: data.isbn ? data.isbn.trim() : "",
      publisher: data.publisher ? data.publisher.trim() : "",
      description: data.description ? data.description.trim() : "",
      coverColor: data.coverColor || COVER_COLORS[colorIndex],
      coverEmblem: data.coverEmblem || COVER_EMBLEMS[emblemIndex],
      coverImage: data.coverImage || "",
      fileName: data.fileName || "",
      fileSize: data.fileSize || "",
      addedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    };

    books.unshift(newBook);
    this.saveBooks(books);
    return newBook;
  },

  updateBook(id, data) {
    const books = this.getBooks();
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return null;

    books[index] = {
      ...books[index],
      ...data,
      title: data.title ? data.title.trim() : books[index].title,
      author: data.author ? data.author.trim() : books[index].author,
      year: data.year !== undefined ? data.year.trim() : books[index].year,
      isbn: data.isbn !== undefined ? data.isbn.trim() : books[index].isbn,
      publisher: data.publisher !== undefined ? data.publisher.trim() : books[index].publisher,
      description: data.description !== undefined ? data.description.trim() : books[index].description
    };

    this.saveBooks(books);
    return books[index];
  },

  deleteBook(id) {
    let books = this.getBooks();
    const initialLen = books.length;
    books = books.filter(b => b.id !== id);
    this.saveBooks(books);
    return books.length < initialLen;
  },

  resetToDefault() {
    this.saveBooks(SEED_BOOKS);
    return [...SEED_BOOKS];
  }
};

// Global UI setup: Mobile Drawer & Command-K Shortcut
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation drawer toggle
  const menuBtn = document.querySelector(".menu-btn");
  const mobileDrawer = document.querySelector(".mobile-nav-drawer");
  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener("click", () => {
      mobileDrawer.classList.toggle("open");
    });
  }

  // Keyboard shortcut: Cmd+K or Ctrl+K
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      } else {
        // If on another page, navigate to catalog with focus
        window.location.href = "catalog.html?focus=1";
      }
    }
  });
});
