import { z } from 'zod';

export const principalFormSchema = z.object({
  principal: z.string().min(1, 'Principal is required'),
  resource: z.string().min(1, 'Resource is required'),
  role: z.string().min(1, 'Role is required'),
  pType: z.enum(['group', 'service account', 'generic principal', 'local db account']),
  givenClassification: z.string().min(1),
  requestedClassification: z.string().min(1),
  overrideReason: z.string().optional(),
  requestStatus: z.enum(['approved', 'rejected', 'pending review']),
  approvalStatus: z.enum(['approved', 'pending', 'rejected']).default('pending'),
  requestDate: z.string().optional(),
  uac: z.string().optional(),
  reviewer: z.string().optional(),
});

export const reviewerApprovalSchema = z.object({
  id: z.string(),
  approvalStatus: z.enum(['approved', 'rejected']),
  reviewer: z.string().min(1, 'Reviewer required'),
});
