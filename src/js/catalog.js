/**
 * catalog.js — Livraria Book Catalog Controller
 */
import { BookStore } from "./global.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchContainer = document.getElementById("searchContainer");
  const searchClearBtn = document.getElementById("searchClearBtn");
  const authorFilter = document.getElementById("authorFilter");
  const yearFilter = document.getElementById("yearFilter");
  const sortFilter = document.getElementById("sortFilter");
  const appliedFiltersRow = document.getElementById("appliedFiltersRow");
  const catalogCountText = document.getElementById("catalogCountText");
  const catalogSummaryRight = document.getElementById("catalogSummaryRight");
  const catalogContent = document.getElementById("catalogContent");

  let allBooks = BookStore.getBooks();

  // Populate Filter Dropdowns
  function populateFilters() {
    const authors = [...new Set(allBooks.map(b => b.author).filter(Boolean))].sort();
    const years = [...new Set(allBooks.map(b => b.year).filter(Boolean))].sort((a, b) => b - a);

    // Keep current selected if valid
    const currentAuthor = authorFilter.value;
    const currentYear = yearFilter.value;

    authorFilter.innerHTML = `<option value="">All authors</option>`;
    authors.forEach(author => {
      const opt = document.createElement("option");
      opt.value = author;
      opt.textContent = author;
      if (author === currentAuthor) opt.selected = true;
      authorFilter.appendChild(opt);
    });

    yearFilter.innerHTML = `<option value="">All years</option>`;
    years.forEach(year => {
      const opt = document.createElement("option");
      opt.value = year;
      opt.textContent = year;
      if (year === currentYear) opt.selected = true;
      yearFilter.appendChild(opt);
    });
  }

  // Filter & Sort Logic
  function getFilteredBooks() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedAuthor = authorFilter.value;
    const selectedYear = yearFilter.value;
    const sortBy = sortFilter.value;

    let result = allBooks.filter(book => {
      const matchesQuery = !query || 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.isbn && book.isbn.toLowerCase().includes(query));

      const matchesAuthor = !selectedAuthor || book.author === selectedAuthor;
      const matchesYear = !selectedYear || book.year === selectedYear;

      return matchesQuery && matchesAuthor && matchesYear;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      } else if (sortBy === "year-desc") {
        return (Number(b.year) || 0) - (Number(a.year) || 0);
      } else if (sortBy === "year-asc") {
        return (Number(a.year) || 0) - (Number(b.year) || 0);
      }
      return 0;
    });

    return result;
  }

  // Render Book Card
  function createBookCard(book) {
    const card = document.createElement("a");
    card.href = `book-details.html?id=${encodeURIComponent(book.id)}`;
    card.className = "book-card";
    card.setAttribute("aria-label", `${book.title} by ${book.author}`);

    let coverInnerHtml = "";
    if (book.coverImage) {
      coverInnerHtml = `
        <div class="book-cover" style="background-color: ${book.coverColor || '#344F43'}">
          <div class="spine-rule"></div>
          <img src="${book.coverImage}" alt="Cover of ${book.title}" class="book-cover-img">
        </div>
      `;
    } else {
      const emblem = book.coverEmblem || "flower-2.svg";
      coverInnerHtml = `
        <div class="book-cover" style="background-color: ${book.coverColor || '#344F43'}">
          <div class="spine-rule"></div>
          <p class="book-cover-title">${escapeHtml(book.title)}</p>
          <div class="book-cover-emblem">
            <img src="../assets/icons/${emblem}" alt="" aria-hidden="true">
          </div>
          <p class="book-cover-author">${escapeHtml(book.author)}</p>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="cover-well">
        ${coverInnerHtml}
      </div>
      <div class="book-info">
        <h2 class="book-title">${escapeHtml(book.title)}</h2>
        <p class="book-author">${escapeHtml(book.author)}</p>
        <p class="book-year">${escapeHtml(book.year || "")}</p>
      </div>
    `;

    return card;
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Render Catalog
  function render() {
    allBooks = BookStore.getBooks();
    const query = searchInput.value.trim();
    const selectedAuthor = authorFilter.value;
    const selectedYear = yearFilter.value;
    const isFiltered = Boolean(query || selectedAuthor || selectedYear);

    // Update Search clear button & container active border
    if (query) {
      searchClearBtn.classList.add("visible");
      searchContainer.classList.add("has-query");
    } else {
      searchClearBtn.classList.remove("visible");
      searchContainer.classList.remove("has-query");
    }

    // Update filter active states
    authorFilter.classList.toggle("active-filter", Boolean(selectedAuthor));
    yearFilter.classList.toggle("active-filter", Boolean(selectedYear));

    // Update Applied Filter Chips
    renderFilterChips(query, selectedAuthor, selectedYear);

    // Check Case 1: Empty Library (0 books overall)
    if (allBooks.length === 0) {
      catalogSummaryBar.style.display = "none";
      catalogContent.innerHTML = `
        <div class="empty-state-container" role="region" aria-label="Empty library">
          <div class="empty-state-illustration">
            <img src="../assets/images/catalog-books.png" alt="" aria-hidden="true">
          </div>
          <div class="empty-state-message">
            <h2 class="empty-state-title">Every library starts with one book</h2>
            <p class="empty-state-desc">
              Your shelves are empty for now. Add your first book to keep its cover, author, and details together.
            </p>
          </div>
          <a href="add-book.html" class="btn btn-primary">
            <img src="../assets/icons/plus.svg" alt="" aria-hidden="true">
            <span>Add your first book</span>
          </a>
          <div class="start-simple-tip">
            <h3 class="start-simple-tip-title">Start simple</h3>
            <p class="start-simple-tip-desc">
              A title and an author are all you need. You can add a cover and the other details later.
            </p>
          </div>
        </div>
      `;
      return;
    }

    catalogSummaryBar.style.display = "flex";
    const filtered = getFilteredBooks();

    // Check Case 2: No Search/Filter Results
    if (filtered.length === 0) {
      const searchTarget = query ? `“${query}”` : "this filter";
      catalogCountText.textContent = `0 books found for ${searchTarget}`;
      catalogSummaryRight.innerHTML = `
        <button type="button" class="catalog-results-sublink" id="viewAllLink">
          View all ${allBooks.length} books
        </button>
      `;
      document.getElementById("viewAllLink")?.addEventListener("click", resetFilters);

      catalogContent.innerHTML = `
        <div class="empty-state-container" role="region" aria-label="No matching books">
          <div class="empty-state-icon-well">
            <img src="../assets/icons/search-x.svg" alt="" aria-hidden="true">
          </div>
          <div class="empty-state-message">
            <h2 class="empty-state-title">No matching books, just yet</h2>
            <p class="empty-state-desc">
              Try another title, an author’s name, or an ISBN. Your ${allBooks.length} books are still here—this search just didn’t find a match.
            </p>
          </div>
          <button type="button" class="btn btn-primary" id="resetEmptyBtn">
            <img src="../assets/icons/rotate-ccw.svg" alt="" aria-hidden="true">
            <span>Clear search and filters</span>
          </button>
        </div>
      `;
      document.getElementById("resetEmptyBtn")?.addEventListener("click", resetFilters);
      return;
    }

    // Check Case 3: Books Present
    if (isFiltered) {
      const countLabel = filtered.length === 1 ? "1 book found" : `${filtered.length} books found`;
      const queryContext = query ? ` for “${query}”` : "";
      catalogCountText.textContent = `${countLabel}${queryContext}`;
      catalogSummaryRight.innerHTML = `
        <button type="button" class="catalog-results-sublink" id="viewAllLink">
          View all ${allBooks.length} books
        </button>
      `;
      document.getElementById("viewAllLink")?.addEventListener("click", resetFilters);
    } else {
      catalogCountText.textContent = `${allBooks.length} books in your library`;
      catalogSummaryRight.innerHTML = `
        <div class="catalog-grid-icon" title="Grid view">
          <img src="../assets/icons/layout-grid.svg" alt="" aria-hidden="true">
        </div>
      `;
    }

    // Render Grid
    catalogContent.innerHTML = `<div id="booksGrid" class="books-grid" role="region" aria-label="Books list"></div>`;
    const grid = document.getElementById("booksGrid");
    filtered.forEach(book => {
      grid.appendChild(createBookCard(book));
    });
  }

  // Render Chips
  function renderFilterChips(query, selectedAuthor, selectedYear) {
    appliedFiltersRow.innerHTML = "";
    const chips = [];

    if (selectedAuthor) {
      chips.push({
        label: selectedAuthor,
        clear: () => {
          authorFilter.value = "";
          render();
        }
      });
    }

    if (selectedYear) {
      chips.push({
        label: `Year: ${selectedYear}`,
        clear: () => {
          yearFilter.value = "";
          render();
        }
      });
    }

    if (chips.length > 0) {
      appliedFiltersRow.classList.add("visible");
      chips.forEach(chip => {
        const chipEl = document.createElement("div");
        chipEl.className = "filter-chip";
        chipEl.innerHTML = `
          <span>${escapeHtml(chip.label)}</span>
          <button type="button" class="filter-chip-remove" aria-label="Remove filter ${escapeHtml(chip.label)}">
            <img src="../assets/icons/x.svg" alt="" aria-hidden="true">
          </button>
        `;
        chipEl.querySelector(".filter-chip-remove").addEventListener("click", chip.clear);
        appliedFiltersRow.appendChild(chipEl);
      });

      const clearAllBtn = document.createElement("button");
      clearAllBtn.type = "button";
      clearAllBtn.className = "btn-clear-filters";
      clearAllBtn.textContent = "Clear filters";
      clearAllBtn.addEventListener("click", resetFilters);
      appliedFiltersRow.appendChild(clearAllBtn);
    } else {
      appliedFiltersRow.classList.remove("visible");
    }
  }

  function resetFilters() {
    searchInput.value = "";
    authorFilter.value = "";
    yearFilter.value = "";
    sortFilter.value = "title-asc";
    render();
  }

  // Listeners
  searchInput.addEventListener("input", render);
  searchClearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    render();
  });

  authorFilter.addEventListener("change", render);
  yearFilter.addEventListener("change", render);
  sortFilter.addEventListener("change", render);

  // Initial population and parse URL params
  populateFilters();
  const params = new URLSearchParams(window.location.search);
  if (params.get("search")) {
    searchInput.value = params.get("search");
  }
  if (params.get("author")) {
    authorFilter.value = params.get("author");
  }
  if (params.get("focus") === "1") {
    searchInput.focus();
  }

  render();
});
