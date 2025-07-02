'use server';

import { revalidatePath } from 'next/cache';
import { addPrincipalWithClassification, updateApprovalStatus, updateUac } from '@/lib/firestore';
import { principalFormSchema, reviewerApprovalSchema } from '@/lib/zodSchemas';

export async function addPrincipalServerAction(prevState: any, formData: FormData) {
  const fields = {
    principal: formData.get('principal'),
    resource: formData.get('resource'),
    role: formData.get('role'),
    pType: formData.get('pType'),
    givenClassification: formData.get('givenClassification'),
    requestedClassification: formData.get('requestedClassification'),
    overrideReason: formData.get('overrideReason'),
    requestStatus: formData.get('requestStatus'),
    approvalStatus: formData.get('approvalStatus') ?? 'pending',
    requestDate: formData.get('requestDate'),
    uac: formData.get('uac'),
    reviewer: formData.get('reviewer'),
  };

  const parse = principalFormSchema.safeParse(fields);
  if (!parse.success) {
    return { error: parse.error.errors.map(e => e.message).join(', ') };
  }
  await addPrincipalWithClassification(parse.data);
  revalidatePath('/admin');
  return { success: true };
}

export async function reviewerApprovalAction(prevState: any, formData: FormData) {
  const fields = {
    id: formData.get('id'),
    approvalStatus: formData.get('approvalStatus'),
    reviewer: formData.get('reviewer'),
  };
  const parse = reviewerApprovalSchema.safeParse(fields);
  if (!parse.success) {
    return { error: parse.error.errors.map(e => e.message).join(', ') };
  }
  await updateApprovalStatus(parse.data.id, parse.data.approvalStatus, parse.data.reviewer);
  revalidatePath('/admin');
  return { success: true };
}

export async function editorUpdateUacAction(prevState: any, formData: FormData) {
  const id = formData.get('id');
  const uac = formData.get('uac');
  if (!id) return { error: 'ID required' };
  await updateUac(id as string, uac as string);
  revalidatePath('/admin');
  return { success: true };
}
