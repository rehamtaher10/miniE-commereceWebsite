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
const categoriesContainer = document.querySelector(".categories");
const cardsContainer = document.querySelector(".cards");

// State variables
let cart = getFromLocalStorage("cart") || [];
let wishlist = getFromLocalStorage("wishlist") || [];
let categories = [];
let products = [];

// Menu Functionality
menuIcon.onclick = () => openMenu(menuBar);
closeIcon.onclick = () => closeMenu(menuBar);

// Fetch categories and display first category products on page load
document.addEventListener("DOMContentLoaded", async () => {
  await fetchCategories();
  updateNotificationCounts();
  if (categories.length > 0) {
    const firstCategory = categories[0];
    displayProductsForCategory(firstCategory);
    highlightSelectedCategory(firstCategory.id);
  }
});

// Fetch categories from JSON server
async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  categories = await res.json();

  categoriesContainer.innerHTML = ""; // Clear existing categories

  categories.forEach((category) => {
    categoriesContainer.innerHTML += `
      <div class="category" data-id="${category.id}" data-title="${category.title}">
        <div class="image">
          <img src="${category.image}" alt="${category.title}" />
        </div>
        <div class="clickedIcon"><i class="fa-solid fa-check"></i></div>
        <div class="title">${category.title}</div>
      </div>
    `;
  });

  // Attach click event listeners to each category after rendering
  setupCategoryEventListeners();
}

// Fetch and display products for a specific category
async function displayProductsForCategory(category) {
  const res = await fetch(`${BASE_URL}/products?categorySlug=${category.title}`);
  products = await res.json();
  displayProducts(products);
}

// Display products in the cards container
function displayProducts(filteredProducts) {
  cardsContainer.innerHTML = ""; // Clear previous products

  if (filteredProducts.length === 0) {
    cardsContainer.innerHTML = `<p>No products available in this category.</p>`;
    return;
  }

  filteredProducts.forEach((product) => {
    cardsContainer.innerHTML += `
      <div class="card" data-id="${product.id}">
        <div class="imgCard">
          <a href="./burgerCard.html" class="cardLink">
            <img src="${product.image}" alt="product image" />
          </a>
          <div class="rating">
            <p class="price">${product.price}</p>
            <div class="rate">
              <i class="fa-solid fa-star"></i>
              <span>${product.rate}</span>
            </div>
          </div>
          <div class="newBadge"><p>New</p></div>
          <div class="wishListIcon ${isInWishlist(product) ? "fav" : ""}">
            <i class="fa-solid fa-heart"></i>
          </div>
        </div>
        <div class="cardContent">
          <h3>${product.title}</h3>
          <div class="cardContentDetails">
            <div class="details">
              <div class="trueIcon"><i class="fa-solid fa-check"></i></div>
              <p>${product.components}</p>
            </div>
            <div class="details">
              <div class="trueIcon"><i class="fa-solid fa-check"></i></div>
              <p>${product.sauce}</p>
            </div>
          </div>
          <button class="${isInCart(product) ? "added" : ""}">Add To Cart</button>
        </div>
      </div>`;
  });

  setupEventListeners(filteredProducts); // Add event listeners to new elements
}

// Set up category click event listeners
function setupCategoryEventListeners() {
  const categoryElements = document.querySelectorAll(".category");

  categoryElements.forEach((categoryElement) => {
    
    categoryElement.addEventListener("click", async () => {
      // Remove 'clicked' class from all category images and icons
      categoryElements.forEach((cat) => {
        cat.querySelector(".image").classList.remove("clicked");
        cat.querySelector(".clickedIcon").classList.remove("clicked");
      });

      // Add 'clicked' class to the selected category’s image and icon
      const imageElement = categoryElement.querySelector(".image");
      const clickedIcon = categoryElement.querySelector(".clickedIcon");
      imageElement.classList.add("clicked");
      clickedIcon.classList.add("clicked");

      // Fetch and display products for the selected category
      const categoryId = categoryElement.getAttribute("data-id");
      const selectedCategory = categories.find((cat) => cat.id == categoryId);
      await displayProductsForCategory(selectedCategory);
    });
  });
}

// Highlight selected category
function highlightSelectedCategory(categoryId) {
  const categoryElements = document.querySelectorAll(".category");
  categoryElements.forEach((categoryElement) => {
    const id = categoryElement.getAttribute("data-id");
    const imageElement = categoryElement.querySelector(".image");
    const clickedIcon = categoryElement.querySelector(".clickedIcon");

    if (id == categoryId) {
      imageElement.classList.add("clicked");
      clickedIcon.classList.add("clicked");
    } else {
      imageElement.classList.remove("clicked");
      clickedIcon.classList.remove("clicked");
    }
  });
}

// Setup event listeners for wishlist and cart functionalities
function setupEventListeners(products) {
  const wishListIcons = document.querySelectorAll(".wishListIcon");
  const addToCartButtons = document.querySelectorAll(".card button");

  addToCartButtons.forEach((button) => {
    button.onclick = () => {
      const card = button.closest(".card");
      const productId = card.getAttribute("data-id");
      let product = products.find((p) => p.id == productId);

      let obj = cart.find((ele) => ele.id == product.id);
      if (!obj) {
        cart.push({ ...product, quantity: 1 });
        button.classList.add("added");
      } else {
        cart = cart.filter((ele) => ele.id !== product.id);
        button.classList.remove("added");
      }
      saveToLocalStorage("cart", cart);
      updateNotificationCounts();
    };
  });

  wishListIcons.forEach((wishListIcon) => {
    wishListIcon.onclick = () => {
      const card = wishListIcon.closest(".card");
      const productId = card.getAttribute("data-id");
      let product = products.find((p) => p.id == productId);

      let obj = wishlist.find((ele) => ele.id == product.id);
      if (!obj) {
        wishlist.push(product);
        wishListIcon.classList.add("fav");
      } else {
        wishlist = wishlist.filter((ele) => ele.id !== product.id);
        wishListIcon.classList.remove("fav");
      }
      saveToLocalStorage("wishlist", wishlist);
      updateNotificationCounts();
    };
  });

  // Click event for navigating to product details page
  const cardLinks = document.querySelectorAll(".cardLink");
  cardLinks.forEach((link) => {
    link.onclick = (event) => {
      event.preventDefault();
      const card = event.target.closest(".card");
      const productId = card.getAttribute("data-id");
      const product = products.find((item) => item.id == productId);

      if (product) {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "./burgerCard.html";
      }
    };
  });
}






