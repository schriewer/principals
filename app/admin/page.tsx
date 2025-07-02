import { fetchFirestorePrincipals } from '@/lib/firestore';
import { fetchBigQueryPrincipals } from '@/lib/bigquery';
import { AdminClientPage } from '@/components/AdminClientPage';

export default async function AdminPage() {
  const bigQueryPrincipals = await fetchBigQueryPrincipals();
  const firestorePrincipals = await fetchFirestorePrincipals();
  return (
    <AdminClientPage
      bigQueryPrincipals={bigQueryPrincipals}
      firestorePrincipals={firestorePrincipals}
    />
  );
}
