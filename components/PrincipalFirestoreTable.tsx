'use client';

import {
  DataTable,
  DataTableColumnDef,
  DataTableRowActions,
} from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { reviewerApprovalAction, editorUpdateUacAction } from '@/app/admin/actions';
import type { PrincipalDoc } from '@/types';

type Props = {
  data: PrincipalDoc[];
};

function ApprovalStatusBadge({ status }: { status?: string }) {
  if (status === 'approved')
    return <Badge variant="success">Approved</Badge>;
  if (status === 'pending')
    return <Badge variant="secondary">Pending</Badge>;
  if (status === 'rejected')
    return <Badge variant="destructive">Rejected</Badge>;
  return <Badge variant="outline">–</Badge>;
}

export function PrincipalFirestoreTable({ data }: Props) {
  const user = useUser();
  const [approvalState, approvalAction] = useActionState(
    reviewerApprovalAction,
    { success: false }
  );
  const [uacState, uacAction] = useActionState(editorUpdateUacAction, {
    success: false,
  });

  // Editable UAC cell
  function UacCell({ row }: { row: PrincipalDoc }) {
    const [editing, setEditing] = React.useState(false);
    const [uac, setUac] = React.useState(row.uac ?? '');

    if (user?.role !== 'editor') return row.uac || <span className="text-gray-400">–</span>;
    if (!editing)
      return (
        <span
          className="underline cursor-pointer"
          onClick={() => setEditing(true)}
        >
          {row.uac || <span className="text-gray-400">–</span>}
        </span>
      );
    return (
      <form
        action={uacAction}
        onSubmit={() => setEditing(false)}
        className="flex items-center gap-2"
      >
        <input type="hidden" name="id" value={row.id} />
        <input
          name="uac"
          value={uac}
          onChange={e => setUac(e.target.value)}
          className="input"
        />
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </form>
    );
  }

  // Reviewer approve/reject buttons
  function ReviewerActions({ row }: { row: PrincipalDoc }) {
    if (user?.role !== 'reviewer' || row.approvalStatus !== 'pending') return null;
    return (
      <div className="flex gap-2">
        <form action={approvalAction}>
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="approvalStatus" value="approved" />
          <input type="hidden" name="reviewer" value={user.displayName} />
          <Button size="sm" variant="success" type="submit">
            Approve
          </Button>
        </form>
        <form action={approvalAction}>
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="approvalStatus" value="rejected" />
          <input type="hidden" name="reviewer" value={user.displayName} />
          <Button size="sm" variant="destructive" type="submit">
            Reject
          </Button>
        </form>
      </div>
    );
  }

  const columns: DataTableColumnDef<PrincipalDoc>[] = [
    { accessorKey: 'principal', header: 'Principal' },
    { accessorKey: 'pType', header: 'Type' },
    { accessorKey: 'resource', header: 'Resource' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'givenClassification', header: 'Given Classification' },
    { accessorKey: 'requestedClassification', header: 'Requested Classification' },
    {
      accessorKey: 'approvalStatus',
      header: 'Approval',
      cell: ({ row }) => <ApprovalStatusBadge status={row.original.approvalStatus} />,
    },
    {
      accessorKey: 'requestDate',
      header: 'Requested',
      cell: ({ row }) =>
        row.original.requestDate
          ? new Date(row.original.requestDate).toLocaleString()
          : <span className="text-gray-400">–</span>,
    },
    {
      accessorKey: 'uac',
      header: 'UAC',
      cell: ({ row }) => <UacCell row={row.original} />,
    },
    {
      accessorKey: 'reviewer',
      header: 'Reviewer',
      cell: ({ row }) => row.original.reviewer || <span className="text-gray-400">–</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => <ReviewerActions row={row.original} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      className="w-full rounded-xl border"
      // Optional: add row highlighting or custom rowProps for "not in principal table" logic
    />
  );
}
