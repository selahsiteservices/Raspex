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

// Square payment links per product — replace with real Square links once connected
const SQUARE_LINKS = {
  'Anti-Aging Night Cream': 'https://square.link/u/REPLACE_NIGHT_CREAM',
  'Facial Cleanser': 'https://square.link/u/REPLACE_CLEANSER',
  'Raspberry Seed Oil': 'https://square.link/u/REPLACE_SEED_OIL',
  'Plant Stem Cell Serum': 'https://square.link/u/REPLACE_SERUM',
  'Body & Face Scrub': 'https://square.link/u/REPLACE_SCRUB',
  'Hair Repair Mask': 'https://square.link/u/REPLACE_HAIR_MASK',
  'Raspberry Seed Powder': 'https://square.link/u/REPLACE_POWDER',
  'Lip Trio': 'https://square.link/u/REPLACE_LIP_TRIO',
};

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

// Checkout — if one item, go directly to Square link; if multiple, go to first item's link
// Replace this with a real cart/checkout page once Square is fully connected
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  if (cart.length === 1) {
    const link = SQUARE_LINKS[cart[0].name];
    if (link) window.open(link, '_blank');
  } else {
    // Multi-item: open Square link for each item in new tabs
    cart.forEach(item => {
      const link = SQUARE_LINKS[item.name];
      if (link) window.open(link, '_blank');
    });
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
