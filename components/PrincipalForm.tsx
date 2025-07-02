'use client';

import { useActionState } from 'react';
import { Form, FormField, FormLabel, FormInput, FormRadioGroup, FormButton } from '@/components/ui/form';
import { useRoleClassifications } from '@/contexts/RoleClassificationContext';
import { addPrincipalServerAction } from '@/app/admin/actions';
import { Principal, PType } from '@/types';

const PTYPE_OPTIONS: { value: PType; label: string }[] = [
  { value: 'group', label: 'Group' },
  { value: 'service account', label: 'Service Account' },
  { value: 'generic principal', label: 'Generic Principal' },
  { value: 'local db account', label: 'Local DB Account' },
];

export function PrincipalForm({
  initialValues,
  sourceData,
  onRegexTestResults,
}: {
  initialValues?: Principal | null;
  sourceData: Principal[];
  onRegexTestResults: (matches: boolean[]) => void;
}) {
  const roleClassifications = useRoleClassifications();
  const [fields, setFields] = React.useState<Principal>({
    principal: initialValues?.principal ?? '',
    resource: initialValues?.resource ?? '',
    role: initialValues?.role ?? '',
    pType: initialValues?.pType ?? 'generic principal',
  });
  const [override, setOverride] = React.useState(false);
  const [reason, setReason] = React.useState('');
  const [formState, formAction] = useActionState(addPrincipalServerAction, {});
  // Regex live test
  const handleTestGenericPrincipal = () => {
    let principalReg: RegExp | null = null;
    let resourceReg: RegExp | null = null;
    try {
      principalReg = new RegExp(fields.principal);
      resourceReg = new RegExp(fields.resource);
    } catch {
      onRegexTestResults(Array(sourceData.length).fill(false));
      return;
    }
    const matches = sourceData.map(
      row => principalReg!.test(row.principal) && resourceReg!.test(row.resource)
    );
    onRegexTestResults(matches);
  };

  const givenClassification =
    roleClassifications.find(rc => rc.role === fields.role)?.classification ?? '';
  const requestedClassification =
    override && givenClassification !== 'non privileged'
      ? 'non privileged'
      : givenClassification;
  const requestStatus =
    override && givenClassification !== 'non privileged'
      ? 'pending review'
      : 'approved';
  const approvalStatus =
    fields.pType === 'generic principal' ? 'pending' : 'approved';
  const requestDate =
    fields.pType === 'generic principal'
      ? new Date().toISOString()
      : undefined;

  return (
    <Form action={formAction} className="space-y-4">
      <FormRadioGroup
        name="pType"
        label="Principal Type"
        value={fields.pType}
        onValueChange={v =>
          setFields(f => ({ ...f, pType: v as PType }))
        }
        options={PTYPE_OPTIONS}
      />
      <FormField
        as={FormInput}
        name="principal"
        label={fields.pType === 'generic principal' ? 'Principal (RegExp)' : 'Principal'}
        value={fields.principal}
        onChange={e => setFields(f => ({ ...f, principal: e.target.value }))}
        required
      />
      <FormField
        as={FormInput}
        name="resource"
        label={fields.pType === 'generic principal' ? 'Resource (RegExp)' : 'Resource'}
        value={fields.resource}
        onChange={e => setFields(f => ({ ...f, resource: e.target.value }))}
        required
      />
      <FormField
        as={FormInput}
        name="role"
        label="Role"
        value={fields.role}
        onChange={e => setFields(f => ({ ...f, role: e.target.value }))}
        required
      />
      {/* Hidden fields for metadata */}
      <input type="hidden" name="givenClassification" value={givenClassification} />
      <input type="hidden" name="requestedClassification" value={requestedClassification} />
      <input type="hidden" name="requestStatus" value={requestStatus} />
      <input type="hidden" name="approvalStatus" value={approvalStatus} />
      {requestDate && <input type="hidden" name="requestDate" value={requestDate} />}

      <div className="flex items-center gap-2">
        <span className="font-semibold">Classification: </span>
        <span>
          {givenClassification || <span className="text-gray-400">unknown</span>}
        </span>
        {givenClassification && givenClassification !== 'non privileged' && (
          <FormField
            as="input"
            type="checkbox"
            checked={override}
            onChange={e => setOverride(e.target.checked)}
            label="Override as non privileged"
            className="ml-4"
          />
        )}
      </div>
      {override && (
        <FormField
          as={FormInput}
          name="overrideReason"
          label="Reason for override"
          value={reason}
          onChange={e => setReason(e.target.value)}
          required
        />
      )}
      {fields.pType === 'generic principal' && (
        <FormButton type="button" onClick={handleTestGenericPrincipal} variant="outline">
          Test Generic Principal
        </FormButton>
      )}
      <FormButton type="submit" variant="primary">
        Add
      </FormButton>
      {formState?.error && <div className="text-red-500">{formState.error}</div>}
      {formState?.success && <div className="text-green-500">Added!</div>}
    </Form>
  );
}
