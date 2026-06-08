// scroll 
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});


const heelCards = document.querySelectorAll('.heel-card');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transition = `opacity 0.7s ease ${entry.target.dataset.index * 0.15}s, transform 0.7s ease ${entry.target.dataset.index * 0.15}s`;
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

heelCards.forEach(card => revealObserver.observe(card));

// transition 
heelCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // If clicking the interest button inside, don't toggle pop
    if (e.target.classList.contains('heel-interest-btn')) return;

    const wasPopped = card.classList.contains('popped');
    // Dismiss all first
    heelCards.forEach(c => c.classList.remove('popped'));
    if (!wasPopped) card.classList.add('popped');
  });
});

// form 
document.querySelectorAll('.heel-interest-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const heelName = btn.dataset.heel;
    const select = document.getElementById('heel_preference');
    if (select) {
      // Match option value
      Array.from(select.options).forEach(opt => {
        if (opt.value === heelName) opt.selected = true;
      });
    }
    document.getElementById('interest').scrollIntoView({ behavior: 'smooth' });
    
    if (select) {
      select.style.borderColor = '#6b1a2a';
      select.style.boxShadow = '0 0 0 3px rgba(107,26,42,0.15)';
      setTimeout(() => {
        select.style.borderColor = '';
        select.style.boxShadow = '';
      }, 1800);
    }
  });
});


const form = document.getElementById('interestForm');
const submitBtn = document.getElementById('submitBtn');
const formResponse = document.getElementById('formResponse');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Sending…';

  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    heel_preference: document.getElementById('heel_preference').value,
    message: document.getElementById('message').value.trim(),
  };

  try {
    const res = await fetch('/api/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      formResponse.className = 'form-response success';
      formResponse.textContent = '✓ ' + data.message;
      form.reset();
    } else {
      formResponse.className = 'form-response error';
      formResponse.textContent = '✗ ' + (data.error || 'Something went wrong. Please try again.');
    }
  } catch (err) {
    formResponse.className = 'form-response error';
    formResponse.textContent = '✗ Network error. Please check your connection.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Submit Interest';
    formResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

// ── Smooth parallax on hero text ──
const heroText = document.querySelector('.hero-text');
window.addEventListener('scroll', () => {
  if (heroText) {
    const y = window.scrollY;
    heroText.style.transform = `translateY(${y * 0.25}px)`;
    heroText.style.opacity = 1 - y / 500;
  }
});
