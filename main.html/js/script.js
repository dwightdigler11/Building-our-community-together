// ==========================================================================
// Community Develop Together — shared behaviour
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initActiveLink();
  initIdeaMenu();
  initCounters();
  initRegistrationForm();
  initContactForm();
});

/* Mobile nav toggle */
function initNavToggle(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? '×' : '☰';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}

/* Highlight current page in nav */
function initActiveLink(){
  const path = location.pathname.split('/').pop() || 'index.html';
  const current = path === 'index(1).html' ? 'index.html' : path;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if(href === current || (current === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });
}

/* About page: simple idea menu (tabs) */
function initIdeaMenu(){
  const buttons = document.querySelectorAll('.idea-menu button');
  if(!buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.dataset.target);
      if(!panel) return;
      buttons.forEach(b => {
        const selected = b === btn;
        b.classList.toggle('active', selected);
        b.setAttribute('aria-selected', selected ? 'true' : 'false');
      });
      document.querySelectorAll('.idea-panel').forEach(p => {
        const active = p === panel;
        p.classList.toggle('active', active);
        p.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
    });
  });
}

/* Animate dashboard metric counters when scrolled into view */
function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if(!counters.length) return;
  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target).toLocaleString();
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => observer.observe(c));
}

/* Developer registration form (home page) */
function initRegistrationForm(){
  const form = document.getElementById('registration-form');
  if(!form) return;
  const note = document.getElementById('registration-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#reg-name').value.trim();
    const email = form.querySelector('#reg-email').value.trim();
    const skill = form.querySelector('#reg-skill').value;
    const idea = form.querySelector('#reg-idea').value.trim();

    if(!name || !validateEmail(email) || !skill || idea.length < 10){
      note.textContent = 'Please fill in every field — your idea needs at least 10 characters, and the email should look like a real address.';
      note.className = 'form-note err';
      return;
    }
    note.textContent = `Thanks, ${name.split(' ')[0]} — you're on the list. We'll email ${email} with your dashboard access.`;
    note.className = 'form-note ok';
    form.reset();
  });
}

/* Contact form */
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const note = document.getElementById('contact-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#c-name').value.trim();
    const email = form.querySelector('#c-email').value.trim();
    const message = form.querySelector('#c-message').value.trim();

    if(!name || !validateEmail(email) || message.length < 10){
      note.textContent = 'Please add your name, a valid email, and a message of at least 10 characters.';
      note.className = 'form-note err';
      return;
    }
    note.textContent = `Message received, ${name.split(' ')[0]}. We usually reply within two working days.`;
    note.className = 'form-note ok';
    form.reset();
  });
}

function validateEmail(email){
  if(typeof email !== 'string') return false;
  const value = email.trim();
  if(value.length > 254) return false;

  const parts = value.split('@');
  if(parts.length !== 2) return false;

  const [local, domain] = parts;
  if(!local || local.length > 64 || !domain || !domain.includes('.')) return false;
  if(!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return false;
  if(local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;

  const labels = domain.split('.');
  return labels.every(label =>
    label.length > 0 && label.length <= 63 &&
    /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label)
  );
}
