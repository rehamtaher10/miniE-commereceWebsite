export function openMenu(menuBar ){
        menuBar.style.right= "0";
}
export function closeMenu(menuBar){
    menuBar.style.right= "-100rem";
}

export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  export function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  
  export function addToCart(product) {
    let cart = getFromLocalStorage("cart");
    let existingProduct = cart.find((item) => item.id === product.id);
    if (!existingProduct) {
      cart.push({ ...product, quantity: 1 });
      saveToLocalStorage("cart", cart);
      return true; // Indicate that the product was added
    }
    return false; // Indicate that the product was already in the cart
  }
  
  export function removeFromCart(productId) {
    let cart = getFromLocalStorage("cart");
    cart = cart.filter((item) => item.id !== productId);
    saveToLocalStorage("cart", cart);
  }
  
  export function addToWishlist(product) {
    let wishlist = getFromLocalStorage("wishlist");
    if (!wishlist.find((item) => item.id === product.id)) {
      wishlist.push(product);
      saveToLocalStorage("wishlist", wishlist);
      return true; // Indicate that the product was added
    }
    return false; // Indicate that the product was already in the wishlist
  }
  
  export function removeFromWishlist(productId) {
    let wishlist = getFromLocalStorage("wishlist");
    wishlist = wishlist.filter((item) => item.id !== productId);
    saveToLocalStorage("wishlist", wishlist);
  }
  
  export function updateNotificationCounts() {
    const wishlist = getFromLocalStorage("wishlist") || [];
    const cart = getFromLocalStorage("cart") || [];
    document.querySelector(".notificationFavIcon").textContent = wishlist.length;
    document.querySelector(".notificationCartIcon").textContent = cart.length;
  }

  export function isInCart(product) {
    const cart = getFromLocalStorage("cart") || [];
    return cart.some((item) => item.id === product.id);
  }
  
  export function isInWishlist(product) {
    const wishlist = getFromLocalStorage("wishlist") || [];
    return wishlist.some((item) => item.id === product.id);
  }
  
  
