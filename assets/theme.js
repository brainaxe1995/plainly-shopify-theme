/* Plainlycorn theme — vanilla JS. Sticky buy bar + bundle selector radios.
   Currency-agnostic: every price string comes from Liquid `| money` filter
   via data-*-formatted attributes. No hardcoded symbols here. */
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

  // Add active pack to cart, go to checkout
  function submitPack(variantId) {
    if (!variantId) return;
    const form = document.createElement('form');
    form.action = '/cart/add';
    form.method = 'post';
    const idInput = document.createElement('input');
    idInput.type = 'hidden'; idInput.name = 'id'; idInput.value = variantId;
    const qtyInput = document.createElement('input');
    qtyInput.type = 'hidden'; qtyInput.name = 'quantity'; qtyInput.value = '1';
    const ret = document.createElement('input');
    ret.type = 'hidden'; ret.name = 'return_to'; ret.value = '/checkout';
    form.appendChild(idInput);
    form.appendChild(qtyInput);
    form.appendChild(ret);
    document.body.appendChild(form);
    form.submit();
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

  const freeOverCents = parseInt(selector.dataset.freeOverCents || '0', 10);
  const shipFeeFormatted = selector.dataset.shipFeeFormatted || '';
  const shipOverFormatted = selector.dataset.shipOverFormatted || '';
  const ctaPre = ctaEl ? (ctaEl.dataset.ctaPre || 'Yes, start tonight for') : '';
  const barCtaPre = barCtaEl ? (barCtaEl.dataset.ctaPre || 'Start tonight for') : '';

  let currentVariantId = null;

  function setActive(row) {
    rows.forEach((r) => r.classList.remove('is-active'));
    row.classList.add('is-active');
    const input = row.querySelector('input[type="radio"]');
    if (input) input.checked = true;

    const priceCents = parseInt(row.dataset.priceCents, 10);
    const priceFormatted = row.dataset.priceFormatted;
    const label = row.dataset.label;
    const soldOut = row.dataset.soldOut === 'true';
    currentVariantId = row.dataset.variantId;

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

  // Initialise currentVariantId from default-active row
  const defaultActive = selector.querySelector('.pack-row.is-active');
  if (defaultActive) currentVariantId = defaultActive.dataset.variantId;

  if (ctaEl) ctaEl.addEventListener('click', () => submitPack(currentVariantId));
  if (barCtaEl) barCtaEl.addEventListener('click', () => submitPack(currentVariantId));
})();
