// ===== Riferimenti DOM =====
const nav = document.getElementById('nav');
const menu = document.getElementById('menu');
const links = document.getElementById('links');

// ===== Navbar =====
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30));
menu.addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

// ===== Carosello merch =====
const merchCarousel = document.querySelector('[data-merch-carousel]');
const merchSlides = [...merchCarousel.querySelectorAll('.merch-slide')];
const merchCount = merchCarousel.querySelector('.merch-carousel-count');
let currentMerchSlide = 0;

function showMerchSlide(index) {
  currentMerchSlide = (index + merchSlides.length) % merchSlides.length;
  merchSlides.forEach((slide, slideIndex) => {
    slide.hidden = slideIndex !== currentMerchSlide;
  });
  merchCount.textContent = `${currentMerchSlide + 1} / ${merchSlides.length}`;
}

merchCarousel.querySelector('.previous').addEventListener('click', () => showMerchSlide(currentMerchSlide - 1));
merchCarousel.querySelector('.next').addEventListener('click', () => showMerchSlide(currentMerchSlide + 1));

// ===== Footer: anno corrente =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Form contatti (Web3Forms) =====
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('.submit');
  const label = btn.textContent;
  const data = new FormData(form);

  // Se l'utente ha scritto un oggetto, lo usa come oggetto della mail
  const userSubject = (data.get('user_subject') || '').toString().trim();
  if (userSubject) data.set('subject', `[Sito] ${userSubject}`);
  data.delete('user_subject');

  btn.disabled = true;
  btn.textContent = 'Invio in corso…';
  statusEl.className = 'form-status';
  statusEl.textContent = '';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    });
    const json = await res.json();
    if (res.ok && json.success) {
      statusEl.className = 'form-status ok';
      statusEl.textContent = 'Messaggio inviato! Ti risponderemo presto.';
      form.reset();
    } else {
      throw new Error(json.message || 'Errore di invio');
    }
  } catch (err) {
    statusEl.className = 'form-status err';
    statusEl.textContent = 'Invio non riuscito. Riprova o scrivici a sewersailors@gmail.com';
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
});
