import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { Eye, MoreVertical, Pencil, Shield, Key, Trash2 } from 'lucide-react';
import type { UserPublic, OrganizerRole } from '@ems/shared';
import { useAuth } from '../context/AuthContext';
import {
  listTeamMembers,
  getOrganization,
  createTeamMember,
  updateTeamMember,
  resetTeamMemberPassword,
  deleteTeamMember,
  addCustomRole,
  deleteCustomRole,
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
  OrganizationInfo,
} from '../services/team';

type SortKey = 'name' | 'email' | 'role' | 'status' | 'created';
type SortDir = 'asc' | 'desc';

const emptyCreate: CreateTeamMemberInput = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  organizerRole: 'member',
  phone: '',
  customRoleLabel: '',
};

export default function TeamPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<UserPublic[]>([]);
  const [org, setOrg] = useState<OrganizationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form
  const [createForm, setCreateForm] = useState<CreateTeamMemberInput>(emptyCreate);
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRoleLabel, setNewRoleLabel] = useState('');
  const [addingRole, setAddingRole] = useState(false);

  // Modals
  type ModalMode = null | 'view' | 'edit' | 'auth' | 'password';
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<UserPublic | null>(null);
  const [editForm, setEditForm] = useState<UpdateTeamMemberInput>({});
  const [passwordValue, setPasswordValue] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Sorting
  const [sortKey, setSortKey] = useState<SortKey>('created');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const isAdmin = user?.userType === 'organizer' && user?.organizerRole === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchAll();
    }
  }, [isAdmin]);

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [membersData, orgData] = await Promise.all([listTeamMembers(), getOrganization()]);
      setMembers(membersData);
      setOrg(orgData);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to load team data';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.userType !== 'organizer') {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container-custom py-24">
        <div className="card p-10 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-display-sm text-surface-900 mb-2">You don't have permission</h1>
          <p className="text-surface-600">
            Only organization admins can manage team members. Ask your admin for access.
          </p>
        </div>
      </div>
    );
  }

  // ----- Custom roles -----
  const handleAddRole = async () => {
    const trimmed = newRoleLabel.trim();
    if (!trimmed) {
      toast.error('Enter a role name');
      return;
    }
    setAddingRole(true);
    try {
      const next = await addCustomRole(trimmed);
      setOrg((prev) => (prev ? { ...prev, customRoles: next } : prev));
      setNewRoleLabel('');
      toast.success(`Role "${trimmed}" added`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to add role');
    } finally {
      setAddingRole(false);
    }
  };

  const handleDeleteRole = async (label: string) => {
    if (!window.confirm(`Delete the "${label}" role? Users with this label will be cleared.`)) return;
    try {
      const next = await deleteCustomRole(label);
      setOrg((prev) => (prev ? { ...prev, customRoles: next } : prev));
      await fetchAll();
      toast.success(`Role "${label}" deleted`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to delete role');
    }
  };

  // ----- Create user -----
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createTeamMember(createForm);
      toast.success('User created');
      setCreateForm(emptyCreate);
      setShowPassword(false);
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  // ----- Row actions -----
  const openView = (member: UserPublic) => {
    setSelected(member);
    setModalMode('view');
  };
  const openEdit = (member: UserPublic) => {
    setSelected(member);
    setEditForm({
      firstName: member.firstName,
      lastName: member.lastName,
      phone: member.phone,
      organizerRole: (member.organizerRole ?? 'member') as OrganizerRole,
      customRoleLabel: member.customRoleLabel ?? '',
    });
    setModalMode('edit');
  };
  const openAuth = (member: UserPublic) => {
    setSelected(member);
    setModalMode('auth');
  };
  const openPassword = (member: UserPublic) => {
    setSelected(member);
    setPasswordValue('');
    setModalMode('password');
  };
  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setModalSubmitting(true);
    try {
      await updateTeamMember(selected._id, editForm);
      toast.success('User updated');
      closeModal();
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update user');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleAuthToggle = async () => {
    if (!selected) return;
    setModalSubmitting(true);
    try {
      await updateTeamMember(selected._id, { isActive: !(selected.isActive ?? true) });
      toast.success(selected.isActive ? 'User deactivated' : 'User activated');
      closeModal();
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update status');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (passwordValue.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setModalSubmitting(true);
    try {
      await resetTeamMemberPassword(selected._id, passwordValue);
      toast.success('Password reset');
      closeModal();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to reset password');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDelete = async (member: UserPublic) => {
    if (!window.confirm(`Permanently remove ${member.firstName} ${member.lastName}?`)) return;
    try {
      await deleteTeamMember(member._id);
      toast.success('User removed');
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to remove user');
    }
  };

  // ----- Sorting -----
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    const getVal = (m: UserPublic): string | number => {
      switch (sortKey) {
        case 'name': return `${m.firstName} ${m.lastName}`.toLowerCase();
        case 'email': return m.email.toLowerCase();
        case 'role': return (m.customRoleLabel || m.organizerRole || '').toLowerCase();
        case 'status': return m.isActive === false ? 0 : 1;
        case 'created': return new Date(m.createdAt as any).getTime();
      }
    };
    const av = getVal(a);
    const bv = getVal(b);
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  const isOwner = (member: UserPublic) => org?.ownerId === member._id;

  return (
    <div className="container-custom py-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-sm text-surface-900">User Management</h1>
        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-surface-600">
          <span>
            Current active role:{' '}
            <span className="font-semibold text-primary-700 capitalize">
              {user?.organizerRole ?? 'member'}
            </span>
          </span>
          <span className="text-surface-300">•</span>
          <span>
            Organization: <span className="font-semibold text-surface-900">{org?.name ?? '—'}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-6 items-start">
        {/* Left: Add User card */}
        <div className="card p-6 h-fit lg:sticky lg:top-6 lg:self-start">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Add User</h2>

          {/* Custom role creator */}
          <div className="mb-5 pb-5 border-b border-surface-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Create new role e.g. Coordinator"
                className="input flex-1"
                value={newRoleLabel}
                onChange={(e) => setNewRoleLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRole();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddRole}
                disabled={addingRole || !newRoleLabel.trim()}
                className="btn-primary whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                Add Role
              </button>
            </div>

            {(org?.customRoles?.length ?? 0) > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">
                  Custom Roles
                </p>
                <div className="flex flex-wrap gap-2">
                  {org!.customRoles.map((label) => (
                    <div
                      key={label}
                      className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 rounded-full pl-3 pr-1 py-1 text-sm"
                    >
                      <span>{label}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteRole(label)}
                        className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-primary-100 text-primary-700"
                        aria-label={`Delete ${label} role`}
                        title={`Delete ${label}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Create user form */}
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name">
                <input
                  required
                  className="input"
                  value={createForm.firstName}
                  onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                />
              </Field>
              <Field label="Last name">
                <input
                  required
                  className="input"
                  value={createForm.lastName}
                  onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Username (email)">
              <input
                required
                type="email"
                className="input"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              />
            </Field>
            <Field label="Password">
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  minLength={8}
                  className="input pr-10"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </Field>
            <Field label="Phone (optional)">
              <input
                className="input"
                value={createForm.phone ?? ''}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
              />
            </Field>
            <Field label="Role">
              <select
                className="input"
                value={
                  createForm.customRoleLabel
                    ? `custom:${createForm.customRoleLabel}`
                    : createForm.organizerRole
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (v.startsWith('custom:')) {
                    setCreateForm({
                      ...createForm,
                      organizerRole: 'member',
                      customRoleLabel: v.slice(7),
                    });
                  } else {
                    setCreateForm({
                      ...createForm,
                      organizerRole: v as OrganizerRole,
                      customRoleLabel: '',
                    });
                  }
                }}
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                {org?.customRoles.map((label) => (
                  <option key={label} value={`custom:${label}`}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <button
              type="submit"
              disabled={creating}
              className="btn-primary w-full mt-2 disabled:opacity-60"
            >
              {creating ? 'Creating…' : 'Create User'}
            </button>
          </form>
        </div>

        {/* Right: Existing Users table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-5 border-b border-surface-100">
            <h2 className="text-lg font-semibold text-surface-900">Existing Users</h2>
            <p className="text-sm text-surface-500 mt-0.5">
              {members.length} {members.length === 1 ? 'user' : 'users'} in {org?.name ?? 'your team'}
            </p>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="p-10 text-center">
              <p className="text-red-600 mb-3">{error}</p>
              <button onClick={fetchAll} className="btn-ghost text-sm">
                Retry
              </button>
            </div>
          ) : members.length === 0 ? (
            <div className="p-12 text-center text-surface-500">
              <p>No users yet. Add your first team member from the left.</p>
            </div>
          ) : (
            <table className="table-fixed w-full">
              <colgroup>
                <col className="w-[30%]" />
                <col className="w-[34%]" />
                <col className="w-[14%]" />
                <col className="hidden xl:table-column w-[10%]" />
                <col className="w-[14%]" />
                <col className="w-20" />
              </colgroup>
              <thead className="bg-surface-50 border-b border-surface-100">
                <tr className="text-left text-xs font-semibold uppercase text-surface-500 tracking-wider">
                  <SortHeader label="Name" active={sortKey === 'name'} dir={sortDir} onClick={() => toggleSort('name')} />
                  <SortHeader label="Email" active={sortKey === 'email'} dir={sortDir} onClick={() => toggleSort('email')} />
                  <SortHeader label="Role" active={sortKey === 'role'} dir={sortDir} onClick={() => toggleSort('role')} />
                  <SortHeader
                    label="Status"
                    active={sortKey === 'status'}
                    dir={sortDir}
                    onClick={() => toggleSort('status')}
                    className="hidden xl:table-cell"
                  />
                  <SortHeader label="Created" active={sortKey === 'created'} dir={sortDir} onClick={() => toggleSort('created')} />
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {sortedMembers.map((member) => {
                  const owner = isOwner(member);
                  const roleLabel = member.customRoleLabel || member.organizerRole || 'member';
                  const fullName = `${member.firstName} ${member.lastName}`;
                  const createdDate = new Date(member.createdAt as any);
                  const fullDate = createdDate.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                  return (
                    <tr key={member._id} className="hover:bg-surface-50">
                      <td className="px-4 py-3 min-w-0">
                        <div
                          className="font-medium text-surface-900 flex items-center gap-2 min-w-0"
                          title={fullName}
                        >
                          <span className="truncate">{fullName}</span>
                          {owner && (
                            <span title="Organization owner" className="text-amber-500 flex-shrink-0">♛</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-surface-600 min-w-0">
                        <div className="truncate" title={member.email}>{member.email}</div>
                      </td>
                      <td className="px-4 py-3 min-w-0">
                        <span
                          className={`inline-flex max-w-full truncate px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            member.customRoleLabel
                              ? 'bg-violet-100 text-violet-700'
                              : member.organizerRole === 'admin'
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-surface-100 text-surface-700'
                          }`}
                          title={roleLabel}
                        >
                          {roleLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            member.isActive === false
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {member.isActive === false ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-surface-600 text-sm whitespace-nowrap">
                        {fullDate}
                      </td>
                      <td className="px-3 py-3 w-20">
                        <div className="flex justify-end gap-1 flex-nowrap">
                          <IconButton label="View" onClick={() => openView(member)} icon="eye" />
                          <RowActionsMenu
                            isOwner={owner}
                            onView={() => openView(member)}
                            onEdit={() => openEdit(member)}
                            onAuth={() => openAuth(member)}
                            onPassword={() => openPassword(member)}
                            onDelete={() => handleDelete(member)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      {modalMode === 'view' && selected && (
        <Modal title="User Details" onClose={closeModal}>
          <div className="space-y-3 text-sm">
            <DetailRow label="Name" value={`${selected.firstName} ${selected.lastName}`} />
            <DetailRow label="Email" value={selected.email} />
            <DetailRow label="Phone" value={selected.phone || '—'} />
            <DetailRow
              label="Role"
              value={selected.customRoleLabel || selected.organizerRole || 'member'}
            />
            <DetailRow label="Status" value={selected.isActive === false ? 'Inactive' : 'Active'} />
            <DetailRow label="Created" value={new Date(selected.createdAt as any).toLocaleString()} />
            <DetailRow label="Updated" value={new Date(selected.updatedAt as any).toLocaleString()} />
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" onClick={closeModal} className="btn-ghost">Close</button>
          </div>
        </Modal>
      )}

      {modalMode === 'edit' && selected && (
        <Modal title={`Edit ${selected.firstName} ${selected.lastName}`} onClose={closeModal}>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name">
                <input
                  className="input"
                  value={editForm.firstName ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                />
              </Field>
              <Field label="Last name">
                <input
                  className="input"
                  value={editForm.lastName ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Phone">
              <input
                className="input"
                value={editForm.phone ?? ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </Field>
            <Field label="Role">
              <select
                className="input"
                value={
                  editForm.customRoleLabel
                    ? `custom:${editForm.customRoleLabel}`
                    : editForm.organizerRole ?? 'member'
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (v.startsWith('custom:')) {
                    setEditForm({
                      ...editForm,
                      organizerRole: 'member',
                      customRoleLabel: v.slice(7),
                    });
                  } else {
                    setEditForm({
                      ...editForm,
                      organizerRole: v as OrganizerRole,
                      customRoleLabel: '',
                    });
                  }
                }}
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                {org?.customRoles.map((label) => (
                  <option key={label} value={`custom:${label}`}>{label}</option>
                ))}
              </select>
            </Field>
            <ModalActions onCancel={closeModal} submitting={modalSubmitting} label="Save changes" />
          </form>
        </Modal>
      )}

      {modalMode === 'auth' && selected && (
        <Modal title={`Authorisation — ${selected.firstName}`} onClose={closeModal}>
          <p className="text-surface-600 mb-5">
            This user is currently{' '}
            <span className={`font-semibold ${selected.isActive === false ? 'text-red-600' : 'text-green-600'}`}>
              {selected.isActive === false ? 'Inactive' : 'Active'}
            </span>
            .{' '}
            {selected.isActive === false
              ? 'Activating will allow them to log in again.'
              : 'Deactivating will block login immediately.'}
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="btn-ghost">Cancel</button>
            <button
              type="button"
              onClick={handleAuthToggle}
              disabled={modalSubmitting}
              className={`btn-primary disabled:opacity-60 ${selected.isActive === false ? '' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {modalSubmitting
                ? 'Working…'
                : selected.isActive === false
                ? 'Activate user'
                : 'Deactivate user'}
            </button>
          </div>
        </Modal>
      )}

      {modalMode === 'password' && selected && (
        <Modal title={`Reset Password — ${selected.firstName}`} onClose={closeModal}>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <Field label="New password (min 8 characters)">
              <input
                required
                type="password"
                minLength={8}
                className="input"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
            </Field>
            <ModalActions onCancel={closeModal} submitting={modalSubmitting} label="Reset password" />
          </form>
        </Modal>
      )}
    </div>
  );
}

// ---------- Small presentational helpers ----------

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-surface-700 mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-surface-100 pb-2 last:border-0">
      <span className="text-surface-500">{label}</span>
      <span className="text-surface-900 font-medium text-right">{value}</span>
    </div>
  );
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
  className = '',
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 cursor-pointer select-none hover:text-surface-800 ${className}`}
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active && <span className="text-surface-400">{dir === 'asc' ? '▲' : '▼'}</span>}
      </span>
    </th>
  );
}

function IconButton({
  label,
  onClick,
  icon,
  danger = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  icon: 'eye' | 'edit' | 'shield' | 'key' | 'trash';
  danger?: boolean;
  disabled?: boolean;
}) {
  const paths: Record<string, React.ReactNode> = {
    eye: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </>
    ),
    edit: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    ),
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    key: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    ),
    trash: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    ),
  };
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      disabled={disabled}
      className={`p-1.5 rounded hover:bg-surface-100 transition-colors ${
        danger ? 'text-red-600 hover:bg-red-50' : 'text-surface-600'
      } ${disabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {paths[icon]}
      </svg>
    </button>
  );
}

interface RowActionsMenuProps {
  isOwner: boolean;
  onView: () => void;
  onEdit: () => void;
  onAuth: () => void;
  onPassword: () => void;
  onDelete: () => void;
}

interface MenuPosition {
  top: number;
  right: number;
}

function RowActionsMenu({
  isOwner,
  onView,
  onEdit,
  onAuth,
  onPassword,
  onDelete,
}: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
    setOpen(true);
  };

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      closeMenu();
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    const handleScrollOrResize = () => closeMenu();

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    // capture=true so we catch scrolls on any ancestor (e.g. the table wrapper)
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [open]);

  const select = (fn: () => void) => () => {
    closeMenu();
    fn();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? closeMenu() : openMenu())}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        className="p-1.5 rounded hover:bg-surface-100 text-surface-600 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: 'fixed',
              top: position.top,
              right: position.right,
              zIndex: 50,
            }}
            className="w-44 rounded-lg shadow-lg bg-white border border-surface-200 py-1 overflow-hidden"
          >
            {isOwner ? (
              <>
                <MenuItem
                  icon={<Eye className="w-4 h-4" />}
                  label="View"
                  onClick={select(onView)}
                />
                <MenuItem
                  icon={<Key className="w-4 h-4" />}
                  label="Reset Password"
                  onClick={select(onPassword)}
                />
              </>
            ) : (
              <>
                <MenuItem
                  icon={<Pencil className="w-4 h-4" />}
                  label="Edit"
                  onClick={select(onEdit)}
                />
                <MenuItem
                  icon={<Shield className="w-4 h-4" />}
                  label="Authorisation"
                  onClick={select(onAuth)}
                />
                <MenuItem
                  icon={<Key className="w-4 h-4" />}
                  label="Reset Password"
                  onClick={select(onPassword)}
                />
                <MenuItem
                  icon={<Trash2 className="w-4 h-4" />}
                  label="Delete"
                  onClick={select(onDelete)}
                  danger
                />
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, onClick, danger }: MenuItemProps) {
  const base = 'flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors';
  const state = danger
    ? 'text-red-600 hover:bg-red-50 border-t border-surface-100'
    : 'text-surface-700 hover:bg-surface-50';
  return (
    <button type="button" role="menuitem" onClick={onClick} className={`${base} ${state}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function TableSkeleton() {
  return (
    <div className="p-6 space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-12 bg-surface-100 rounded animate-pulse" />
      ))}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl font-semibold text-surface-900">{title}</h2>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-600" type="button" aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({
  onCancel,
  submitting,
  label,
}: {
  onCancel: () => void;
  submitting: boolean;
  label: string;
}) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
        {submitting ? 'Saving…' : label}
      </button>
    </div>
  );
}
