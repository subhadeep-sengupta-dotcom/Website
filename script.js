const revealItems = document.querySelectorAll('.reveal');
const capabilityItems = document.querySelectorAll('.capability-item');
const detailNumber = document.querySelector('.detail-number');
const detailTitle = document.querySelector('.capability-detail h3');
const detailCopy = document.querySelector('.capability-detail > p:not(.detail-kicker)');
const detailSkills = document.querySelector('.skill-cloud');
const contactEmail = document.querySelector('.contact-email');
const contactPrompt = document.querySelector('.contact-prompt');
const contactLinks = document.querySelectorAll('[data-reveal-contact]');
const capabilityDetail = document.querySelector('.capability-detail');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const capabilityDetails = [
  { number: '01', title: 'Make the model<br><em>meet the moment.</em>', copy: 'I connect modern LLM patterns with the discipline of classical data science: ask the right question, build for the real constraint, and make the result useful to the person making the decision.', skills: ['RAG', 'LangChain', 'LangGraph', 'Prompt design', 'Python', 'SQL', 'Snowflake', 'NLP'] },
  { number: '02', title: 'Build with<br><em>strong foundations.</em>', copy: 'From regression and tree-based methods to neural networks, I choose the right level of sophistication for the problem and make the trade-offs visible.', skills: ['XGBoost', 'N-BEATS', 'ANN', 'RNN', 'Random Forest', 'Model tuning', 'Feature engineering'] },
  { number: '03', title: 'Find the pattern<br><em>before the noise.</em>', copy: 'Forecasting, segmentation, sentiment, and churn models become valuable when they give a team a better next move, not just a more impressive dashboard.', skills: ['Forecasting', 'Segmentation', 'Churn', 'NLP', 'Time series', 'Customer insight'] },
  { number: '04', title: 'Bring people<br /><em>along for the build.</em>', copy: 'I lead cross-functional delivery, translate technical choices for stakeholders, and help teams adopt AI in ways that improve both speed and capability.', skills: ['Team leadership', 'Mentoring', 'Stakeholders', 'Delivery planning', 'AI adoption'] }
];

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => observer.observe(item));

capabilityItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    if (item.classList.contains('active')) return;
    capabilityItems.forEach((capability) => {
      capability.classList.remove('active');
      capability.setAttribute('aria-pressed', 'false');
    });
    item.classList.add('active');
    item.setAttribute('aria-pressed', 'true');

    const applyDetail = () => {
      const detail = capabilityDetails[index];
      detailNumber.textContent = detail.number;
      detailTitle.innerHTML = detail.title;
      detailCopy.textContent = detail.copy;
      detailSkills.innerHTML = detail.skills.map((skill) => `<span>${skill}</span>`).join('');
    };

    if (prefersReducedMotion || !capabilityDetail) {
      applyDetail();
      return;
    }
    capabilityDetail.classList.add('is-swapping');
    window.setTimeout(() => {
      applyDetail();
      capabilityDetail.classList.remove('is-swapping');
    }, 180);
  });
});

contactLinks.forEach((link) => {
  link.addEventListener('click', () => {
    contactEmail.classList.remove('is-hidden');
    contactPrompt.classList.add('is-hidden');
    link.setAttribute('aria-expanded', 'true');
  });
});

// Thin progress line across the top, tracking how far down the page you are
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.width = `${Math.min(ratio * 100, 100)}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

// A soft glow that follows the cursor inside the loan-flow diagram
const loanCanvas = document.getElementById('loan-canvas');
const canvasGlow = document.querySelector('.canvas-glow');
if (loanCanvas && canvasGlow && window.matchMedia('(pointer: fine)').matches) {
  loanCanvas.addEventListener('mousemove', (event) => {
    const rect = loanCanvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    canvasGlow.style.setProperty('--x', `${x}%`);
    canvasGlow.style.setProperty('--y', `${y}%`);
  });
}

// A gentle pull toward the cursor on the primary call to action
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (event) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25 - 3}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// "15 years" counts up once it scrolls into view
const yearsEl = document.querySelector('.about-mark span');
if (yearsEl) {
  const target = parseInt(yearsEl.textContent, 10) || 0;
  if (prefersReducedMotion || Number.isNaN(target)) {
    yearsEl.textContent = String(target);
  } else {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const duration = 900;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          yearsEl.textContent = String(Math.round(progress * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    countObserver.observe(yearsEl);
  }
}
