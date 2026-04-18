import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TransactionsClient from './TransactionsClient';
import { fetchTransactions } from '@/lib/dld-api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'UAE Real Estate Transactions | BNH MasterKey',
  description:
    'Explore real property sale and resale transactions across the UAE. Data sourced from Dubai Land Department.',
};

export default async function TransactionsPage() {
  // Fetch initial data server-side (first page)
  const initial = await fetchTransactions({ offset: 0, limit: 12, sort: 'date_desc' });

  return (
    <>
      <Navbar />
      <TransactionsClient
        initialTransactions={initial.transactions}
        initialTotal={initial.total}
        isLive={initial.live}
      />
      <Footer />
    </>
  );
}
