export type ApprovalStatus = 'approved' | 'pending' | 'rejected';
export type PType = 'group' | 'service account' | 'generic principal' | 'local db account';

export type Principal = {
  principal: string;
  resource: string;
  role: string;
  pType: PType;
  approvalStatus?: ApprovalStatus;
  requestDate?: string;
  reviewer?: string;
  uac?: string; // user access control, editable by editors
};

export type PrincipalDoc = Principal & {
  id: string;
  givenClassification: string;
  requestedClassification: string;
  overrideReason: string;
  requestStatus: 'approved' | 'rejected' | 'pending review';
};

export type RoleClassification = { role: string; classification: string };
export type UserRole = 'viewer' | 'editor' | 'reviewer';
export type User = {
  email: string;
  displayName: string;
  role: UserRole;
};
