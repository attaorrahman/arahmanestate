'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Lang = 'en' | 'ar';

interface LanguageContextType {
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const translations: Record<string, Record<Lang, string>> = {
  // ─── Navbar ───
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.properties': { en: 'Properties', ar: 'العقارات' },
  'nav.transactions': { en: 'Transactions', ar: 'المعاملات' },
  'nav.emirates': { en: 'Emirates', ar: 'الإمارات' },
  'nav.team': { en: 'Our Team', ar: 'فريقنا' },
  'nav.meeting': { en: 'Schedule Meeting', ar: 'حجز موعد' },
  'nav.contact': { en: 'Contact', ar: 'اتصل بنا' },
  'nav.admin': { en: 'Admin', ar: 'المسؤول' },

  // ─── Hero ───
  'hero.tagline': { en: 'UAE Premier Real Estate Platform', ar: 'منصة العقارات الرائدة في الإمارات' },
  'hero.title1': { en: 'Find Your', ar: 'ابحث عن' },
  'hero.title2': { en: 'Dream Property', ar: 'عقار أحلامك' },
  'hero.title3': { en: 'in UAE', ar: 'في الإمارات' },
  'hero.description': {
    en: 'Explore over 100 handpicked luxury properties across the 7 Emirates. From iconic Dubai penthouses to tranquil Fujairah retreats.',
    ar: 'استكشف أكثر من 100 عقار فاخر مختار بعناية عبر الإمارات السبع. من شقق دبي الفاخرة إلى منتجعات الفجيرة الهادئة.',
  },
  'hero.explore': { en: 'Explore Properties', ar: 'استكشف العقارات' },
  'hero.contact_agent': { en: 'Contact Agent', ar: 'تواصل مع وكيل' },
  'hero.properties_listed': { en: 'Properties Listed', ar: 'عقارات مُدرجة' },
  'hero.emirates_covered': { en: 'Emirates Covered', ar: 'إمارات مغطاة' },
  'hero.client_satisfaction': { en: 'Client Satisfaction', ar: 'رضا العملاء' },

  // ─── Search Filter ───
  'search.title': { en: 'Search Properties', ar: 'البحث عن عقارات' },
  'search.buy_rent': { en: 'Buy / Rent', ar: 'شراء / إيجار' },
  'search.buy': { en: 'Buy', ar: 'شراء' },
  'search.rent': { en: 'Rent', ar: 'إيجار' },
  'search.emirates': { en: 'Emirates', ar: 'الإمارات' },
  'search.property_type': { en: 'Property Type', ar: 'نوع العقار' },
  'search.price_range': { en: 'Price Range', ar: 'نطاق السعر' },
  'search.bedrooms': { en: 'Bedrooms', ar: 'غرف النوم' },
  'search.button': { en: 'Search', ar: 'بحث' },
  'search.all_emirates': { en: 'All Emirates', ar: 'جميع الإمارات' },
  'search.all_types': { en: 'All Types', ar: 'جميع الأنواع' },
  'search.any_price': { en: 'Any Price', ar: 'أي سعر' },
  'search.any_beds': { en: 'Any Beds', ar: 'أي عدد' },
  'search.apartment': { en: 'Apartment', ar: 'شقة' },
  'search.villa': { en: 'Villa', ar: 'فيلا' },
  'search.penthouse': { en: 'Penthouse', ar: 'بنتهاوس' },
  'search.townhouse': { en: 'Townhouse', ar: 'تاون هاوس' },
  'search.commercial': { en: 'Commercial', ar: 'تجاري' },

  // ─── Featured Properties ───
  'featured.tagline': { en: 'Curated Selection', ar: 'مجموعة مختارة' },
  'featured.title': { en: 'Featured Properties', ar: 'العقارات المميزة' },
  'featured.description': { en: 'Handpicked luxury properties across the UAE for the most discerning buyers.', ar: 'عقارات فاخرة مختارة بعناية عبر الإمارات لأكثر المشترين تميزًا.' },
  'featured.view_all': { en: 'View All Properties', ar: 'عرض جميع العقارات' },

  // ─── Emirates Section ───
  'emirates.tagline': { en: 'UAE Emirates', ar: 'إمارات الدولة' },
  'emirates.title': { en: 'Explore by City', ar: 'استكشف حسب المدينة' },
  'emirates.description': { en: 'Each of the UAE seven Emirates offers a unique lifestyle. Find your perfect address.', ar: 'تقدم كل إمارة من الإمارات السبع أسلوب حياة فريد. اعثر على عنوانك المثالي.' },
  'emirates.view_all': { en: 'View All Properties', ar: 'عرض جميع العقارات' },
  'emirates.listings': { en: 'listings', ar: 'إعلانات' },
  'emirates.properties': { en: 'Properties', ar: 'عقارات' },
  'emirates.browse': { en: 'Browse Properties', ar: 'تصفح العقارات' },

  // ─── Why Choose Us ───
  'why.tagline': { en: 'Why Us', ar: 'لماذا نحن' },
  'why.title1': { en: 'The Trusted Name', ar: 'الاسم الموثوق' },
  'why.title2': { en: 'in UAE Real Estate', ar: 'في عقارات الإمارات' },
  'why.description': {
    en: 'With over a decade of experience navigating the UAE property market, BNH MasterKey has become the partner of choice for discerning investors and homebuyers seeking the finest properties.',
    ar: 'مع أكثر من عقد من الخبرة في سوق العقارات الإماراتي، أصبحت BNH MasterKey الشريك المفضل للمستثمرين والمشترين الباحثين عن أفضل العقارات.',
  },
  'why.years': { en: 'Years of Excellence', ar: 'سنوات من التميز' },
  'why.trusted_agents': { en: 'Trusted Agents', ar: 'وكلاء موثوقون' },
  'why.trusted_agents_desc': { en: 'All our agents are RERA-certified with years of UAE market expertise and verified credentials.', ar: 'جميع وكلائنا معتمدون من ريرا مع سنوات من الخبرة في سوق الإمارات.' },
  'why.best_price': { en: 'Best Price Guarantee', ar: 'ضمان أفضل سعر' },
  'why.best_price_desc': { en: 'We match or beat any competitor price. Our network ensures you always get exceptional value.', ar: 'نضمن مطابقة أو التفوق على أي سعر منافس. شبكتنا تضمن لك دائمًا قيمة استثنائية.' },
  'why.verified': { en: 'Verified Listings', ar: 'إعلانات موثقة' },
  'why.verified_desc': { en: 'Every property undergoes rigorous verification — photos, legal checks, and on-site inspection.', ar: 'يخضع كل عقار لتحقق دقيق — صور، فحوصات قانونية، ومعاينة ميدانية.' },
  'why.support': { en: '24/7 Expert Support', ar: 'دعم الخبراء 24/7' },
  'why.support_desc': { en: 'Our dedicated team is available around the clock to assist with inquiries, tours, and paperwork.', ar: 'فريقنا المتخصص متاح على مدار الساعة للمساعدة في الاستفسارات والجولات والأوراق.' },
  'why.award': { en: 'Award-Winning Service', ar: 'خدمة حائزة على جوائز' },
  'why.award_desc': { en: "Recognized as the UAE's top luxury real estate platform for 3 consecutive years.", ar: 'معترف بها كأفضل منصة عقارات فاخرة في الإمارات لمدة 3 سنوات متتالية.' },
  'why.fast': { en: 'Fast Transactions', ar: 'معاملات سريعة' },
  'why.fast_desc': { en: 'Our streamlined process ensures seamless property transfers, completing deals in record time.', ar: 'عمليتنا المبسطة تضمن نقل سلس للعقارات وإتمام الصفقات في وقت قياسي.' },

  // ─── Trusted Partners ───
  'partners.tagline': { en: 'Every real estate decision. One trusted partner.', ar: 'كل قرار عقاري. شريك موثوق واحد.' },
  'partners.matters': { en: 'It', ar: 'إنه' },
  'partners.matters2': { en: 'Matters', ar: 'يهم' },
  'partners.matters3': { en: 'which Agency you', ar: 'أي وكالة' },
  'partners.matters4': { en: 'Trust', ar: 'تثق بها' },
  'partners.excellent': { en: 'Excellent', ar: 'ممتاز' },
  'partners.reviews': { en: 'Reviews', ar: 'تقييمات' },
  'partners.title': { en: 'Trusted Partner of the Most Prominent Developers', ar: 'شريك موثوق لأبرز المطورين العقاريين' },
  'partners.premium': { en: 'Premium', ar: 'مميز' },

  // ─── Stats ───
  'stats.tagline': { en: 'Our Numbers', ar: 'أرقامنا' },
  'stats.title': { en: 'BNH MasterKey by the Numbers', ar: 'BNH MasterKey بالأرقام' },
  'stats.properties': { en: 'Total Properties', ar: 'إجمالي العقارات' },
  'stats.clients': { en: 'Happy Clients', ar: 'عملاء سعداء' },
  'stats.emirates': { en: 'Emirates Covered', ar: 'إمارات مغطاة' },
  'stats.agents': { en: 'Expert Agents', ar: 'وكلاء خبراء' },

  // ─── Our Team ───
  'team.tagline': { en: 'The People Behind BNH MasterKey', ar: 'الفريق وراء BNH MasterKey' },
  'team.title': { en: 'Meet Our Team', ar: 'تعرف على فريقنا' },
  'team.description': { en: 'Our specialists bring hands-on market experience to every client relationship — whether you are buying, renting, or investing across the UAE.', ar: 'يجلب متخصصونا خبرة سوقية عملية لكل علاقة عميل — سواء كنت تشتري أو تستأجر أو تستثمر عبر الإمارات.' },
  'team.deals': { en: 'Deals Closed', ar: 'صفقات منجزة' },
  'team.rating': { en: 'rating', ar: 'تقييم' },
  'team.call': { en: 'Call Now', ar: 'اتصل الآن' },
  'team.email': { en: 'Email', ar: 'بريد إلكتروني' },

  // ─── Testimonials ───
  'testimonials.tagline': { en: 'Client Stories', ar: 'قصص العملاء' },
  'testimonials.title': { en: 'What Our Clients Say', ar: 'ماذا يقول عملاؤنا' },

  // ─── Contact Form ───
  'contact.tagline': { en: 'Get In Touch', ar: 'تواصل معنا' },
  'contact.title1': { en: 'Let Find Your', ar: 'دعنا نجد لك' },
  'contact.title2': { en: 'Perfect Property', ar: 'العقار المثالي' },
  'contact.description': { en: 'Our expert agents are ready to help you discover the finest properties across the UAE. Reach out for a personalized consultation.', ar: 'وكلاؤنا الخبراء مستعدون لمساعدتك في اكتشاف أفضل العقارات عبر الإمارات. تواصل معنا لاستشارة مخصصة.' },
  'contact.phone': { en: 'Phone', ar: 'الهاتف' },
  'contact.email_label': { en: 'Email', ar: 'البريد الإلكتروني' },
  'contact.office': { en: 'Office', ar: 'المكتب' },
  'contact.form_title': { en: 'Property Inquiry', ar: 'استفسار عقاري' },
  'contact.name': { en: 'Full Name *', ar: 'الاسم الكامل *' },
  'contact.phone_field': { en: 'Phone', ar: 'الهاتف' },
  'contact.email_field': { en: 'Email Address *', ar: 'البريد الإلكتروني *' },
  'contact.message': { en: 'Message *', ar: 'الرسالة *' },
  'contact.sending': { en: 'Sending...', ar: 'جارٍ الإرسال...' },
  'contact.send': { en: 'Send Inquiry', ar: 'إرسال الاستفسار' },
  'contact.sent': { en: 'Message Sent!', ar: 'تم إرسال الرسالة!' },
  'contact.thank_you': { en: 'Thank you for reaching out. Our team will contact you within 24 hours.', ar: 'شكرًا لتواصلك. سيتواصل فريقنا معك خلال 24 ساعة.' },
  'contact.whatsapp': { en: 'Also send via WhatsApp', ar: 'أرسل أيضًا عبر واتساب' },
  'contact.another': { en: 'Send Another Message', ar: 'إرسال رسالة أخرى' },

  // ─── Footer ───
  'footer.description': { en: 'UAE premier luxury real estate platform. Connecting discerning buyers with extraordinary properties across the Emirates since 2014.', ar: 'منصة العقارات الفاخرة الرائدة في الإمارات. نربط المشترين المميزين بعقارات استثنائية عبر الإمارات منذ 2014.' },
  'footer.browse_emirate': { en: 'Browse by Emirate', ar: 'تصفح حسب الإمارة' },
  'footer.quick_links': { en: 'Quick Links', ar: 'روابط سريعة' },
  'footer.for_sale': { en: 'Properties for Sale', ar: 'عقارات للبيع' },
  'footer.for_rent': { en: 'Properties for Rent', ar: 'عقارات للإيجار' },
  'footer.featured': { en: 'Featured Properties', ar: 'عقارات مميزة' },
  'footer.why_us': { en: 'Why Choose Us', ar: 'لماذا تختارنا' },
  'footer.contact_agent': { en: 'Contact Agent', ar: 'تواصل مع وكيل' },
  'footer.list_property': { en: 'List Your Property', ar: 'أدرج عقارك' },
  'footer.contact_info': { en: 'Contact Info', ar: 'معلومات التواصل' },
  'footer.newsletter': { en: 'Newsletter', ar: 'النشرة الإخبارية' },
  'footer.newsletter_desc': { en: 'Get exclusive property listings and UAE market insights delivered to your inbox.', ar: 'احصل على قوائم عقارات حصرية ورؤى سوق الإمارات مباشرة في بريدك.' },
  'footer.subscribe': { en: 'Subscribe', ar: 'اشترك' },
  'footer.subscribed': { en: 'Thank you for subscribing!', ar: 'شكرًا لاشتراكك!' },
  'footer.copyright': { en: 'BNH MasterKey UAE. All rights reserved.', ar: 'BNH MasterKey الإمارات. جميع الحقوق محفوظة.' },
  'footer.privacy': { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  'footer.terms': { en: 'Terms of Service', ar: 'شروط الخدمة' },
  'footer.cookies': { en: 'Cookie Policy', ar: 'سياسة ملفات تعريف الارتباط' },
  'footer.email_placeholder': { en: 'Your email address', ar: 'بريدك الإلكتروني' },

  // ─── Floating Buttons ───
  'float.whatsapp': { en: 'Chat on WhatsApp', ar: 'تحدث عبر واتساب' },
  'float.email': { en: 'Send Email', ar: 'أرسل بريد إلكتروني' },
  'float.meeting': { en: 'Schedule a Meeting', ar: 'حجز موعد' },

  // ─── Property Card ───
  'card.for_sale': { en: 'FOR SALE', ar: 'للبيع' },
  'card.for_rent': { en: 'FOR RENT', ar: 'للإيجار' },
  'card.featured': { en: 'FEATURED', ar: 'مميز' },
  'card.verified': { en: 'Verified', ar: 'موثق' },
  'card.beds': { en: 'Beds', ar: 'غرف' },
  'card.baths': { en: 'Baths', ar: 'حمامات' },
  'card.sqft': { en: 'sqft', ar: 'قدم²' },
  'card.yr': { en: '/yr', ar: '/سنة' },
  'card.view_details': { en: 'View Details', ar: 'عرض التفاصيل' },

  // ─── Emirates Cards ───
  'emirates.highlight_most_popular': { en: 'Most Popular', ar: 'الأكثر شعبية' },
  'emirates.highlight_top_investment': { en: 'Top Investment', ar: 'أفضل استثمار' },
  'emirates.highlight_best_value': { en: 'Best Value', ar: 'أفضل قيمة' },
  'emirates.highlight_waterfront': { en: 'Waterfront', ar: 'واجهة بحرية' },
  'emirates.highlight_nature_sea': { en: 'Nature & Sea', ar: 'طبيعة وبحر' },
  'emirates.highlight_hidden_gem': { en: 'Hidden Gem', ar: 'جوهرة مخفية' },
  'emirates.highlight_peaceful': { en: 'Peaceful', ar: 'هادئ' },
  'emirates.highlight_explore': { en: 'Explore', ar: 'استكشف' },
  'emirates.tagline_dubai': { en: 'Iconic skyline & waterfront living', ar: 'أفق مميز وحياة على الواجهة البحرية' },
  'emirates.tagline_abu_dhabi': { en: 'Capital luxury & cultural heritage', ar: 'فخامة العاصمة والتراث الثقافي' },
  'emirates.tagline_sharjah': { en: 'Affordable luxury & family life', ar: 'فخامة بأسعار معقولة وحياة عائلية' },
  'emirates.tagline_ajman': { en: 'Coastal charm on the Arabian Gulf', ar: 'سحر ساحلي على الخليج العربي' },
  'emirates.tagline_rak': { en: 'Mountains, beaches & resort life', ar: 'جبال وشواطئ وحياة المنتجعات' },
  'emirates.tagline_fujairah': { en: 'East coast serenity & diving haven', ar: 'هدوء الساحل الشرقي وملاذ الغوص' },
  'emirates.tagline_uaq': { en: 'Tranquil marina & waterfront villas', ar: 'مارينا هادئة وفلل على الواجهة البحرية' },
  'emirates.tagline_default': { en: 'Discover luxury living', ar: 'اكتشف الحياة الفاخرة' },

  // ─── Properties Page ───
  'props.all_emirates': { en: 'All Emirates', ar: 'جميع الإمارات' },
  'props.all_properties': { en: 'All Properties', ar: 'جميع العقارات' },
  'props.explore_full': { en: 'Explore our full portfolio of luxury properties across the United Arab Emirates.', ar: 'استكشف محفظتنا الكاملة من العقارات الفاخرة عبر الإمارات العربية المتحدة.' },
  'props.found': { en: 'Properties found', ar: 'عقارات موجودة' },
  'props.all_types': { en: 'All Types', ar: 'جميع الأنواع' },
  'props.buy_rent': { en: 'Buy & Rent', ar: 'شراء وإيجار' },
  'props.for_sale': { en: 'For Sale', ar: 'للبيع' },
  'props.for_rent': { en: 'For Rent', ar: 'للإيجار' },
  'props.apartment': { en: 'Apartment', ar: 'شقة' },
  'props.villa': { en: 'Villa', ar: 'فيلا' },
  'props.penthouse': { en: 'Penthouse', ar: 'بنتهاوس' },
  'props.townhouse': { en: 'Townhouse', ar: 'تاون هاوس' },
  'props.commercial': { en: 'Commercial', ar: 'تجاري' },
  'props.featured_first': { en: 'Featured First', ar: 'المميز أولاً' },
  'props.newest_first': { en: 'Newest First', ar: 'الأحدث أولاً' },
  'props.price_low_high': { en: 'Price: Low to High', ar: 'السعر: من الأقل' },
  'props.price_high_low': { en: 'Price: High to Low', ar: 'السعر: من الأعلى' },
  'props.no_properties': { en: 'No properties found', ar: 'لم يتم العثور على عقارات' },
  'props.adjust_filters': { en: 'Try adjusting your filters to see more results.', ar: 'جرب تعديل الفلاتر لرؤية المزيد من النتائج.' },
  'props.load_more': { en: 'Load More Properties', ar: 'تحميل المزيد' },
  'props.showing': { en: 'Showing', ar: 'عرض' },
  'props.of': { en: 'of', ar: 'من' },
  'props.properties': { en: 'properties', ar: 'عقارات' },
  'props.properties_in': { en: 'Properties in', ar: 'عقارات في' },
  'props.uae_emirates': { en: 'UAE Emirates', ar: 'إمارات الدولة' },

  // ─── Transactions Page ───
  'txn.title': { en: 'UAE Real Estate', ar: 'عقارات الإمارات' },
  'txn.title2': { en: 'Transactions', ar: 'المعاملات' },
  'txn.description': { en: 'Explore real property sale and resale transactions across the UAE. Data sourced from Dubai Land Department (DLD).', ar: 'استكشف معاملات بيع وإعادة بيع العقارات الحقيقية عبر الإمارات. البيانات مصدرها دائرة الأراضي والأملاك في دبي.' },
  'txn.search_placeholder': { en: 'Search project, building, area...', ar: 'ابحث عن مشروع، مبنى، منطقة...' },
  'txn.all_emirates': { en: 'All Emirates', ar: 'جميع الإمارات' },
  'txn.sort': { en: 'Sort', ar: 'ترتيب' },
  'txn.area': { en: 'Area', ar: 'المنطقة' },
  'txn.all_areas': { en: 'All Areas', ar: 'جميع المناطق' },
  'txn.type': { en: 'Type', ar: 'النوع' },
  'txn.beds': { en: 'Beds', ar: 'غرف' },
  'txn.transaction': { en: 'Transaction', ar: 'المعاملة' },
  'txn.all': { en: 'All', ar: 'الكل' },
  'txn.sale': { en: 'Sale', ar: 'بيع' },
  'txn.resale': { en: 'Resale', ar: 'إعادة بيع' },
  'txn.clear_all': { en: 'Clear all', ar: 'مسح الكل' },
  'txn.total_value': { en: 'Total Value', ar: 'القيمة الإجمالية' },
  'txn.transactions': { en: 'Transactions', ar: 'المعاملات' },
  'txn.avg_gain': { en: 'Avg. Capital Gain', ar: 'متوسط الربح الرأسمالي' },
  'txn.showing': { en: 'Showing', ar: 'عرض' },
  'txn.of': { en: 'of', ar: 'من' },
  'txn.results': { en: 'results', ar: 'نتائج' },
  'txn.result': { en: 'result', ar: 'نتيجة' },
  'txn.download': { en: 'Download', ar: 'تحميل' },
  'txn.location': { en: 'Location', ar: 'الموقع' },
  'txn.price_gain': { en: 'Price / Capital Gain', ar: 'السعر / الربح الرأسمالي' },
  'txn.specs': { en: 'Specs', ar: 'المواصفات' },
  'txn.date_sold': { en: 'Date / Sold By', ar: 'التاريخ / البائع' },
  'txn.actions': { en: 'Actions', ar: 'الإجراءات' },
  'txn.no_found': { en: 'No transactions found matching your filters.', ar: 'لم يتم العثور على معاملات تطابق الفلاتر.' },
  'txn.clear_filters': { en: 'Clear all filters', ar: 'مسح جميع الفلاتر' },
  'txn.details': { en: 'Details', ar: 'التفاصيل' },
  'txn.hide': { en: 'Hide', ar: 'إخفاء' },
  'txn.share': { en: 'Share Transaction', ar: 'مشاركة المعاملة' },
  'txn.copied': { en: 'Copied!', ar: 'تم النسخ!' },
  'txn.copy_details': { en: 'Copy Details', ar: 'نسخ التفاصيل' },
  'txn.prev': { en: 'Prev', ar: 'السابق' },
  'txn.next': { en: 'Next', ar: 'التالي' },
  'txn.page': { en: 'Page', ar: 'صفحة' },
  'txn.transaction_price': { en: 'Transaction Price', ar: 'سعر المعاملة' },
  'txn.price_per_sqft': { en: 'Price per sqft', ar: 'السعر لكل قدم²' },
  'txn.area_label': { en: 'Area', ar: 'المساحة' },
  'txn.bedrooms': { en: 'Bedrooms', ar: 'غرف النوم' },
  'txn.unit_type': { en: 'Unit Type', ar: 'نوع الوحدة' },
  'txn.transaction_type': { en: 'Transaction Type', ar: 'نوع المعاملة' },
  'txn.sold_by': { en: 'Sold By', ar: 'البائع' },
  'txn.date': { en: 'Date', ar: 'التاريخ' },
  'txn.emirate': { en: 'Emirate', ar: 'الإمارة' },
  'txn.property_usage': { en: 'Property Usage', ar: 'استخدام العقار' },
  'txn.capital_gain': { en: 'Capital Gain', ar: 'الربح الرأسمالي' },
  'txn.date_newest': { en: 'Date (Newest)', ar: 'التاريخ (الأحدث)' },
  'txn.date_oldest': { en: 'Date (Oldest)', ar: 'التاريخ (الأقدم)' },
  'txn.price_high': { en: 'Price (High)', ar: 'السعر (الأعلى)' },
  'txn.price_low': { en: 'Price (Low)', ar: 'السعر (الأقل)' },
  'txn.size_large': { en: 'Size (Large)', ar: 'المساحة (الأكبر)' },
  'txn.size_small': { en: 'Size (Small)', ar: 'المساحة (الأصغر)' },
  'txn.apartment': { en: 'Apartment', ar: 'شقة' },
  'txn.villa': { en: 'Villa', ar: 'فيلا' },
  'txn.townhouse': { en: 'Townhouse', ar: 'تاون هاوس' },
  'txn.penthouse': { en: 'Penthouse', ar: 'بنتهاوس' },
  'txn.studio': { en: 'Studio', ar: 'استوديو' },

  // ─── Meeting Page ───
  'meeting.tagline': { en: 'Book a Meeting', ar: 'حجز اجتماع' },
  'meeting.title': { en: 'Schedule a Meeting', ar: 'حجز موعد' },
  'meeting.description': { en: 'Pick a date and an available time slot to meet with our advisors. Slots already booked will be disabled.', ar: 'اختر تاريخًا وموعدًا متاحًا للقاء مستشارينا. المواعيد المحجوزة ستكون معطلة.' },
  'meeting.name': { en: 'Full name *', ar: 'الاسم الكامل *' },
  'meeting.email': { en: 'Email *', ar: 'البريد الإلكتروني *' },
  'meeting.phone': { en: 'Phone *', ar: 'الهاتف *' },
  'meeting.purpose': { en: 'Purpose *', ar: 'الغرض *' },
  'meeting.select_purpose': { en: 'Select purpose', ar: 'اختر الغرض' },
  'meeting.property_viewing': { en: 'Property Viewing', ar: 'معاينة عقار' },
  'meeting.investment': { en: 'Investment Consultation', ar: 'استشارة استثمارية' },
  'meeting.buy': { en: 'Buy Property', ar: 'شراء عقار' },
  'meeting.rent': { en: 'Rent Property', ar: 'استئجار عقار' },
  'meeting.sell': { en: 'Sell Property', ar: 'بيع عقار' },
  'meeting.general': { en: 'General Inquiry', ar: 'استفسار عام' },
  'meeting.location': { en: 'Location *', ar: 'الموقع *' },
  'meeting.location_placeholder': { en: 'e.g. Office — Dubai Marina, or virtual (Zoom)', ar: 'مثال: المكتب — دبي مارينا، أو افتراضي (زوم)' },
  'meeting.date': { en: 'Date *', ar: 'التاريخ *' },
  'meeting.time': { en: 'Time *', ar: 'الوقت *' },
  'meeting.select_date_first': { en: 'Select a date first', ar: 'اختر تاريخًا أولاً' },
  'meeting.loading_slots': { en: 'Loading slots…', ar: 'جارٍ تحميل المواعيد…' },
  'meeting.select_time': { en: 'Select a time', ar: 'اختر وقتًا' },
  'meeting.unavailable': { en: '— unavailable', ar: '— غير متاح' },
  'meeting.slots_booked': { en: 'slots already booked on this date.', ar: 'مواعيد محجوزة بالفعل في هذا التاريخ.' },
  'meeting.slot_booked': { en: 'slot already booked on this date.', ar: 'موعد محجوز بالفعل في هذا التاريخ.' },
  'meeting.message': { en: 'Message (optional)', ar: 'رسالة (اختياري)' },
  'meeting.message_placeholder': { en: 'Anything we should know in advance?', ar: 'هل هناك شيء يجب أن نعرفه مسبقًا؟' },
  'meeting.submit': { en: 'Schedule Meeting', ar: 'حجز الموعد' },
  'meeting.success_title': { en: 'Meeting scheduled', ar: 'تم حجز الاجتماع' },
  'meeting.success_msg': { en: "Thank you, {name}. We'll reach out shortly to confirm.", ar: 'شكرًا لك، {name}. سنتواصل معك قريبًا للتأكيد.' },
  'meeting.schedule_another': { en: 'Schedule another meeting', ar: 'حجز اجتماع آخر' },
  'meeting.name_placeholder': { en: 'Your name', ar: 'اسمك' },
  'meeting.email_placeholder': { en: 'you@example.com', ar: 'you@example.com' },
  'meeting.phone_placeholder': { en: '+971 55 123 4567', ar: '+971 55 123 4567' },

  // ─── Common ───
  'common.properties_llc': { en: 'Properties L.L.C', ar: 'للعقارات ذ.م.م' },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const toggle = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  const t = useCallback(
    (key: string) => translations[key]?.[lang] ?? key,
    [lang]
  );

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, toggle, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
