import { readJSON } from '@/lib/data';
import type { Partner } from '@/lib/types';
import TrustedPartnersHeader from './TrustedPartnersHeader';

export default async function TrustedPartners() {
  let partners: Partner[] = [];
  try {
    partners = readJSON<Partner[]>('partners.json');
  } catch {
    partners = [];
  }

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustedPartnersHeader />

        {partners.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className={`group relative flex flex-col items-center justify-center py-5 px-4 rounded-sm border transition-all duration-300 cursor-default ${
                  partner.highlight
                    ? 'bg-[#C9A84C]/5 border-[#C9A84C]/25 hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/40'
                    : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-md'
                }`}
              >
                {partner.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-[#C9A84C] text-[7px] text-white font-body font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                      Premium
                    </span>
                  </div>
                )}
                {partner.logo_url ? (
                  <img src={partner.logo_url} alt={partner.name} className="w-12 h-12 object-contain mb-2" />
                ) : null}
                <span className={`font-display text-sm sm:text-base font-bold tracking-wider transition-colors duration-300 ${
                  partner.highlight ? 'text-[#C9A84C]' : 'text-gray-400 group-hover:text-gray-900'
                }`}>
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
