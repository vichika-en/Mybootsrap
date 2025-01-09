document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayCart();
  displayCheckoutCart();

  // Adding event listener for the "Place Order" button
  document.getElementById("checkout-form").addEventListener("submit", placeOrder);
});

// Function to update the cart count on the icon
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    const cart = getCart();
    const cartCount = cart.reduce((sum, product) => sum + product.quantity, 0);
    cartCountElement.textContent = cartCount;
  }
}

// Function to add a product to the cart
function addToCart(productName, productPrice, productImage) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let productIndex = cart.findIndex((product) => product.name === productName);
  if (productIndex > -1) {
    cart[productIndex].quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: productPrice,
      quantity: 1,
      image: productImage,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(productName + " has been added to your cart.");
  displayCart();
  updateCartCount();
}

// Function to remove a product from the cart
function removeFromCart(productName) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let productIndex = cart.findIndex((product) => product.name === productName);
  if (productIndex > -1) {
    if (cart[productIndex].quantity > 1) {
      cart[productIndex].quantity -= 1;
    } else {
      cart.splice(productIndex, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(productName + " has been removed from your cart.");
  } else {
    alert(productName + " is not in your cart.");
  }
  displayCart();
  updateCartCount();
}

// Function to retrieve the cart from local storage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Function to display the cart contents
function displayCart() {
  let cart = getCart();
  let cartItems = document.getElementById("cart-items");
  let cartTotal = document.getElementById("cart-total");
  let totalProducts = document.getElementById("total-products");
  let total = 0;
  let productCount = 0;
  if (cartItems) {
    cartItems.innerHTML = "";
    if (cart.length === 0) {
      cartItems.innerHTML = "<p>Your cart is empty.</p>";
      cartTotal.innerText = "Total: $0.00";
      totalProducts.innerText = "Total Products: 0";
      return;
    }
    cart.forEach((product) => {
      total += product.price * product.quantity;
      productCount += product.quantity;
      let listItem = document.createElement("li");
      listItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      listItem.innerHTML = `
                <div class="product-details">
                    <h5>${product.name}</h5>
                    <p>$${product.price.toFixed(2)} x ${product.quantity}</p>
                </div>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart('${
                  product.name
                }')">Remove</button>
            `;
      cartItems.appendChild(listItem);
    });
    cartTotal.innerText = `Total: $${total.toFixed(2)}`;
    totalProducts.innerText = `Total Products: ${productCount}`;
  }
}

// Function to display cart contents on the checkout page
function displayCheckoutCart() {
  let cart = getCart();
  let checkoutCartItems = document.getElementById("checkout-cart-items");
  let checkoutCartTotal = document.getElementById("checkout-cart-total");
  let total = 0;

  if (checkoutCartItems) {
    checkoutCartItems.innerHTML = "";
    if (cart.length === 0) {
      checkoutCartItems.innerHTML = "<p>Your cart is empty.</p>";
      checkoutCartTotal.innerText = "Total: $0.00";
      return;
    }
    cart.forEach((product) => {
      total += product.price * product.quantity;
      let listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
      listItem.innerHTML = `
                <div class="product-details">
                    <h5>${product.name}</h5>
                    <p>$${product.price.toFixed(2)} x ${product.quantity}</p>
                </div>
            `;
      checkoutCartItems.appendChild(listItem);
    });
    checkoutCartTotal.innerText = `Total: $${total.toFixed(2)}`;
  }
}

// Function to calculate total amount
function calculateTotalAmount() {
    let cart = getCart();
    return cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
}

// Function to calculate total products
function calculateTotalProducts() {
    let cart = getCart();
    return cart.reduce((count, product) => count + product.quantity, 0);
}

// Function to handle order placement
function placeOrder(event) {
    event.preventDefault();

    const fullName = document.getElementById("full-name").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const postalCode = document.getElementById("postal-code").value;
    const country = document.getElementById("country").value;
    const email = document.getElementById("email").value;

    if (fullName && address && city && postalCode && country && email) {
        alert("Payment Success!");
        localStorage.removeItem("cart"); // Clear the cart after placing the order
        document.getElementById("checkout-form").reset(); // Clear the form
        displayCheckoutCart(); // Refresh the cart display
    } else {
        alert("Please fill in all required fields.");
    }
}
