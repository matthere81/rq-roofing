// RQ Roofing demo — slider, form, FAQ, mobile nav
(function () {
  'use strict';

  // Before/after slider. Base layer = before (left), overlay = after (right).
  document.querySelectorAll('.ba-wrap').forEach(function (wrap) {
    var after = wrap.querySelector('.ba-after');
    var handle = wrap.querySelector('.ba-handle');
    if (!after || !handle) return;
    var afterImg = after.querySelector('img');
    var pos = 50; // divider position from the left, 0–100
    function sizeAfterImg() {
      if (afterImg) afterImg.style.width = wrap.offsetWidth + 'px';
    }
    function setPos(p) {
      pos = Math.max(0, Math.min(100, p));
      after.style.width = (100 - pos) + '%';
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
    handle.addEventListener('keydown', function (e) {
      var step = 0;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') step = -5;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') step = 5;
      else if (e.key === 'Home') { e.preventDefault(); setPos(0); return; }
      else if (e.key === 'End') { e.preventDefault(); setPos(100); return; }
      else return;
      e.preventDefault();
      setPos(pos + step);
    });
    setPos(50);
  });

  // Keep after-images full-width when the viewport changes
  window.addEventListener('resize', function () {
    document.querySelectorAll('.ba-wrap').forEach(function (w) {
      var img = w.querySelector('.ba-after img');
      if (img) img.style.width = w.offsetWidth + 'px';
    });
  });

  // Mobile nav toggle
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    header.querySelectorAll('.main-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.focus();
      }
    });
  }

  // Estimate forms — demo behavior: validate, then show confirmation.
  // NOTE: submissions are not delivered anywhere yet; wire to RQ's email/CRM before launch.
  function setFieldState(input, valid, message) {
    var field = input.closest('.field');
    var msgEl = field ? field.querySelector('.field-msg') : null;
    input.classList.toggle('field-error', !valid);
    if (valid) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    } else {
      input.setAttribute('aria-invalid', 'true');
      if (msgEl && msgEl.id) input.setAttribute('aria-describedby', msgEl.id);
    }
    if (msgEl) {
      msgEl.textContent = valid ? '' : message;
      msgEl.classList.toggle('show', !valid);
    }
  }
  function validName(input) { return input.value.trim().length > 0; }
  function validPhone(input) { return input.value.replace(/\D/g, '').length >= 10; }

  document.querySelectorAll('.estimate-form').forEach(function (form) {
    var name = form.querySelector('[name="name"]');
    var phone = form.querySelector('[name="phone"]');
    if (name) {
      name.addEventListener('input', function () {
        if (validName(name)) setFieldState(name, true, '');
      });
    }
    if (phone) {
      phone.addEventListener('input', function () {
        if (validPhone(phone)) setFieldState(phone, true, '');
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameOk = name && validName(name);
      var phoneOk = phone && validPhone(phone);
      if (name) setFieldState(name, !!nameOk, 'Please enter your name.');
      if (phone) setFieldState(phone, !!phoneOk, 'Please enter a valid 10-digit phone number.');
      if (!nameOk || !phoneOk) { (nameOk ? phone : name).focus(); return; }
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
  document.querySelectorAll('.faq-item').forEach(function (item, i) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    var aid = 'faq-a-' + i;
    a.id = aid;
    q.setAttribute('aria-controls', aid);
    q.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        var oq = o.querySelector('.faq-q');
        if (oq) oq.setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Footer year
  document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
