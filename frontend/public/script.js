// script.js

document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  // Contact form
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      contactStatus.textContent = '';
      contactStatus.className = 'form-status';

      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          contactStatus.textContent = 'Thank you for reaching out. We will get back to you shortly.';
          contactStatus.classList.add('success');
          contactForm.reset();
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        contactStatus.textContent = 'Something went wrong. Please try again later.';
        contactStatus.classList.add('error');
      }
    });
  }

  // Apply form
  const applyForm = document.getElementById('applyForm');
  const applyStatus = document.getElementById('applyStatus');

  if (applyForm) {
    applyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      applyStatus.textContent = '';
      applyStatus.className = 'form-status';

      const formData = new FormData(applyForm);
      const payload = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          applyStatus.textContent = 'Your application has been submitted. Thank you.';
          applyStatus.classList.add('success');
          applyForm.reset();
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        applyStatus.textContent = 'Something went wrong. Please try again later.';
        applyStatus.classList.add('error');
      }
    });
  }
});
