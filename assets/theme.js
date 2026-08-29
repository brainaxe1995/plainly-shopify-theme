/* Plainly theme — vanilla JS. Sticky buy bar + bundle selector radios. */
(function () {
  // Sticky buy bar
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
  if (selector) {
    const rows = selector.querySelectorAll('.pack-row');
    const priceEl = selector.querySelector('[data-selected-price]');
    const labelEl = selector.querySelector('[data-selected-label]');
    const shipEl = selector.querySelector('[data-selected-shipping]');
    const ctaEl = selector.querySelector('[data-selected-cta]');
    const barPriceEl = document.querySelector('[data-buy-bar-price]');

    const freeOver = parseFloat(selector.dataset.freeOver || '99');
    const shipFee = parseFloat(selector.dataset.shipFee || '7.95');
    const currency = selector.dataset.currency || '$';
    const money = (n) => `${currency}${n.toFixed(2)}`;

    function setActive(row) {
      rows.forEach((r) => r.classList.remove('is-active'));
      row.classList.add('is-active');
      const input = row.querySelector('input[type="radio"]');
      if (input) input.checked = true;

      const price = parseFloat(row.dataset.price);
      const label = row.dataset.label;
      const soldOut = row.dataset.soldOut === 'true';
      const url = row.dataset.url;

      if (priceEl) priceEl.textContent = money(price);
      if (labelEl) labelEl.textContent = 'Your price · ' + label;
      if (shipEl) {
        shipEl.textContent = price >= freeOver
          ? 'Free shipping, because this order is over ' + money(freeOver) + '.'
          : money(shipFee) + ' shipping added at checkout. Free over ' + money(freeOver) + '.';
      }
      if (ctaEl) {
        ctaEl.textContent = soldOut ? 'Back soon' : 'Yes, start tonight for ' + money(price);
        ctaEl.disabled = soldOut;
        if (url && !soldOut) ctaEl.dataset.checkoutUrl = url;
      }
      if (barPriceEl) barPriceEl.textContent = money(price);
    }

    rows.forEach((row) => {
      row.addEventListener('click', (e) => {
        if (row.classList.contains('is-soldout')) return;
        setActive(row);
      });
    });

    // CTA — add selected variant to cart then go to checkout
    if (ctaEl) {
      ctaEl.addEventListener('click', () => {
        const active = selector.querySelector('.pack-row.is-active');
        if (!active) return;
        const variantId = active.dataset.variantId;
        if (!variantId) return;
        const form = document.createElement('form');
        form.action = '/cart/add';
        form.method = 'post';
        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'id';
        idInput.value = variantId;
        const qtyInput = document.createElement('input');
        qtyInput.type = 'hidden';
        qtyInput.name = 'quantity';
        qtyInput.value = '1';
        const ret = document.createElement('input');
        ret.type = 'hidden';
        ret.name = 'return_to';
        ret.value = '/checkout';
        form.appendChild(idInput);
        form.appendChild(qtyInput);
        form.appendChild(ret);
        document.body.appendChild(form);
        form.submit();
      });
    }
  }
})();
