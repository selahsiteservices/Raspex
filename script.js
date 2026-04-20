// Cart state
let cart = [];

const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartFab = document.getElementById('cartFab');
const cartClose = document.getElementById('cartClose');
const checkoutBtn = document.getElementById('checkoutBtn');

const STRIPE_PUBLISHABLE_KEY = 'pk_live_51TOIf5B5y3wD0BeaeoNuGNz7BlG2sok5HXw0hMWtRHy8Pw564kcG6O7o9uEhYGkFKLvb5wCsWsZQU9W7MvQ9xCTj00AB2Jsmzf';

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    cartTotal.textContent = '$0';
    cartCount.textContent = '0';
    return;
  }

  cartItems.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i})">&times;</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `$${total}`;
  cartCount.textContent = cart.length;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function addToCart(name, price) {
  cart.push({ name, price: parseInt(price) });
  renderCart();
  openCart();
}

// Add to cart buttons
document.querySelectorAll('.btn-secondary[data-product]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    addToCart(btn.dataset.product, btn.dataset.price);
  });
});

// Cart open/close
cartFab.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

checkoutBtn.addEventListener('click', async () => {
  if (cart.length === 0) return;
  checkoutBtn.textContent = 'Redirecting...';
  checkoutBtn.disabled = true;
  try {
    const res = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Checkout error. Please try again.');
      checkoutBtn.textContent = 'Checkout with Stripe';
      checkoutBtn.disabled = false;
    }
  } catch {
    alert('Checkout error. Please try again.');
    checkoutBtn.textContent = 'Checkout with Stripe';
    checkoutBtn.disabled = false;
  }
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));

// Email signup
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm.querySelector('input').value;
    signupForm.innerHTML = `<p style="color:var(--raspberry);font-weight:600;">You're in. Welcome to the Raspex family.</p>`;
    // TODO: wire to email list (Mailchimp / ConvertKit / etc.)
    console.log('Signup:', email);
  });
}
