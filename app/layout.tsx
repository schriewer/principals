import { fetchRoleClassifications } from '@/lib/bigquery';
import { RoleClassificationProvider } from '@/contexts/RoleClassificationContext';
import { UserProvider } from '@/contexts/UserContext';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const roleClassifications = await fetchRoleClassifications();
  // Simulate logged-in user (viewer/editor/reviewer)
  const user = {
    email: 'reviewer@example.com',
    displayName: 'Alice Reviewer',
    role: 'reviewer' as const, // change to 'editor' or 'viewer' to test
  };

  return (
    <html lang="en">
      <body>
        <UserProvider user={user}>
          <RoleClassificationProvider value={roleClassifications}>
            {children}
          </RoleClassificationProvider>
        </UserProvider>
      </body>
    </html>
  );
}
