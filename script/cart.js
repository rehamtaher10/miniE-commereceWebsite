import {
  openMenu,
  closeMenu,
  saveToLocalStorage,
  getFromLocalStorage,
  updateNotificationCounts,
} from "./functions.js";

const BASE_URL = "http://localhost:3000";

// Selectors
const menuIcon = document.querySelector(".menuIcon");
const menuBar = document.querySelector(".menuBar");
const closeIcon = document.querySelector(".closeIcon");
const emptyCartMessage = document.querySelector(".emptyCart");
let cart = getFromLocalStorage("cart") || [];
const cartCards = document.querySelector(".contentPart1");
const cartCountSpan = document.querySelector(".cartCount span");
const cartContent =document.querySelector(".cartContent")

// Menu Functionality
menuIcon.onclick = () => openMenu(menuBar);
closeIcon.onclick = () => closeMenu(menuBar);

function updateCartCount() {
  cartCountSpan.textContent = cart.length;
}

// Load and display wishlist products on page load
document.addEventListener("DOMContentLoaded", () => {
  if (cart.length === 0) {
    emptyCartMessage.style.display = "block";
    cartContent.style.display = "none";
  } else {
    emptyCartMessage.style.display = "none";
    cartContent.style.display = "block";
    displayCartProducts();
  }
  updateNotificationCounts();
  updateCartCount();
});

function displayCartProducts() {
  // Clear any existing content to avoid duplicates
  cartCards.innerHTML = "";

  cart.forEach((product, index) => {
    cartCards.innerHTML += `
        <div class="card" data-id="${product.id}">
          <div class="image">
            <a href="./burgerCard.html" class="cardLink">
              <img src="${product.image}" />
            </a>
          </div>
          <div class="cardDescription">
            <p class="title">${product.title}</p>
            <p class="price">${product.price}</p>
            <div class="details">
              <p><span>${product.components}</span> <span>Spicy Sauce</span></p>
              <div class="count">
                <button class="minus" data-index="${index}"> - </button>
                <p class="quantity">${product.quantity}</p>
                <button class="plus" data-index="${index}"> + </button>
              </div>
            </div>
          </div>
        </div>`;
  });

  // Set up event listeners for dynamic elements
  setupEventListeners();
}

function setupEventListeners() {
  // Add event listeners for the plus and minus buttons
  const plusButtons = document.querySelectorAll(".plus");
  const minusButtons = document.querySelectorAll(".minus");

  plusButtons.forEach((button) => {
    button.onclick = () => {
      const index = button.getAttribute("data-index");
      cart[index].quantity += 1;
      saveToLocalStorage("cart", cart);
      displayCartProducts(); // Re-render to show updated quantities
    };
  });

  minusButtons.forEach((button) => {
    button.onclick = () => {
      const index = button.getAttribute("data-index");
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveToLocalStorage("cart", cart);
        displayCartProducts(); // Re-render to show updated quantities
      }
    };
  });

  // Add click event listeners to each card link
  const cardLinks = document.querySelectorAll(".cardLink");
  cardLinks.forEach((link) => {
    link.onclick = (event) => {
      event.preventDefault(); // Prevent default navigation
      const card = event.target.closest(".card");
      const productId = card.getAttribute("data-id");
      const product = cart.find((item) => item.id == productId);

      if (product) {
        // Save the clicked product to localStorage
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        // Redirect to burgerCard.html
        window.location.href = "./burgerCard.html";
      }
    };
  });
}
