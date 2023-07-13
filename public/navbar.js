/* global document */

// Toggle the mobile menu
const mobileMenuButton = document.querySelector('.sm\\:hidden button');
const mobileMenu = document.querySelector('#mobile-menu');

mobileMenuButton?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Toggle the user menu
const userMenuButton = document.querySelector('#user-menu-button');
const userMenus = document.querySelectorAll('#user-menu');

userMenuButton?.addEventListener('click', () => {
  userMenus.forEach((userMenu) => {
    userMenu.classList.toggle('hidden');
  });
});
