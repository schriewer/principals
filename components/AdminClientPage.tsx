'use client';
import React, { useState } from 'react';
import { Principal, PrincipalDoc } from '@/types';
import { PrincipalTable } from './PrincipalTable';
import { PrincipalForm } from './PrincipalForm';
import { PrincipalFirestoreTable } from './PrincipalFirestoreTable';
import { useUser } from '@/contexts/UserContext';
import { addPrincipalServerAction, editorUpdateUacAction } from '@/app/admin/actions';

type Props = {
  bigQueryPrincipals: Principal[];
  firestorePrincipals: PrincipalDoc[];
};

export function AdminClientPage({ bigQueryPrincipals, firestorePrincipals }: Props) {
  const user = useUser();
  const [selected, setSelected] = useState<Principal | null>(null);
  const [regexTestMatches, setRegexTestMatches] = useState<boolean[] | null>(null);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="font-bold mb-2">Source Table (BigQuery)</h2>
          <PrincipalTable
            data={bigQueryPrincipals}
            alreadyAdded={firestorePrincipals}
            onSelect={row => {
              // pType inference and cleanup
              let pType: Principal['pType'] = 'generic principal';
              let principal = row.principal;
              if (principal.startsWith('group:')) {
                pType = 'group';
                principal = principal.replace(/^group:/, '');
              } else if (principal.startsWith('serviceAccount:')) {
                pType = 'service account';
                principal = principal.replace(/^serviceAccount:/, '');
              } else if (principal.startsWith('localdb:')) {
                pType = 'local db account';
                principal = principal.replace(/^localdb:/, '');
              }
              setSelected({ ...row, principal, pType });
            }}
            regexMatches={regexTestMatches}
          />
        </div>
        <div>
          <h2 className="font-bold mb-2">Add Principal</h2>
          {(user?.role === 'editor' || user?.role === 'reviewer') && (
            <PrincipalForm
              initialValues={selected}
              formAction={addPrincipalServerAction}
              sourceData={bigQueryPrincipals}
              onRegexTestResults={setRegexTestMatches}
            />
          )}
        </div>
        <div>
          <h2 className="font-bold mb-2">Firestore Table</h2>
          <PrincipalFirestoreTable
            data={firestorePrincipals}
            user={user}
            editorUpdateUacAction={editorUpdateUacAction}
          />
        </div>
      </div>
    </div>
  );
}
