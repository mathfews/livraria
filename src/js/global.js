/**
 * global.js — Livraria Shared Interactions & Utilities
 */

// Global UI setup: Mobile Drawer
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation drawer toggle
  const menuBtn = document.querySelector(".menu-btn");
  const mobileDrawer = document.querySelector(".mobile-nav-drawer");
  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener("click", () => {
      mobileDrawer.classList.toggle("open");
    });
  }
});
