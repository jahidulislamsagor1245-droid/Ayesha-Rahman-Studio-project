/* =========================================================
   Ayesha Rahman — site scripts
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ---------- Carousel ---------- */
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const dotsWrap = carousel.querySelector('.carousel-dots');
    const prevBtn = carousel.querySelector('[data-prev]');
    const nextBtn = carousel.querySelector('[data-next]');
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      resetTimer();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 5500);
    }

    nextBtn && nextBtn.addEventListener('click', next);
    prevBtn && prevBtn.addEventListener('click', prev);
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', resetTimer);
    render();
    resetTimer();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        a.style.maxHeight = null;
        q.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Certification modal (Bootstrap) ----------
     Bootstrap's own JS (bootstrap.bundle.min.js) handles opening,
     closing, backdrop and keyboard/focus behaviour via the
     data-bs-toggle / data-bs-target attributes on each cert card.
     Here we just fill the modal body with that card's details
     right before it's shown, using Bootstrap's show.bs.modal event. */
  const certModal = document.getElementById('certModal');
  if (certModal) {
    certModal.addEventListener('show.bs.modal', (event) => {
      const card = event.relatedTarget;
      if (!card) return;
      certModal.querySelector('#certModalYear').textContent = card.dataset.year || '';
      certModal.querySelector('#certModalLabel').textContent = card.dataset.title || '';
      certModal.querySelector('#certModalIssuer').textContent = card.dataset.issuer || '';
      certModal.querySelector('#certModalDesc').textContent = card.dataset.desc || '';
      certModal.querySelector('#certModalCred').textContent = card.dataset.cred || '';
    });
  }

  /* ---------- Skill bars: animate on scroll into view ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  if (skillFills.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.width = el.dataset.level + '%';
          io.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    skillFills.forEach(el => io.observe(el));
  }

  /* ---------- Contact form validation ---------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    const fields = {
      name: { el: form.querySelector('#name'), rule: v => v.trim().length >= 2, msg: 'Please enter your full name (min 2 characters).' },
      email: { el: form.querySelector('#email'), rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
      phone: { el: form.querySelector('#phone'), rule: v => /^[0-9+\-\s()]{7,20}$/.test(v.trim()), msg: 'Please enter a valid phone number.' },
      address: { el: form.querySelector('#address'), rule: v => v.trim().length >= 5, msg: 'Please enter your address (min 5 characters).' },
      message: { el: form.querySelector('#message'), rule: v => v.trim().length >= 10, msg: 'Message should be at least 10 characters.' },
    };

    function validateField(key) {
      const f = fields[key];
      const errorEl = form.querySelector(`[data-error-for="${key}"]`);
      const valid = f.rule(f.el.value);
      f.el.classList.toggle('invalid', !valid);
      errorEl.textContent = valid ? '' : f.msg;
      return valid;
    }

    Object.keys(fields).forEach(key => {
      const el = fields[key].el;
      el.addEventListener('blur', () => validateField(key));
      el.addEventListener('input', () => {
        if (el.classList.contains('invalid')) validateField(key);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      Object.keys(fields).forEach(key => {
        if (!validateField(key)) allValid = false;
      });

      const status = form.querySelector('.form-status');
      if (!allValid) {
        status.textContent = 'Please fix the highlighted fields before sending.';
        status.classList.remove('success');
        status.classList.add('show');
        return;
      }

      status.textContent = 'Thanks — your message has been sent. I\'ll reply within one business day.';
      status.classList.add('show', 'success');
      form.reset();
      Object.keys(fields).forEach(key => {
        fields[key].el.classList.remove('invalid');
        form.querySelector(`[data-error-for="${key}"]`).textContent = '';
      });
    });
  }

});
