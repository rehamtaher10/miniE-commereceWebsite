import {
  openMenu,
  closeMenu,
  saveToLocalStorage,
  getFromLocalStorage,
  updateNotificationCounts,
  isInCart,
  isInWishlist,
} from "./functions.js";

const BASE_URL = "http://localhost:3000";

// Selectors
const menuIcon = document.querySelector(".menuIcon");
const menuBar = document.querySelector(".menuBar");
const closeIcon = document.querySelector(".closeIcon");
let selectedProduct = getFromLocalStorage("selectedProduct"); // Single object, not an array
const burgerCard = document.querySelector(".selectedCard");
const headerTitle = document.querySelector(".headerburgerCard h2");
const headerSection = document.querySelector(".header"); // Assuming you want to apply the background image here
let cart = getFromLocalStorage("cart") || [];
let wishlist = getFromLocalStorage("wishlist") || [];

// Menu Functionality
menuIcon.onclick = () => openMenu(menuBar);
closeIcon.onclick = () => closeMenu(menuBar);

// Load and display the selected product on page load
document.addEventListener("DOMContentLoaded", () => {
  if (selectedProduct) {
    displayCardProduct();
    updateHeader(selectedProduct);
  }
  updateNotificationCounts();
});

function displayCardProduct() {
  if (!selectedProduct) {
    burgerCard.innerHTML = "<p>Product not found.</p>";
    return;
  }

  burgerCard.innerHTML = `
      <div class="card" data-id="${selectedProduct.id}">
        <div class="image">
          <img src="${selectedProduct.image}" alt="burgerImg" />
          <div class="wishListIcon ${
            isInWishlist(selectedProduct) ? "fav" : ""
          }">
            <i class="fa-solid fa-heart"></i>
          </div>
        </div>
        <div class="details">
          <div class="title">${selectedProduct.title}</div>
          <div class="description">
                    ${selectedProduct.description}
          </div>
          <div class="price">
            <p>${selectedProduct.price}</p>
          </div>
          <button class="${isInCart(selectedProduct) ? "added" : ""}">
            Add To Cart
          </button>
        </div>
      </div>
    `;

  // Set up event listeners for dynamic elements
  setupEventListeners(selectedProduct);
}

function updateHeader(product) {
  // Update the title in the <h2> element
  headerTitle.textContent = product.title;

  // Update the background image of the header section
  headerSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${product.image})`;
}

function setupEventListeners(product) {
  const wishListIcon = document.querySelector(".wishListIcon");
  const addToCartButton = document.querySelector(".card button");

  // Wishlist functionality
  wishListIcon.onclick = () => {
    let obj = wishlist.find((item) => item.id === product.id);
    if (!obj) {
      wishlist.push(product);
      wishListIcon.classList.add("fav");
    } else {
      wishlist = wishlist.filter((item) => item.id !== product.id);
      wishListIcon.classList.remove("fav");
    }
    saveToLocalStorage("wishlist", wishlist);
    updateNotificationCounts();
  };

  // Add to Cart functionality
  addToCartButton.onclick = () => {
    let obj = cart.find((item) => item.id === product.id);
    if (!obj) {
      cart.push({ ...product, quantity: 1 });
      addToCartButton.classList.add("added");
    } else {
      cart = cart.filter((item) => item.id !== product.id);
      addToCartButton.classList.remove("added");
    }
    saveToLocalStorage("cart", cart);
    updateNotificationCounts();
  };
}
