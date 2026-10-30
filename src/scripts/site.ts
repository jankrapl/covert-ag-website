// Shared behaviour. The site works without this: navigation is plain links, the insurance list
// shows both groups, and sections are visible by default (see html.js in global.css).

const hdr = document.getElementById('hdr');

function onScroll() {
  hdr?.classList.toggle('is-stuck', window.scrollY > 24);
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Dropdowns: open on hover with a mouse, on click and keyboard everywhere.
const drops = [...document.querySelectorAll<HTMLElement>('[data-drop]')];
function setDrop(drop: HTMLElement, open: boolean) {
  drop.classList.toggle('is-open', open);
  drop.querySelector('button')?.setAttribute('aria-expanded', String(open));
}
for (const drop of drops) {
  const btn = drop.querySelector('button');
  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    // With a mouse the menu is already open from hovering, so a click must not close it again.
    const hovering = drop.matches(':hover') && matchMedia('(hover: hover)').matches;
    const next = hovering || !drop.classList.contains('is-open');
    drops.forEach((d) => setDrop(d, false));
    setDrop(drop, next);
  });
  if (matchMedia('(hover: hover)').matches) {
    drop.addEventListener('mouseenter', () => { drops.forEach((d) => d !== drop && setDrop(d, false)); setDrop(drop, true); });
    drop.addEventListener('mouseleave', () => setDrop(drop, false));
  }
  drop.addEventListener('focusout', (e) => {
    if (!drop.contains(e.relatedTarget as Node | null)) setDrop(drop, false);
  });
}
document.addEventListener('click', () => drops.forEach((d) => setDrop(d, false)));

// Mobile menu
const burger = document.querySelector<HTMLButtonElement>('.burger');
function setMenu(open: boolean) {
  hdr?.classList.toggle('is-open', open);
  document.body.classList.toggle('is-locked', open);
  burger?.setAttribute('aria-expanded', String(open));
  burger?.setAttribute('aria-label', (open ? burger.dataset.closeLabel : burger.dataset.openLabel) ?? '');
}
burger?.addEventListener('click', () => setMenu(!hdr?.classList.contains('is-open')));
document.getElementById('mnav')?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a')) setMenu(false);
});
matchMedia('(min-width: 1141px)').addEventListener('change', (e) => e.matches && setMenu(false));

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = drops.find((d) => d.classList.contains('is-open'));
  if (open) { setDrop(open, false); open.querySelector('button')?.focus(); }
  if (hdr?.classList.contains('is-open')) { setMenu(false); burger?.focus(); }
});

// Reveal on scroll
const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  targets.forEach((t) => io.observe(t));
} else {
  targets.forEach((t) => t.classList.add('is-in'));
}

// Tables from Markdown scroll inside their own box on small screens.
document.querySelectorAll('.art table').forEach((t) => {
  const box = document.createElement('div');
  box.className = 'tablewrap';
  t.parentNode?.insertBefore(box, t);
  box.appendChild(t);
});
