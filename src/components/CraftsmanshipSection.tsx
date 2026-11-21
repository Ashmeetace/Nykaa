import { EDITORIAL_CRAFT_IMAGE } from '../data/catalog';

const PILLARS = [
  {
    index: '01.',
    title: 'Direct-from-Atelier Provenance',
    description:
      'Every serum, lipstick, and fragrance ships directly from authorized brand vaults with verifiable batch codes and zero third-party marketplace resellers.',
  },
  {
    index: '02.',
    title: 'Calibrated for Indian Undertones & Climate',
    description:
      'Pigments are tested across golden, olive, and deep-neutral skin tones while actives are stabilized in UV-protective glass for tropical heat and monsoon humidity.',
  },
  {
    index: '03.',
    title: 'Climate-Controlled Cold-Chain Dispatch',
    description:
      'Ascorbic acid serums, mineral UV filters, and botanical oils travel in temperature-regulated fulfilment hubs across Mumbai, Bengaluru, Delhi NCR, and 15+ cities.',
  },
];

export function CraftsmanshipSection() {
  return (
    <section
      id="craftsmanship"
      className="border-t border-[#E8E1E2] bg-white py-16 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Editorial Botanical Still-Life */}
          <div className="lg:col-span-6">
            <div className="h-full min-h-[320px] lg:min-h-[460px] rounded-xl overflow-hidden bg-[#F3EFEF] border border-[#E8E1E2]">
              <img
                src={EDITORIAL_CRAFT_IMAGE}
                alt="Fresh Damask rose petals, rosehip seed oil amber bottles, and golden botanical droplets on travertine"
                referrerPolicy="no-referrer"
                className="w-full h-full lg:h-full object-cover"
              />
            </div>
          </div>

          {/* Editorial Pillars */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D91464] mb-3">
              Formulation & Curation
            </p>
            <h2
              className="font-editorial text-3xl sm:text-4xl font-semibold text-[#181416] leading-tight mb-8"
              style={{ textWrap: 'balance' }}
            >
              The Nykaa Standard of Authenticity & Care
            </h2>

            <div className="divide-y divide-[#E8E1E2] border-y border-[#E8E1E2]">
              {PILLARS.map((pillar) => (
                <div key={pillar.index} className="py-5 first:pt-4 last:pb-4">
                  <h3 className="text-base font-semibold text-[#181416] mb-1.5">
                    <span className="text-[#D91464] mr-2 tabular-nums">{pillar.index}</span>
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#5E5458] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
