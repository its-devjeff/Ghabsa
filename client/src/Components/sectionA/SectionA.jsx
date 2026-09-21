import React from 'react';
import './SectionA.css';

/* This band used to carry Trendy Day (the weekly dress theme, pulled from the
   trendy collection). It now carries the upcoming dinner — Astra Aurea, 22
   September 2026 — because that is what the association is actually pushing.
   The details are fixed to the event rather than fetched: one dinner, one
   date, one design. When the dinner passes, either point this back at
   /api/trendy/getTrendy or swap the constants below. */

const DINNER = {
  photo: '/Images/events/dinner-astra-aurea.jpg',
  design: '/Images/events/astra-aurea-logo.png',
  date: '22 September 2026',
};

/* Fanned back-to-front: the last one sits on top of the stack, so the cheapest
   ticket is the one the eye lands on first. */
const TICKETS = [
  { id: 'tot', art: '/Images/events/ticket-table-of-ten.jpg', tier: 'Table of ten', price: 'GH₵1,450' },
  { id: 'single', art: '/Images/events/ticket-single.jpg', tier: 'Single', price: 'GH₵160' },
  { id: 'early', art: '/Images/events/ticket-early-bird.jpg', tier: 'Early bird single', price: 'GH₵140' },
];

const SectionA = () => (
  <section className="container-a">
    <div className="container-a-items" data-reveal>

      <h2 className="Dinner-headline">
        Don&rsquo;t miss out on the most
        <span className="Dinner-headline-em"> anticipated event of the year</span>
      </h2>

      <div className="Dinner-layout">

        <div className="Dinner-frame">
          <img className="Dinner-img" src={DINNER.photo} alt="" />

          {/* The event design sits top-left, over the photograph. It is a
              transparent PNG, so it drops straight onto the image. */}
          <img className="Dinner-design" src={DINNER.design} alt="Astra Aurea" />

          <div className="Dinner-overlay">
            <p className="Dinner-date">{DINNER.date}</p>
          </div>
        </div>

        <div className="Tickets">
          <p className="Tickets-eyebrow">
            Astra Aurea &middot; Eleganza &rsquo;26
          </p>
          <p className="Tickets-kind">Dinner &middot; Awards &middot; Handing over night</p>
          <h3 className="Tickets-title">
            The table is set. <span className="Tickets-title-em">Claim your seat.</span>
          </h3>
          <p className="Tickets-lead">
            One night for the dinner, the awards and the handing over. Three
            ways in — and early bird closes first, so pick a ticket before the
            room fills up.
          </p>

          {/* The artwork is the product, so the fan shows the real tickets
              rather than a styled rendition of them. */}
          <ul className="Tickets-fan">
            {TICKETS.map((t, i) => (
              <li className={`Tickets-card Tickets-card--${t.id}`} key={t.id} style={{ zIndex: i + 1 }}>
                <img src={t.art} alt={`${t.tier} ticket — ${t.price}`} />
              </li>
            ))}
          </ul>

          <ul className="Tickets-prices">
            {[...TICKETS].reverse().map((t) => (
              <li className="Tickets-price" key={t.id}>
                <span className="Tickets-price-tier">{t.tier}</span>
                <span className="Tickets-price-amount">{t.price}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  </section>
);

export default SectionA;
