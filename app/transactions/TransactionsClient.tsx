'use client';

import { useState, useMemo } from 'react';
import { Transaction } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';
import {
  Search,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Building2,
  MapPin,
  ArrowUpDown,
  Download,
  X,
  Eye,
  Share2,
  Copy,
  Check,
  Ruler,
  Bed,
  Tag,
  User,
  CalendarDays,
  DollarSign,
  BarChart3,
  Home,
} from 'lucide-react';

interface TransactionsClientProps {
  initialTransactions: Transaction[];
  initialTotal: number;
  isLive: boolean;
}

function getDateRange(range: string): Date | null {
  const now = new Date();
  switch (range) {
    case 'ytd':
      return new Date(now.getFullYear(), 0, 1);
    case '1m':
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case '3m':
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    case '6m':
      return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    case '1y':
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    default:
      return null;
  }
}

function formatCompactPrice(price: number): string {
  if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(2)}B`;
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
  return price.toLocaleString();
}

function formatFullPrice(price: number): string {
  return price.toLocaleString('en-AE');
}

export default function TransactionsClient({ initialTransactions: transactions }: TransactionsClientProps) {
  const { t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [emirate, setEmirate] = useState('All');
  const [dateRange, setDateRange] = useState('ytd');
  const [unitType, setUnitType] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');
  const [transactionType, setTransactionType] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 12;

  const DATE_RANGES = [
    { label: 'YTD', value: 'ytd' },
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
    { label: t('txn.all'), value: 'all' },
  ];

  const UNIT_TYPES = [
    { label: t('txn.all'), value: 'All' },
    { label: t('txn.apartment'), value: 'Apartment' },
    { label: t('txn.villa'), value: 'Villa' },
    { label: t('txn.townhouse'), value: 'Townhouse' },
    { label: t('txn.penthouse'), value: 'Penthouse' },
  ];

  const BEDROOM_OPTIONS = [
    { label: t('txn.all'), value: 'All' },
    { label: t('txn.studio'), value: 'Studio' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5+', value: '5+' },
  ];

  const TRANSACTION_TYPES = [
    { label: t('txn.all'), value: 'All' },
    { label: t('txn.sale'), value: 'Sale' },
    { label: t('txn.resale'), value: 'Resale' },
  ];

  const SORT_OPTIONS = [
    { label: t('txn.date_newest'), value: 'date_desc' },
    { label: t('txn.date_oldest'), value: 'date_asc' },
    { label: t('txn.price_high'), value: 'price_desc' },
    { label: t('txn.price_low'), value: 'price_asc' },
    { label: t('txn.size_large'), value: 'size_desc' },
    { label: t('txn.size_small'), value: 'size_asc' },
  ];

  const allEmirates = useMemo(() => {
    const set = new Set(transactions.map((tx) => tx.emirate));
    return ['All', ...Array.from(set).sort()];
  }, [transactions]);

  const locations = useMemo(() => {
    const filtered = emirate === 'All' ? transactions : transactions.filter((tx) => tx.emirate === emirate);
    const set = new Set(filtered.map((tx) => tx.location));
    return ['All', ...Array.from(set).sort()];
  }, [transactions, emirate]);

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.project_name.toLowerCase().includes(q) ||
          tx.building_name.toLowerCase().includes(q) ||
          tx.location.toLowerCase().includes(q)
      );
    }

    if (emirate !== 'All') result = result.filter((tx) => tx.emirate === emirate);
    if (selectedLocation !== 'All') result = result.filter((tx) => tx.location === selectedLocation);

    const minDate = getDateRange(dateRange);
    if (minDate) result = result.filter((tx) => new Date(tx.date) >= minDate);

    if (unitType !== 'All') result = result.filter((tx) => tx.unit_type === unitType);

    if (bedrooms !== 'All') {
      if (bedrooms === '5+') result = result.filter((tx) => typeof tx.bedrooms === 'number' && tx.bedrooms >= 5);
      else if (bedrooms === 'Studio') result = result.filter((tx) => tx.bedrooms === 'Studio');
      else result = result.filter((tx) => tx.bedrooms === parseInt(bedrooms));
    }

    if (transactionType !== 'All') result = result.filter((tx) => tx.transaction_type === transactionType);

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price_desc': return b.price - a.price;
        case 'price_asc': return a.price - b.price;
        case 'size_desc': return b.area_sqft - a.area_sqft;
        case 'size_asc': return a.area_sqft - b.area_sqft;
        default: return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }, [transactions, searchQuery, emirate, selectedLocation, dateRange, unitType, bedrooms, transactionType, sortBy]);

  const filterKey = `${searchQuery}|${emirate}|${selectedLocation}|${dateRange}|${unitType}|${bedrooms}|${transactionType}|${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginatedRows = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const stats = useMemo(() => {
    const totalValue = filtered.reduce((sum, tx) => sum + tx.price, 0);
    const totalCount = filtered.length;
    const avgGain = filtered.length > 0 ? filtered.reduce((sum, tx) => sum + tx.capital_gain, 0) / filtered.length : 0;
    return { totalValue, totalCount, avgGain };
  }, [filtered]);

  const activeFilterCount = [
    emirate !== 'All', unitType !== 'All', bedrooms !== 'All', transactionType !== 'All', selectedLocation !== 'All',
  ].filter(Boolean).length;

  const handleShare = async (txn: Transaction) => {
    const bedroomLabel = txn.bedrooms === 'Studio' ? t('txn.studio') : txn.bedrooms + ' BR';
    const text = `${txn.project_name} - ${txn.building_name}\n${txn.unit_type} | ${bedroomLabel} | ${txn.area_sqft.toLocaleString()} sqft\nAED ${formatFullPrice(txn.price)} | ${txn.location}, ${txn.emirate}\n${txn.transaction_type} - ${txn.date}`;
    if (navigator.share) {
      try { await navigator.share({ title: `${txn.project_name} Transaction`, text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopiedId(txn.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]" dir={dir}>
      {/* Hero */}
      <div className="relative pt-28 pb-8 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <h1 className="font-display text-3xl sm:text-4xl text-white font-bold mb-2">
            {t('txn.title')} <span className="text-gold">{t('txn.title2')}</span>
          </h1>
          <p className="text-gray-400 font-body text-sm sm:text-base max-w-2xl">
            {t('txn.description')}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[68px] z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder={t('txn.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C9A84C]/50 font-body"
              />
            </div>

            <select
              value={emirate}
              onChange={(e) => { setEmirate(e.target.value); setSelectedLocation('All'); }}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white font-body focus:outline-none focus:border-[#C9A84C]/50 appearance-none cursor-pointer min-w-[120px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                paddingRight: '30px',
              }}
            >
              {allEmirates.map((e) => (
                <option key={e} value={e} className="bg-[#1a1a1a]">
                  {e === 'All' ? t('txn.all_emirates') : e}
                </option>
              ))}
            </select>

            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white font-body transition-colors"
              >
                <ArrowUpDown size={14} />
                <span className="hidden sm:inline">{t('txn.sort')}</span>
                <ChevronDown size={12} />
              </button>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 min-w-[170px] py-1">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-sm font-body transition-colors ${
                          sortBy === opt.value ? 'text-[#C9A84C] bg-[#C9A84C]/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-body">{t('txn.area')}</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-sm text-white font-body focus:outline-none focus:border-[#C9A84C]/50 appearance-none cursor-pointer min-w-[160px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    paddingRight: '28px',
                  }}
                >
                  {locations.map((l) => (
                    <option key={l} value={l} className="bg-[#1a1a1a]">
                      {l === 'All' ? t('txn.all_areas') : l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-body">{t('txn.type')}</label>
                <div className="flex gap-1">
                  {UNIT_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setUnitType(type.value)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-body transition-colors ${
                        unitType === type.value ? 'bg-[#C9A84C] text-[#0a0a0a] font-medium' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-body">{t('txn.beds')}</label>
                <div className="flex gap-1">
                  {BEDROOM_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBedrooms(opt.value)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-body transition-colors min-w-[32px] ${
                        bedrooms === opt.value ? 'bg-[#C9A84C] text-[#0a0a0a] font-medium' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-body">{t('txn.transaction')}</label>
                <div className="flex gap-1">
                  {TRANSACTION_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setTransactionType(type.value)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-body transition-colors ${
                        transactionType === type.value ? 'bg-[#C9A84C] text-[#0a0a0a] font-medium' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex items-end">
                  <button
                    onClick={() => { setEmirate('All'); setSelectedLocation('All'); setUnitType('All'); setBedrooms('All'); setTransactionType('All'); }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 font-body transition-colors"
                  >
                    <X size={12} />
                    {t('txn.clear_all')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Date Range Pills */}
          <div className="flex items-center gap-1.5 mt-3">
            {DATE_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all ${
                  dateRange === range.value ? 'bg-[#C9A84C] text-[#0a0a0a]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Location Chips */}
          {locations.length > 2 && (
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
              {locations.slice(1, 12).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(selectedLocation === loc ? 'All' : loc)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-body transition-all border ${
                    selectedLocation === loc
                      ? 'bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]'
                      : 'bg-white/[0.03] border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-body mb-1">{t('txn.total_value')}</div>
            <div className="font-display text-2xl sm:text-3xl text-white font-bold">
              <span className="text-gray-500 text-lg mr-1">AED</span>
              {formatCompactPrice(stats.totalValue)}
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-body mb-1">{t('txn.transactions')}</div>
            <div className="font-display text-2xl sm:text-3xl text-white font-bold">
              {stats.totalCount.toLocaleString()}
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-body mb-1">{t('txn.avg_gain')}</div>
            <div className="flex items-center gap-2">
              <span className={`font-display text-2xl sm:text-3xl font-bold ${stats.avgGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.avgGain >= 0 ? '+' : ''}{stats.avgGain.toFixed(1)}%
              </span>
              {stats.avgGain >= 0 ? <TrendingUp className="text-emerald-400" size={20} /> : <TrendingDown className="text-red-400" size={20} />}
            </div>
          </div>
        </div>
      </div>

      {/* Results count + Download */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 font-body">
            {t('txn.showing')} {Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} {t('txn.of')} {filtered.length} {filtered.length !== 1 ? t('txn.results') : t('txn.result')}
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white font-body transition-colors">
            <Download size={12} />
            {t('txn.download')}
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2.5 text-[10px] uppercase tracking-wider text-gray-500 font-body border-b border-white/5">
          <div className="col-span-4">{t('txn.location')}</div>
          <div className="col-span-2">{t('txn.price_gain')}</div>
          <div className="col-span-2">{t('txn.specs')}</div>
          <div className="col-span-2">{t('txn.date_sold')}</div>
          <div className="col-span-2 text-right">{t('txn.actions')}</div>
        </div>

        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Building2 size={40} className="mb-3 opacity-30" />
              <p className="font-body text-sm">{t('txn.no_found')}</p>
              <button
                onClick={() => { setSearchQuery(''); setEmirate('All'); setSelectedLocation('All'); setUnitType('All'); setBedrooms('All'); setTransactionType('All'); setDateRange('all'); }}
                className="mt-3 text-[#C9A84C] text-sm font-body hover:underline"
              >
                {t('txn.clear_filters')}
              </button>
            </div>
          ) : (
            paginatedRows.map((txn) => {
              const isExpanded = expandedId === txn.id;
              const bedroomLabel = txn.bedrooms === 'Studio' ? t('txn.studio') : `${txn.bedrooms} BR`;
              const dateObj = new Date(txn.date);
              const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

              return (
                <div key={txn.id} className="border-b border-white/5">
                  <div className="group grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-4 py-4 transition-colors hover:bg-white/[0.02]">
                    <div className="col-span-4">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                          <Building2 size={14} className="text-[#C9A84C]" />
                        </div>
                        <div>
                          <p className="text-sm text-white font-body font-medium leading-tight">{txn.project_name}</p>
                          <p className="text-xs text-gray-500 font-body mt-0.5">{txn.building_name}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium font-body ${
                              txn.unit_type === 'Villa' ? 'bg-emerald-500/10 text-emerald-400'
                              : txn.unit_type === 'Penthouse' ? 'bg-purple-500/10 text-purple-400'
                              : txn.unit_type === 'Townhouse' ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-sky-500/10 text-sky-400'
                            }`}>
                              {txn.unit_type}
                            </span>
                            <span className="flex items-center gap-0.5 text-[10px] text-gray-500 font-body">
                              <MapPin size={10} />{txn.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 flex flex-col justify-center">
                      <p className="text-sm text-white font-body font-semibold">AED {formatFullPrice(txn.price)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {txn.capital_gain >= 0 ? <TrendingUp size={11} className="text-emerald-400" /> : <TrendingDown size={11} className="text-red-400" />}
                        <span className={`text-[11px] font-body font-medium ${txn.capital_gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {txn.capital_gain >= 0 ? '+' : ''}{txn.capital_gain}%
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 flex flex-col justify-center">
                      <p className="text-sm text-white font-body">{txn.area_sqft.toLocaleString()} sqft</p>
                      <p className="text-xs text-gray-500 font-body mt-0.5">{bedroomLabel}</p>
                    </div>

                    <div className="col-span-2 flex flex-col justify-center">
                      <p className="text-sm text-white font-body">{formattedDate}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium font-body ${
                          txn.transaction_type === 'Sale' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'bg-orange-500/10 text-orange-400'
                        }`}>
                          {txn.transaction_type}
                        </span>
                        <span className="text-[11px] text-gray-500 font-body">{txn.sold_by}</span>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : txn.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
                          isExpanded ? 'bg-[#C9A84C] text-[#0a0a0a]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                        }`}
                        title={t('txn.details')}
                      >
                        <Eye size={13} />
                        <span className="hidden lg:inline">{isExpanded ? t('txn.hide') : t('txn.details')}</span>
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                      <button
                        onClick={() => handleShare(txn)}
                        className="flex items-center gap-1 p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 border border-white/10 transition-all"
                        title={t('txn.share')}
                      >
                        {copiedId === txn.id ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                      </button>
                    </div>

                    <div className="sm:hidden flex flex-wrap gap-2 text-[10px] text-gray-600 font-body -mt-1">
                      <span>AED {formatFullPrice(txn.price)}</span>
                      <span>{txn.area_sqft} sqft</span>
                      <span>{bedroomLabel}</span>
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-white/[0.02] border-t border-white/5 px-4 py-5 animate-fade-in">
                      <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center">
                            <Building2 size={18} className="text-[#C9A84C]" />
                          </div>
                          <div>
                            <h3 className="font-display text-lg text-white font-bold">{txn.project_name}</h3>
                            <p className="text-sm text-gray-400 font-body">{txn.building_name}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          <DetailCard icon={<DollarSign size={14} />} label={t('txn.transaction_price')} value={`AED ${formatFullPrice(txn.price)}`} />
                          <DetailCard icon={<BarChart3 size={14} />} label={t('txn.price_per_sqft')} value={`AED ${txn.price_per_sqft.toLocaleString()}`} />
                          <DetailCard icon={<Ruler size={14} />} label={t('txn.area_label')} value={`${txn.area_sqft.toLocaleString()} sqft`} />
                          <DetailCard icon={<Bed size={14} />} label={t('txn.bedrooms')} value={bedroomLabel} />
                          <DetailCard icon={<Home size={14} />} label={t('txn.unit_type')} value={txn.unit_type} />
                          <DetailCard icon={<Tag size={14} />} label={t('txn.transaction_type')} value={txn.transaction_type} highlight={txn.transaction_type === 'Sale' ? 'gold' : 'orange'} />
                          <DetailCard icon={<User size={14} />} label={t('txn.sold_by')} value={txn.sold_by} />
                          <DetailCard icon={<CalendarDays size={14} />} label={t('txn.date')} value={formattedDate} />
                          <DetailCard icon={<MapPin size={14} />} label={t('txn.location')} value={txn.location} />
                          <DetailCard icon={<MapPin size={14} />} label={t('txn.emirate')} value={txn.emirate} />
                          <DetailCard icon={<Building2 size={14} />} label={t('txn.property_usage')} value={txn.property_usage} />
                          <DetailCard
                            icon={txn.capital_gain >= 0 ? <TrendingUp size={14} className="text-emerald-400" /> : <TrendingDown size={14} className="text-red-400" />}
                            label={t('txn.capital_gain')}
                            value={`${txn.capital_gain >= 0 ? '+' : ''}${txn.capital_gain}%`}
                            highlight={txn.capital_gain >= 0 ? 'green' : 'red'}
                          />
                        </div>

                        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
                          <button
                            onClick={() => handleShare(txn)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white font-body transition-colors"
                          >
                            {copiedId === txn.id ? (
                              <><Check size={14} className="text-emerald-400" />{t('txn.copied')}</>
                            ) : (
                              <><Share2 size={14} />{t('txn.share')}</>
                            )}
                          </button>
                          <button
                            onClick={async () => {
                              const text = `Project: ${txn.project_name}\nBuilding: ${txn.building_name}\nType: ${txn.unit_type} | ${bedroomLabel}\nArea: ${txn.area_sqft.toLocaleString()} sqft\nPrice: AED ${formatFullPrice(txn.price)} (AED ${txn.price_per_sqft}/sqft)\nCapital Gain: ${txn.capital_gain >= 0 ? '+' : ''}${txn.capital_gain}%\nLocation: ${txn.location}, ${txn.emirate}\nTransaction: ${txn.transaction_type} by ${txn.sold_by}\nDate: ${formattedDate}`;
                              await navigator.clipboard.writeText(text);
                              setCopiedId(txn.id);
                              setTimeout(() => setCopiedId(null), 2000);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white font-body transition-colors"
                          >
                            <Copy size={14} />
                            {t('txn.copy_details')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2">
              <span className="text-xs text-gray-500 font-body">
                {t('txn.page')} {currentPage} {t('txn.of')} {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); setExpandedId(null); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  {t('txn.prev')}
                </button>
                {(() => {
                  const pages: (number | string)[] = [];
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (currentPage > 3) pages.push('...');
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);
                    for (let i = start; i <= end; i++) pages.push(i);
                    if (currentPage < totalPages - 2) pages.push('...');
                    pages.push(totalPages);
                  }
                  return pages.map((page, i) =>
                    page === '...' ? (
                      <span key={`dots-${i}`} className="px-2 text-gray-600 text-xs font-body">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => { setCurrentPage(page as number); setExpandedId(null); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                        className={`w-8 h-8 rounded-lg text-xs font-body font-medium transition-all ${
                          currentPage === page ? 'bg-[#C9A84C] text-[#0a0a0a]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}
                <button
                  onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); setExpandedId(null); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  {t('txn.next')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: 'gold' | 'green' | 'red' | 'orange' }) {
  const valueColor = highlight === 'gold' ? 'text-[#C9A84C]' : highlight === 'green' ? 'text-emerald-400' : highlight === 'red' ? 'text-red-400' : highlight === 'orange' ? 'text-orange-400' : 'text-white';
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-gray-500">{icon}</span>
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-body">{label}</span>
      </div>
      <p className={`text-sm font-body font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}
