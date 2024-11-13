import {
  openMenu,
  closeMenu,
  saveToLocalStorage,
  getFromLocalStorage,
  addToCart,
  removeFromCart,
  addToWishlist,
  removeFromWishlist,
  updateNotificationCounts,
  isInCart
} from "./functions.js";

const BASE_URL = "http://localhost:3000";

// Selectors
const menuIcon = document.querySelector(".menuIcon");
const menuBar = document.querySelector(".menuBar");
const closeIcon = document.querySelector(".closeIcon");
const emptyWishListMessage = document.querySelector(".emptywishList");
let wishList = getFromLocalStorage("wishlist") || [];
const wishListCards = document.querySelector(".cards");

// Menu Functionality
menuIcon.onclick = () => openMenu(menuBar);
closeIcon.onclick = () => closeMenu(menuBar);

// Load and display wishlist products on page load
document.addEventListener("DOMContentLoaded", () => {
  if (wishList.length === 0) {
    emptyWishListMessage.style.display = "block";
    wishListCards.style.display = "none";
  } else {
    emptyWishListMessage.style.display = "none";
    wishListCards.style.display = "flex"; 
    displayWishListProducts();
  }
  updateNotificationCounts();
});

function displayWishListProducts() {
  // Clear any existing content to avoid duplicates
  wishListCards.innerHTML = "";

  wishList.forEach((product) => {
    wishListCards.innerHTML += `
        <div class="card" data-id="${product.id}">
          <div class="imgCard">
            <a href="./burgerCard.html" class="cardLink">
              <img src="${product.image}" alt="burgerImg" />
            </a>
            <div class="rating">
              <p class="price">${product.price}</p>
              <div class="rate">
                <i class="fa-solid fa-star"></i>
                <span>${product.rate}</span>
              </div>
            </div>
            <div class="newBadge">
              <p>New</p>
            </div>
            <div class="wishListIcon fav">
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
            <button class="${
              isInCart(product) ? "added" : ""
            }">Add To Cart</button>
          </div>
        </div>`;
  });

  // Set up event listeners for dynamic elements
  setupEventListeners();
}

function setupEventListeners() {
  // Wishlist Icon Event Listeners
  const wishListIcons = document.querySelectorAll(".wishListIcon");
  wishListIcons.forEach((icon) => {
    icon.onclick = (event) => {
      const card = event.target.closest(".card");
      const productId = card.getAttribute("data-id");
      const product = wishList.find((item) => item.id == productId);

      if (product) {
        removeFromWishlist(productId);
        card.remove(); // Remove the product card from the wishlist page

        // Update the local wishlist variable after removal
        wishList = getFromLocalStorage("wishlist");

        // Check if wishlist is empty and toggle display of empty message
        if (wishList.length === 0) {
          emptyWishListMessage.style.display = "block";
          wishListCards.style.display = "none";
        }
      } 
      else {
        addToWishlist(product);
        icon.classList.add("fav");
      }

      updateNotificationCounts();
    };
  });

  // Add to Cart Button Event Listeners
  const addToCartButtons = document.querySelectorAll(".cardContent button");
  addToCartButtons.forEach((button) => {
    button.onclick = (event) => {
      const card = event.target.closest(".card");
      const productId = card.getAttribute("data-id");
      const product = wishList.find((item) => item.id == productId);

      if (isInCart(product)) {
        removeFromCart(productId);
        button.classList.remove("added");
      } else {
        addToCart(product);
        button.classList.add("added");
      }
      updateNotificationCounts();
    };
  });

 // Add click event listeners to each card link
 const cardLinks = document.querySelectorAll(".cardLink");
 cardLinks.forEach(link => {
   link.onclick = (event) => {
     event.preventDefault(); // Prevent default navigation
     const card = event.target.closest(".card");
     const productId = card.getAttribute("data-id");
     const product = wishList.find(item => item.id == productId);

     if (product) {
       // Save the clicked product to localStorage
       localStorage.setItem("selectedProduct", JSON.stringify(product));
       // Redirect to burgerCard.html
       window.location.href = "./burgerCard.html";
     }
   };
 });
}

