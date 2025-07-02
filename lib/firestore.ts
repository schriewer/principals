import { Firestore } from '@google-cloud/firestore';
import { PrincipalDoc } from '@/types';

const db = new Firestore();

export async function fetchFirestorePrincipals(): Promise<PrincipalDoc[]> {
  const snapshot = await db.collection('principals').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<PrincipalDoc, 'id'>),
  }));
}

export async function addPrincipalWithClassification(doc: Omit<PrincipalDoc, 'id'>) {
  await db.collection('principals').add(doc);
}

export async function updateApprovalStatus(id: string, approvalStatus: string, reviewer: string) {
  await db.collection('principals').doc(id).update({ approvalStatus, reviewer });
}

export async function updateUac(id: string, uac: string) {
  await db.collection('principals').doc(id).update({ uac });
}
