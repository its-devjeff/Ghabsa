import { useEffect } from 'react';

/**
 * Adds `is-visible` to any [data-reveal] / [data-stagger] element once it
 * scrolls into view, which triggers the transitions defined in theme.css.
 *
 * Re-scans on a MutationObserver tick so elements rendered after an async
 * fetch (posts, events) are picked up too. Elements are unobserved once
 * revealed, so this never re-runs for the same node.
 */
export default function useReveal() {
  useEffect(() => {
    const selector = '[data-reveal], [data-stagger]';

    // Respect the user's motion preference: show everything immediately.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll(selector).forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      // Fire slightly before the element reaches the fold so motion feels
      // like part of the scroll rather than a delayed reaction.
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const scan = () => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.classList.contains('is-visible')) observer.observe(el);
      });
    };

    scan();

    const mutation = new MutationObserver(scan);
    mutation.observe(document.body, { childList: true, subtree: true });

    // Safety net: content must never be left invisible because an observer
    // callback was missed. Anything still hidden after this is shown outright.
    const failsafe = window.setInterval(() => {
      document.querySelectorAll(selector).forEach((el) => {
        if (el.classList.contains('is-visible')) return;
        const box = el.getBoundingClientRect();
        const seen = box.top < window.innerHeight && box.bottom > 0;
        if (seen) el.classList.add('is-visible');
      });
    }, 1200);

    return () => {
      observer.disconnect();
      mutation.disconnect();
      window.clearInterval(failsafe);
    };
  }, []);
}
