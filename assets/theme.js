/* Plainlycorn theme — vanilla JS. Sticky buy bar + bundle selector radios.
   Uses a real <form id="pack-buy-form" action="/cart/add"> so external
   scripts (CascadeCheckout PRIME001.js) can hook the form submit event
   at load time — no dynamic form creation. */
(function () {
  // Sticky buy bar visibility on scroll
  const bar = document.querySelector('[data-buy-bar]');
  if (bar) {
    const onScroll = () => {
      if (window.scrollY > 480) bar.classList.add('is-visible');
      else bar.classList.remove('is-visible');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Bundle selector
  const selector = document.querySelector('[data-bundle-selector]');
  if (!selector) return;

  const rows = selector.querySelectorAll('.pack-row');
  const priceEl = selector.querySelector('[data-selected-price]');
  const labelEl = selector.querySelector('[data-selected-label]');
  const shipEl = selector.querySelector('[data-selected-shipping]');
  const ctaEl = selector.querySelector('[data-selected-cta]');
  const barPriceEl = document.querySelector('[data-buy-bar-price]');
  const barCtaEl = document.querySelector('[data-buy-bar-cta]');
  const variantInput = document.querySelector('[data-selected-variant-input]');

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

    // Swap the form's hidden variant id — this is what /cart/add + Cascade see
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

  // No custom submit handler — form submits natively via type="submit" on
  // main CTA and via form=pack-buy-form on the sticky bar CTA. Cascade
  // (PRIME001.js) hooks the form's submit event.
})();
