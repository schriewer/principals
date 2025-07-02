// Mock for demo! Replace with actual BigQuery logic if needed.
import { RoleClassification, Principal } from '@/types';

export async function fetchRoleClassifications(): Promise<RoleClassification[]> {
  return [
    { role: 'reader', classification: 'non privileged' },
    { role: 'writer', classification: 'privileged' },
    { role: 'admin', classification: 'high risk' },
    { role: 'superuser', classification: 'super user role' },
  ];
}

export async function fetchBigQueryPrincipals(): Promise<Principal[]> {
  return [
    { principal: 'group:devs', resource: 'app1', role: 'reader', pType: 'group' },
    { principal: 'serviceAccount:svc-app', resource: 'app2', role: 'writer', pType: 'service account' },
    { principal: 'user1', resource: 'app3', role: 'admin', pType: 'generic principal' },
    { principal: 'localdb:dbuser', resource: 'db1', role: 'reader', pType: 'local db account' },
  ];
}
