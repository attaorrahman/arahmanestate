import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Bed, Bath, Square, MapPin, CircleCheck as CheckCircle2, ArrowLeft, Phone, Mail, Heart, Share2, Star, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPropertyById, getEmirateBySlug, getDefaultAgent } from '@/lib/queries';
import { formatPrice } from '@/lib/utils';
import PropertyContactForm from './PropertyContactForm';
import BookViewingForm from './BookViewingForm';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getPropertyById(params.id).catch(() => null);
  if (!property) return { title: 'Property — BNH MasterKey' };
  return {
    title: `${property.title} — BNH MasterKey`,
    description: property.description || `${property.title} in ${property.location}. ${formatPrice(property.price, property.price_type)}.`,
  };
}

export default async function PropertyPage({ params }: Props) {
  const property = await getPropertyById(params.id).catch(() => null);
  if (!property) notFound();

  const [emirate, agent] = await Promise.all([
    getEmirateBySlug(property.emirate_slug).catch(() => null),
    getDefaultAgent().catch(() => null),
  ]);

  const relatedImages = [
    property.image_url,
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg',
  ].filter(Boolean);

  return (
    <main>
      <Navbar />

      <div className="pt-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 font-body text-sm text-gray-500">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/properties/${property.emirate_slug}`} className="hover:text-[#C9A84C] transition-colors capitalize">
              {emirate?.name || property.emirate_slug}
            </Link>
            <span>/</span>
            <span className="text-gray-700 truncate max-w-xs">{property.title}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[420px] sm:h-[520px]">
            <div className="lg:col-span-8 rounded-sm overflow-hidden image-zoom h-full">
              <img
                src={`${relatedImages[0]}?auto=compress&cs=tinysrgb&w=900&q=80`}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden lg:grid lg:col-span-4 grid-rows-2 gap-4 h-full">
              {relatedImages.slice(1, 3).map((img, i) => (
                <div key={i} className="rounded-sm overflow-hidden image-zoom">
                  <img
                    src={`${img}?auto=compress&cs=tinysrgb&w=500&q=70`}
                    alt={`Property view ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-sm border border-gray-100 p-8 luxury-shadow mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex gap-2 mb-3">
                      <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-sm ${
                        property.price_type === 'sale' ? 'bg-[#1A1A1A] text-white' : 'bg-[#C9A84C] text-white'
                      }`}>
                        {property.price_type === 'sale' ? 'FOR SALE' : 'FOR RENT'}
                      </span>
                      <span className="text-xs font-body text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-sm capitalize">
                        {property.property_type}
                      </span>
                      {property.is_verified && (
                        <span className="flex items-center gap-1 text-xs font-body text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-sm">
                          <CheckCircle2 size={11} />
                          Verified
                        </span>
                      )}
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MapPin size={14} className="text-[#C9A84C]" />
                      <span className="font-body text-sm">{property.location}</span>
                      {emirate && (
                        <>
                          <span className="text-gray-300">·</span>
                          <Link
                            href={`/properties/${emirate.slug}`}
                            className="font-body text-sm hover:text-[#C9A84C] transition-colors"
                          >
                            {emirate.name}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-[#C9A84C] text-4xl font-bold">
                      {formatPrice(property.price, property.price_type)}
                    </p>
                    {property.price_type === 'rent' && (
                      <p className="font-body text-gray-400 text-sm">per year</p>
                    )}
                    {property.sqft && (
                      <p className="font-body text-gray-400 text-xs mt-1">
                        AED {Math.round(property.price / property.sqft).toLocaleString()} / sqft
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#FAFAF8] rounded-sm border border-gray-50">
                  {[
                    { icon: Bed, label: 'Bedrooms', value: property.bedrooms ?? '—' },
                    { icon: Bath, label: 'Bathrooms', value: property.bathrooms ?? '—' },
                    { icon: Square, label: 'Area', value: property.sqft ? `${property.sqft.toLocaleString()} sqft` : '—' },
                    { icon: Building2, label: 'Type', value: property.property_type, capitalize: true },
                  ].map(({ icon: Icon, label, value, capitalize }) => (
                    <div key={label} className="text-center">
                      <Icon size={20} className="text-[#C9A84C] mx-auto mb-1.5" />
                      <p className={`font-body text-gray-900 font-semibold text-sm ${capitalize ? 'capitalize' : ''}`}>
                        {value}
                      </p>
                      <p className="font-body text-gray-400 text-xs">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-5">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors font-body text-sm">
                    <Heart size={16} />
                    Save
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-[#C9A84C] transition-colors font-body text-sm">
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-sm border border-gray-100 p-8 luxury-shadow mb-6">
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
                  About This Property
                </h2>
                <div className="w-12 h-0.5 bg-[#C9A84C] mb-5" />
                <p className="font-body text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white rounded-sm border border-gray-100 p-8 luxury-shadow">
                  <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
                    Amenities & Features
                  </h2>
                  <div className="w-12 h-0.5 bg-[#C9A84C] mb-5" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-[#C9A84C] shrink-0" />
                        <span className="font-body text-gray-700 text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 lg:sticky lg:top-28 space-y-5">
              <div className="bg-white rounded-sm border border-gray-100 p-6 luxury-shadow">
                {agent && (
                  <>
                    <div className="flex items-center gap-3 mb-5">
                      {agent.photo_url && (
                        <img
                          src={`${agent.photo_url}?auto=compress&cs=tinysrgb&w=80`}
                          alt={agent.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-display text-gray-900 font-semibold">{agent.name}</p>
                        <p className="font-body text-gray-400 text-sm">{agent.title}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: Math.round(agent.rating) }).map((_, i) => (
                            <Star key={i} size={10} className="text-[#C9A84C] fill-[#C9A84C]" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      {agent.phone && (
                        <a
                          href={`tel:${agent.phone.replace(/\s/g, '')}`}
                          className="btn-gold w-full flex items-center justify-center gap-2 py-3 rounded-sm font-body text-sm font-medium"
                        >
                          <Phone size={15} />
                          Call Agent
                        </a>
                      )}
                      {agent.email && (
                        <a
                          href={`mailto:${agent.email}`}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-sm font-body text-sm font-medium border border-gray-200 text-gray-700 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
                        >
                          <Mail size={15} />
                          Email Agent
                        </a>
                      )}
                    </div>
                  </>
                )}

                <PropertyContactForm propertyTitle={property.title} propertyId={property.id} />
              </div>

              <BookViewingForm propertyTitle={property.title} propertyId={property.id} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
