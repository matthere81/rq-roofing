// RQ Roofing demo — slider, form, FAQ
(function () {
  'use strict';

  // Before/after slider
  document.querySelectorAll('.ba-wrap').forEach(function (wrap) {
    var after = wrap.querySelector('.ba-after');
    var handle = wrap.querySelector('.ba-handle');
    if (!after || !handle) return;
    var afterImg = after.querySelector('img');
    var pos = 50;
    function sizeAfterImg() {
      if (afterImg) afterImg.style.width = wrap.offsetWidth + 'px';
    }
    function setPos(p) {
      pos = Math.max(4, Math.min(96, p));
      after.style.width = pos + '%';
      handle.style.left = pos + '%';
      handle.setAttribute('aria-valuenow', Math.round(pos));
      sizeAfterImg();
    }
    function fromEvent(e) {
      var r = wrap.getBoundingClientRect();
      var x = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX) - r.left;
      setPos((x / r.width) * 100);
    }
    var dragging = false;
    handle.addEventListener('pointerdown', function (e) { dragging = true; handle.setPointerCapture(e.pointerId); fromEvent(e); });
    wrap.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    wrap.addEventListener('pointerup', function () { dragging = false; });
    wrap.addEventListener('pointercancel', function () { dragging = false; });
    wrap.addEventListener('click', fromEvent);
    setPos(50);
  });

  // Keep after-images full-width when the viewport changes
  window.addEventListener('resize', function () {
    document.querySelectorAll('.ba-wrap').forEach(function (w) {
      var img = w.querySelector('.ba-after img');
      if (img) img.style.width = w.offsetWidth + 'px';
    });
  });

  // Estimate forms — demo behavior: validate, then show confirmation.
  document.querySelectorAll('.estimate-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var ok = true;
      [name, phone].forEach(function (f) {
        if (!f || !f.value.trim()) { ok = false; f.classList.add('field-error'); f.setAttribute('aria-invalid', 'true'); }
        else { f.classList.remove('field-error'); f.removeAttribute('aria-invalid'); }
      });
      if (!ok) { (name.value.trim() ? phone : name).focus(); return; }
      var card = form.closest('.estimate-card') || form.parentElement;
      var success = card.querySelector('.form-success');
      var fields = card.querySelectorAll('.form-fields, .estimate-form');
      fields.forEach(function (el) { el.style.display = 'none'; });
      if (success) {
        var nm = name.value.trim().split(' ')[0];
        var who = success.querySelector('.success-name');
        if (who && nm) who.textContent = nm + ', ';
        success.classList.add('show');
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); });
      if (!open) item.classList.add('open');
    });
  });

  // Footer year
  document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
