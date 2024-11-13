import { 
  openMenu, 
  closeMenu, 
  saveToLocalStorage, 
  getFromLocalStorage, 
  updateNotificationCounts,
  isInCart,
  isInWishlist
} from "./functions.js";

const BASE_URL = "http://localhost:3000";

// Selectors
const menuIcon = document.querySelector(".menuIcon");
const menuBar = document.querySelector(".menuBar");
const closeIcon = document.querySelector(".closeIcon");
const notificationFavIcon = document.querySelector(".notificationFavIcon");
const notificationCartIcon = document.querySelector(".notificationCartIcon");
const prevArrow = document.querySelector(".arrows .prev");
const nextArrow = document.querySelector(".arrows .next");
const products_container = document.querySelector(".swiper-wrapper");

let cart = getFromLocalStorage("cart");
let wishlist = getFromLocalStorage("wishlist");

// Menu Functionality
menuIcon.onclick = () => openMenu(menuBar);
closeIcon.onclick = () => closeMenu(menuBar);

document.addEventListener("DOMContentLoaded", () => {
  getAllProducts();
  updateNotificationCounts();
});

async function getAllProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  const finalRes = await res.json();
  displayProducts(finalRes);
}

function displayProducts(products) {

  products.forEach((product) => {
    products_container.innerHTML += `
      <div class="swiper-slide">
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
            <div class="newBadge"><p>New</p></div>
            <div class="wishListIcon ${isInWishlist(product) ? 'fav' : ''}"><i class="fa-solid fa-heart"></i></div>
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
            <button class="${isInCart(product) ? 'added' : ''}">Add To Cart</button>
          </div>
        </div>
      </div>`;
  });

  // Initialize Swiper
  const swiper = new Swiper(".swiper", {
    loop: true,
    speed: 1000,
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 150 },
      375: { slidesPerView: 2, spaceBetween: 100 },
      460: { slidesPerView: 2, spaceBetween: 70 },
      600: { slidesPerView: 3, spaceBetween: 280 },
      768: { slidesPerView: 3, spaceBetween: 350 },
      1024: { slidesPerView: 3, spaceBetween: 250 },
      1440: { slidesPerView: 4, spaceBetween: 180 },
    },
  });
  swiper.slideNext();

  // Arrow functionality
  prevArrow.addEventListener("click", () => swiper.slidePrev());
  nextArrow.addEventListener("click", () => swiper.slideNext());

  // Set up event listeners
  setupEventListeners(products);
}

function setupEventListeners(products) {
  const wishListIconList = document.querySelectorAll(".wishListIcon");
  const addToCartButtons = document.querySelectorAll(".card button");

  addToCartButtons.forEach((button) => {
    button.onclick = () => {
      const card = button.closest(".card");
      const productId = card.getAttribute("data-id");
      let singleProduct = products.find((p) => p.id == productId);

      let obj = cart.find((ele) => ele.id == singleProduct.id);
      if (obj === undefined) {
        cart.push({ ...singleProduct, quantity: 1 });
        button.classList.add("added");
      } else {
        cart = cart.filter((ele) => ele.id !== singleProduct.id);
        button.classList.remove("added");
      }
      saveToLocalStorage("cart", cart);
      updateNotificationCounts(); // Immediate update
    };
  });

  wishListIconList.forEach((wishListIcon) => {
    wishListIcon.onclick = () => {
      const card = wishListIcon.closest(".card");
      const productId = card.getAttribute("data-id");
      let singleProduct = products.find((p) => p.id == productId);

      let obj = wishlist.find((ele) => ele.id == singleProduct.id);
      if (obj === undefined) {
        wishlist.push(singleProduct);
        wishListIcon.classList.add("fav");
      } else {
        wishlist = wishlist.filter((ele) => ele.id !== singleProduct.id);
        wishListIcon.classList.remove("fav");
      }
      saveToLocalStorage("wishlist", wishlist);
      updateNotificationCounts(); // Immediate update
    };
  });

  // Add click event listeners to each card link
  const cardLinks = document.querySelectorAll(".cardLink");
  cardLinks.forEach(link => {
    link.onclick = (event) => {
      event.preventDefault(); // Prevent default navigation
      const card = event.target.closest(".card");
      const productId = card.getAttribute("data-id");
      const product = products.find(item => item.id == productId);

      if (product) {
        // Save the clicked product to localStorage
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        // Redirect to burgerCard.html
        window.location.href = "./burgerCard.html";
      }
    };
  });
}

  // Modal functionality
  const modal = document.getElementById("videoModal");
  const playButton = document.getElementById("playButton");
  const closeButton = document.getElementById("closeButton");

  playButton.onclick = () => (modal.style.display = "flex");
  closeButton.onclick = () => (modal.style.display = "none");
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };






