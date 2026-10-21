(() => {
  const FRAME_COUNT = 300;
  const FOLDER = 'ezgif-401bf9df67b7cd4b-jpg';

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.site-section');

  const images = new Array(FRAME_COUNT);
  const loaded = new Array(FRAME_COUNT).fill(false);

  let targetProgress = 0;
  let currentProgress = 0;
  let lastDrawnIndex = -1;
  let isTicking = false;

  // -------------------------------------------------------------
  // E-Commerce Shopping Cart System
  // -------------------------------------------------------------
  let cart = [];

  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartCountEl = document.getElementById('cart-count');
  const drawerItemCountEl = document.getElementById('drawer-item-count');
  const toastEl = document.getElementById('luxury-toast');

  function openCart() {
    if (cartDrawer) {
      cartDrawer.classList.add('open');
      cartDrawer.setAttribute('aria-hidden', 'false');
    }
    if (cartBackdrop) cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) {
      cartDrawer.classList.remove('open');
      cartDrawer.setAttribute('aria-hidden', 'true');
    }
    if (cartBackdrop) cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  function addToCart(id, name, price, img, size) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, img, size, quantity: 1 });
    }
    updateCartUI();
    showToast(`✓ Added ${name} to your luxury bag`);
    openCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }

  function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartUI();
    }
  }

  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCountEl) cartCountEl.textContent = totalItems;
    if (drawerItemCountEl) drawerItemCountEl.textContent = `(${totalItems} ${totalItems === 1 ? 'item' : 'items'})`;
    if (cartSubtotalEl) cartSubtotalEl.textContent = `SLE ${subtotal.toLocaleString()}`;

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(223, 182, 108, 0.4)" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p class="empty-text">Your luxury bag is currently empty.</p>
          <button class="btn-explore-shop" onclick="window.closeCart(); document.querySelector('#collection').scrollIntoView({behavior:'smooth'})">
            Explore Collection
          </button>
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-row">
          <img src="${item.img}" alt="${item.name}" class="cart-row-img">
          <div class="cart-row-details">
            <span class="cart-row-name">${item.name}</span>
            <span class="cart-row-size">${item.size} • Extrait</span>
            <span class="cart-row-price">SLE ${(item.price * item.quantity).toLocaleString()}</span>
          </div>
          <div class="cart-row-controls">
            <button class="cart-qty-btn" onclick="window.changeQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
            <span class="cart-qty-num">${item.quantity}</span>
            <button class="cart-qty-btn" onclick="window.changeQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
            <button class="cart-row-remove" onclick="window.removeFromCart('${item.id}')" aria-label="Remove item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  function handleCheckout() {
    if (cart.length === 0) {
      showToast('Please add items to your luxury bag first.');
      return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for choosing Luxury Parfums.\n\nOrder Total: SLE ${total.toLocaleString()}\nComplimentary White-Glove Courier Delivery in Sierra Leone & Worldwide has been reserved.`);
    cart = [];
    updateCartUI();
    closeCart();
  }

  // Expose global methods for inline HTML onclick handlers
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.changeQuantity = changeQuantity;
  window.openCart = openCart;
  window.closeCart = closeCart;
  window.showToast = showToast;
  window.handleCheckout = handleCheckout;

  // Cart button & backdrop listeners
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  // -------------------------------------------------------------
  // Smooth Navigation & Scroll Position
  // -------------------------------------------------------------
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  function updateActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // -------------------------------------------------------------
  // 3D Canvas Image Sequence Scrubbing & Preload Engine
  // -------------------------------------------------------------
  function getFrameSrc(index) {
    const frameNum = String(index + 1).padStart(3, '0');
    return `${FOLDER}/ezgif-frame-${frameNum}.jpg`;
  }

  function getBestAvailableFrame(index) {
    if (loaded[index]) return index;

    for (let offset = 1; offset < FRAME_COUNT; offset++) {
      const prev = index - offset;
      if (prev >= 0 && loaded[prev]) return prev;

      const next = index + offset;
      if (next < FRAME_COUNT && loaded[next]) return next;
    }
    return -1;
  }

  function renderFrame(index) {
    const frameToDraw = getBestAvailableFrame(index);
    if (frameToDraw === -1) return;

    const img = images[frameToDraw];
    if (!img || !img.complete) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgW = img.naturalWidth || 1920;
    const imgH = img.naturalHeight || 1080;

    const scale = Math.max(w / imgW, h / imgH);
    const renderW = imgW * scale;
    const renderH = imgH * scale;
    const offsetX = (w - renderW) / 2;
    const offsetY = (h - renderH) / 2;

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    lastDrawnIndex = frameToDraw;
  }

  function handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const currentIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(currentProgress * (FRAME_COUNT - 1)))
    );
    renderFrame(currentIndex);
    handleScroll();
  }

  function update() {
    const lerpFactor = 0.085;
    const diff = targetProgress - currentProgress;

    if (Math.abs(diff) > 0.0001) {
      currentProgress += diff * lerpFactor;
    } else {
      currentProgress = targetProgress;
    }

    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(currentProgress * (FRAME_COUNT - 1)))
    );

    if (frameIndex !== lastDrawnIndex || !loaded[lastDrawnIndex]) {
      renderFrame(frameIndex);
    }

    if (Math.abs(targetProgress - currentProgress) > 0.0001 || !isTicking) {
      requestAnimationFrame(update);
      isTicking = true;
    } else {
      isTicking = false;
    }
  }

  function requestTick() {
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(update);
    }
  }

  function handleScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) {
      targetProgress = 0;
    } else {
      targetProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    }

    if (header) {
      if (window.scrollY > 40) {
        header.style.backgroundColor = 'rgba(7, 6, 7, 0.85)';
        header.style.borderColor = 'rgba(223, 182, 108, 0.3)';
      } else {
        header.style.backgroundColor = 'rgba(8, 7, 8, 0.45)';
        header.style.borderColor = 'rgba(223, 182, 108, 0.18)';
      }
    }

    updateActiveNav();
    requestTick();
  }

  function preloadImages() {
    // 1. Initial frame
    const firstImg = new Image();
    firstImg.src = getFrameSrc(0);
    images[0] = firstImg;

    firstImg.onload = () => {
      loaded[0] = true;
      renderFrame(0);
    };

    // 2. Preload remaining frames
    for (let i = 1; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      images[i] = img;

      img.onload = () => {
        loaded[i] = true;
        const currentTargetIndex = Math.round(currentProgress * (FRAME_COUNT - 1));
        if (currentTargetIndex === i && lastDrawnIndex !== i) {
          renderFrame(i);
        }
      };
    }
  }

  // Event Listeners
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Initialize
  handleResize();
  preloadImages();
  handleScroll();
  requestTick();
  updateCartUI();
})();
