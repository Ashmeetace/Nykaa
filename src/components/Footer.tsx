import { useState } from 'react';
import { CURATED_COLLECTIONS, DEPARTMENTS } from '../data/catalog';
import { CategoryFilter, CollectionFilter } from '../types/store';

interface FooterProps {
  onSelectCategory: (cat: CategoryFilter) => void;
  onSelectCollection: (col: CollectionFilter) => void;
  onOpenBag: () => void;
}

export function Footer({ onSelectCategory, onSelectCollection, onOpenBag }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleJumpCategory = (category: CategoryFilter) => {
    onSelectCollection('All');
    onSelectCategory(category);
    scrollToCollection();
  };

  const handleJumpCollection = (collection: CollectionFilter) => {
    onSelectCategory('All');
    onSelectCollection(collection);
    scrollToCollection();
  };

  const footerDepartments = DEPARTMENTS.filter((d) => d !== 'All');

  return (
    <footer className="bg-[#181416] text-white border-t border-[#2E272A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-10">
          {/* Brand Summary */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-editorial text-2xl font-bold tracking-tight text-white">
              NYKAA
            </span>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              India’s premier curated beauty destination for clinical skincare, high-pigment
              cosmetics, Ayurvedic botanicals, prestige Nykaa Luxe, haircare, and fine perfumery.
            </p>
            <p className="text-xs text-white/50">
              Mumbai · Bengaluru · New Delhi · 18 Express Cities
            </p>
          </div>

          {/* Departments */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
              Departments
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80">
              {footerDepartments.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => handleJumpCategory(cat)}
                    className="hover:text-[#D91464] transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Curated Collections */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
              Collections
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              {CURATED_COLLECTIONS.map((col) => (
                <li key={col.id}>
                  <button
                    type="button"
                    onClick={() => handleJumpCollection(col.id)}
                    className="hover:text-[#D91464] transition-colors text-left"
                  >
                    {col.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onOpenBag}
                  className="hover:text-[#D91464] transition-colors text-left"
                >
                  Shopping Bag
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
              The Beauty Dispatch
            </h3>
            <p className="text-sm text-white/70">
              Receive shade launch notes, dermatologist formulation guides, and seasonal edits.
            </p>

            {subscribed ? (
              <p className="text-xs font-medium text-white bg-white/10 px-3.5 py-2.5 rounded-lg">
                You are subscribed to The Beauty Dispatch.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  aria-label="Email address for newsletter"
                  className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-white/10 border border-white/15 rounded-lg text-white placeholder:text-white/45 focus:outline-none focus:border-[#D91464]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-semibold bg-[#D91464] hover:bg-[#B50F52] text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2026 Nykaa Beauty Storefront. All products direct from authorized ateliers.</p>
          <p>Prices inclusive of GST · Express & COD available across India</p>
        </div>
      </div>
    </footer>
  );
}
