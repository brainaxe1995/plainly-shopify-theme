/* Plainlycorn theme — vanilla JS.

   CascadeCheckout integration:
   - Cascade PRIME001.js hooks [data-dusto-checkout] and a[href^="/checkout"]
     via document-level click capture. It reads the Shopify cart cookie and
     redirects to CascadeCheckout with cart+session params.
   - Cart must already contain the item at click time — Cascade does not
     add-to-cart itself.
   - Flow: user clicks bundle CTA -> we POST /cart/add.js (AJAX) -> on
     success we programmatically click the hidden [data-cascade-trigger]
     anchor -> Cascade intercepts -> redirects to checkout.plainlycorn.com. */
(function () {
  // Sticky buy bar visibility
  const bar = document.querySelector('[data-buy-bar]');
  if (bar) {
    const onScroll = () => {
      if (window.scrollY > 480) bar.classList.add('is-visible');
      else bar.classList.remove('is-visible');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const selector = document.querySelector('[data-bundle-selector]');
  if (!selector) return;

  const rows = selector.querySelectorAll('.pack-row');
  const priceEl = selector.querySelector('[data-selected-price]');
  const labelEl = selector.querySelector('[data-selected-label]');
  const shipEl = selector.querySelector('[data-selected-shipping]');
  const ctaEl = selector.querySelector('[data-selected-cta]');
  const barPriceEl = document.querySelector('[data-buy-bar-price]');
  const barCtaEl = document.querySelector('[data-buy-bar-cta]');
  const variantInput = selector.querySelector('[data-selected-variant-input]');
  const cascadeTrigger = selector.querySelector('[data-cascade-trigger]');

  const freeOverCents = parseInt(selector.dataset.freeOverCents || '0', 10);
  const shipFeeFormatted = selector.dataset.shipFeeFormatted || '';
  const shipOverFormatted = selector.dataset.shipOverFormatted || '';
  const ctaPre = ctaEl ? (ctaEl.dataset.ctaPre || 'Yes, start tonight for') : '';
  const barCtaPre = barCtaEl ? (barCtaEl.dataset.ctaPre || 'Start tonight for') : '';

  function setActive(row) {
    rows.forEach((r) => r.classList.remove('is-active'));
    row.classList.add('is-active');
    const input = row.querySelector('input[type="radio"]');
    if (input) input.checked = true;

    const priceCents = parseInt(row.dataset.priceCents, 10);
    const priceFormatted = row.dataset.priceFormatted;
    const label = row.dataset.label;
    const soldOut = row.dataset.soldOut === 'true';
    const variantId = row.dataset.variantId;

    if (variantInput && variantId) variantInput.value = variantId;

    if (priceEl) priceEl.textContent = priceFormatted;
    if (labelEl) labelEl.textContent = 'Your price · ' + label;
    if (shipEl) {
      shipEl.textContent = priceCents >= freeOverCents
        ? 'Free shipping, because this order is over ' + shipOverFormatted + '.'
        : shipFeeFormatted + ' shipping added at checkout. Free over ' + shipOverFormatted + '.';
    }
    if (ctaEl) {
      ctaEl.textContent = soldOut ? 'Back soon' : ctaPre + ' ' + priceFormatted;
      ctaEl.disabled = soldOut;
    }
    if (barPriceEl) barPriceEl.textContent = priceFormatted;
    if (barCtaEl) {
      barCtaEl.textContent = soldOut ? 'Back soon' : barCtaPre + ' ' + priceFormatted;
      barCtaEl.disabled = soldOut;
    }
  }

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      if (row.classList.contains('is-soldout')) return;
      setActive(row);
    });
  });

  // 1) AJAX add current variant to Shopify cart
  // 2) Programmatically click the Cascade-hooked anchor
  async function buyNow(btnEl) {
    const variantId = variantInput ? variantInput.value : null;
    if (!variantId) return;
    if (btnEl) {
      btnEl.dataset._label = btnEl.textContent;
      btnEl.textContent = 'Adding to cart…';
      btnEl.disabled = true;
    }
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: parseInt(variantId, 10), quantity: 1 })
      });
      if (!res.ok) throw new Error('cart/add.js ' + res.status);
      // Cart cookie is now set on plainlycorn.com. Trigger Cascade-caught click.
      if (cascadeTrigger) {
        cascadeTrigger.click();
      } else {
        // Fallback: plain checkout redirect (Cascade also hooks a[href^="/checkout"]
        // via its document-level click listener when THIS click is dispatched
        // on the synthetic anchor below).
        const a = document.createElement('a');
        a.href = '/checkout';
        a.setAttribute('data-dusto-checkout', '');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error('[plainly] add-to-cart failed', e);
      if (btnEl) {
        btnEl.textContent = btnEl.dataset._label || 'Try again';
        btnEl.disabled = false;
      }
    }
  }

  if (ctaEl) ctaEl.addEventListener('click', () => buyNow(ctaEl));
  if (barCtaEl) barCtaEl.addEventListener('click', () => buyNow(barCtaEl));
})();
