 'use client';

import * as React from 'react';
import { DataTable, DataTableColumnDef } from '@/components/ui/data-table';
import { Principal, PrincipalDoc } from '@/types';

type Props = {
  data: Principal[];
  alreadyAdded: PrincipalDoc[];
  onSelect: (p: Principal) => void;
  regexMatches?: boolean[] | null;
};

function samePrincipal(a: Principal, b: Principal) {
  return (
    a.principal === b.principal &&
    a.resource === b.resource &&
    a.role === b.role
  );
}

export function PrincipalTable({
  data,
  alreadyAdded,
  onSelect,
  regexMatches,
}: Props) {
  // Add row highlighting via rowProps
  const rowProps = (row: Principal, idx: number) => {
    // Dark green for regex match, else light green if already added
    const regexHit = regexMatches?.[idx];
    const isAdded = alreadyAdded.some((pr) => samePrincipal(pr, row));
    if (regexHit)
      return {
        className: 'bg-green-900 text-white cursor-pointer',
      };
    if (isAdded)
      return {
        className: 'bg-green-200 cursor-pointer',
      };
    return { className: 'cursor-pointer' };
  };

  const columns: DataTableColumnDef<Principal>[] = [
    {
      accessorKey: 'principal',
      header: 'Principal',
      cell: ({ row }) => row.original.principal,
    },
    {
      accessorKey: 'pType',
      header: 'Type',
      cell: ({ row }) => row.original.pType,
    },
    {
      accessorKey: 'resource',
      header: 'Resource',
      cell: ({ row }) => row.original.resource,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => row.original.role,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowProps={rowProps}
      onRowClick={(row, idx) => onSelect(row)}
    />
  );
}
