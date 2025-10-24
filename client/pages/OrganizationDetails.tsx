import { Layout } from "@/components/Layout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatusBadge } from "@/components/StatusBadge";
import { RoleBadge } from "@/components/RoleBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Phone, Globe, Pencil, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { organizationsApi, usersApi, type Organization, type User } from "@/lib/api";
import { useNotifications } from "@/hooks/use-notifications";

export default function OrganizationDetails() {
  const notifications = useNotifications();
  const { id } = useParams();
  const orgId = Number(id || 0);
  
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "users">("details");
  const [users, setUsers] = useState<User[]>([]);

  // confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: number | null;
    userName: string;
  }>({ open: false, userId: null, userName: "" });

  // basic details state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    slug: '',
    primaryAdmin: '',
    primaryAdminMail: '',
    supportEmail: '',
    phoneNo: '',
    altPhone: '',
    maxCoordinators: 'Upto 5 Coordinators',
    timezone: 'India Standard Time',
    region: 'Asia/Colombo',
    language: 'English',
    websiteUrl: '',
  });

  // add user modal
  const [showAddUser, setShowAddUser] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", role: "coordinator" as 'admin' | 'coordinator' });

  // Load organization data
  useEffect(() => {
    loadOrganization();
  }, [orgId]);

  // Update state when org changes
  useEffect(() => {
    if (org) {
      setUsers(org.users);
      setState({
        name: org.name,
        email: org.email,
        phone: org.phone || '',
        website: org.website || '',
        slug: org.slug,
        primaryAdmin: org.users[0]?.name || '',
        primaryAdminMail: org.users[0] ? `${org.users[0].name.replace(/\s+/g, '.').toLowerCase()}@example.com` : '',
        supportEmail: org.email,
        phoneNo: org.phone || '',
        altPhone: org.phone || '',
        maxCoordinators: 'Upto 5 Coordinators',
        timezone: 'India Standard Time',
        region: 'Asia/Colombo',
        language: 'English',
        websiteUrl: org.website || '',
      });
    }
  }, [org]);

  async function loadOrganization() {
    try {
      setLoading(true);
      setError(null);
      const data = await organizationsApi.getById(orgId);
      setOrg(data);
    } catch (err: any) {
      console.error("Error fetching organization:", err);
      setError(err.message || "Failed to load organization");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!org) return;

    try {
      setSaving(true);
      await organizationsApi.update(org.id, {
        name: state.name,
        slug: state.slug,
        email: state.email,
        phone: state.phoneNo,
        website: state.websiteUrl,
      });
      
      await loadOrganization();
      setEditing(false);
      notifications.info("Organization updated successfully");
    } catch (err: any) {
      console.error("Error updating organization:", err);
      notifications.error(err.message || "Failed to update organization");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddUser() {
    if (!newUser.name.trim() || !org) {
      notifications.error("User name is required");
      return;
    }

    try {
      setSubmittingUser(true);
      await usersApi.create(org.id, {
        name: newUser.name.trim(),
        role: newUser.role,
      });
      
      await loadOrganization();
      setNewUser({ name: "", role: "coordinator" });
      setShowAddUser(false);
      setActiveTab('users');
      notifications.userAdded(newUser.name.trim());
    } catch (err: any) {
      console.error("Error creating user:", err);
      notifications.error(err.message || "Failed to add user");
    } finally {
      setSubmittingUser(false);
    }
  }

  function handleDeleteUser(id: number, name: string) {
    setConfirmDialog({ open: true, userId: id, userName: name });
  }

  async function handleConfirmDeleteUser() {
    if (confirmDialog.userId !== null) {
      try {
        await usersApi.delete(confirmDialog.userId);
        await loadOrganization();
        notifications.userDeleted(confirmDialog.userName);
        setConfirmDialog({ open: false, userId: null, userName: "" });
      } catch (err: any) {
        console.error("Error deleting user:", err);
        notifications.error(err.message || "Failed to delete user");
      }
    }
  }

  function handleCancelDeleteUser() {
    setConfirmDialog({ open: false, userId: null, userName: "" });
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !org) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-start gap-6 px-4 sm:px-6 md:px-[70px] py-6">
        <Breadcrumb items={[{ label: "Manage B2B organizations", path: "/" }, { label: "Organization details" }]} />

        <div className="flex flex-col md:flex-row px-5 py-5 items-start gap-6 w-full max-w-[1140px] rounded-md bg-white shadow-[0_2px_12px_0_rgba(54,89,226,0.12)]">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden bg-gray-100">
            <img src={org.avatar || ''} alt={org.name} className="w-full h-full object-cover" />
            <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-8 h-8 p-2 justify-center items-center gap-1 rounded-md bg-brand-50 hover:bg-brand-50/80 transition-colors">
              <Pencil className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>

          <div className="flex flex-col items-start gap-3 flex-1">
            <h1 className="text-[22px] font-semibold leading-8 text-text-primary">{org.name}</h1>

            <div className="flex flex-col gap-0">
              <div className="flex items-center gap-1">
                <Mail className="w-5 h-5 text-[#97A1B2]" />
                <span className="text-sm font-normal leading-5 text-text-secondary">{org.email}</span>
              </div>

              {org.phone && (
                <div className="flex items-start gap-1">
                  <Phone className="w-5 h-5 text-[#97A1B2]" />
                  <span className="text-sm font-normal leading-5 text-text-secondary">{org.phone}</span>
                </div>
              )}

              {org.website && (
                <div className="flex items-start gap-1">
                  <Globe className="w-5 h-5 text-[#97A1B2]" />
                  <span className="text-sm font-normal leading-5 text-primary">{org.website}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <StatusBadge status={org.status} />
            <button className="px-3 text-xs font-normal leading-5 text-primary hover:underline">Change status</button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 w-full max-w-[1140px]">
          <div className="flex items-start gap-3">
            <button onClick={() => setActiveTab("details")} className={cn("flex px-4 py-1.5 justify-center items-center gap-2.5 rounded-md text-sm leading-5", activeTab === "details" ? "bg-brand-50 text-primary font-bold" : "bg-gray-50 text-text-secondary font-normal")}>Basic details</button>
            <button onClick={() => setActiveTab("users")} className={cn("flex px-4 py-1.5 justify-center items-center gap-2.5 rounded-md text-sm leading-5", activeTab === "users" ? "bg-brand-50 text-primary font-bold" : "bg-gray-50 text-text-secondary font-normal")}>Users</button>
          </div>

          {activeTab === "details" && (
            <div className="flex flex-col items-start w-full border border-gray-100 rounded-md p-4">
              <div className="flex justify-between items-center w-full mb-4">
                <h2 className="text-base font-semibold leading-6 text-text-primary">Profile</h2>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 p-2 rounded-md bg-brand-50" onClick={() => setEditing((e) => !e)}>
                    <Pencil className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>

              <div className="w-full">
                <div className="text-sm font-semibold mb-2">Organization details</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-secondary">Organization name</label>
                    <input value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary">Organization SLUG</label>
                    <input value={state.slug} onChange={(e) => setState({ ...state, slug: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                  </div>

                  <div>
                    <label className="text-xs text-text-secondary">Primary Admin name</label>
                    <input value={state.primaryAdmin} onChange={(e) => setState({ ...state, primaryAdmin: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary">Primary Admin Mail-id</label>
                    <input value={state.primaryAdminMail} onChange={(e) => setState({ ...state, primaryAdminMail: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                  </div>

                  <div>
                    <label className="text-xs text-text-secondary">Support Email ID</label>
                    <input value={state.supportEmail} onChange={(e) => setState({ ...state, supportEmail: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                  </div>

                  <div>
                    <label className="text-xs text-text-secondary">Phone no</label>
                    <input value={state.phoneNo} onChange={(e) => setState({ ...state, phoneNo: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                  </div>

                  <div>
                    <label className="text-xs text-text-secondary">Alternative phone no</label>
                    <input value={state.altPhone} onChange={(e) => setState({ ...state, altPhone: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-semibold mb-2">Maximum Allowed Coordinators</div>
                  <div>
                    <label className="text-xs text-text-secondary">Max active Coordinators allowed</label>
                    <input value={state.maxCoordinators} onChange={(e) => setState({ ...state, maxCoordinators: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-semibold mb-2">Timezone</div>
                    <label className="text-xs text-text-secondary">Common name</label>
                    <input value={state.timezone} onChange={(e) => setState({ ...state, timezone: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary">Region</label>
                    <input value={state.region} onChange={(e) => setState({ ...state, region: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-semibold mb-2">Language</div>
                  <label className="text-xs text-text-secondary">Choose the language for organization</label>
                  <input value={state.language} onChange={(e) => setState({ ...state, language: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                </div>

                <div className="mt-6">
                  <div className="text-sm font-semibold mb-2">Official website URL</div>
                  <label className="text-xs text-text-secondary">website URL</label>
                  <input value={state.websiteUrl} onChange={(e) => setState({ ...state, websiteUrl: e.target.value })} disabled={!editing} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:bg-gray-50" />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button className="px-4 py-2 rounded-md bg-gray-100 text-sm" onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
                  <button className="px-4 py-2 rounded-md bg-primary text-white text-sm flex items-center gap-2" onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="flex flex-col items-start w-full border border-gray-100 rounded-md">
              <div className="flex px-5 py-3 justify-between items-center w-full">
                <h2 className="text-base font-semibold leading-6 text-text-primary">Users</h2>
                <Button size="sm" onClick={() => setShowAddUser(true)} className="h-8 px-4 gap-1 rounded-md bg-primary hover:bg-primary/90 text-white text-xs">
                  <Plus className="w-3 h-3" />
                  Add user
                </Button>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="min-w-[700px]">
                  <div className="flex items-start w-full bg-gray-50">
                  <div className="flex w-20 h-11 px-3 items-center gap-2">
                    <span className="flex-1 text-center text-xs font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">Sr. No</span>
                  </div>
                  <div className="flex w-[400px] h-11 px-3 items-center gap-2">
                    <span className="flex-1 text-xs font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">User name</span>
                  </div>
                  <div className="flex flex-1 h-11 px-3 items-center gap-2">
                    <span className="flex-1 text-xs font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">Role</span>
                  </div>
                  <div className="flex w-[120px] h-11 px-3 items-center gap-2">
                    <span className="flex-1 text-xs font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">Action</span>
                  </div>
                </div>

                {users.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-text-secondary">No users yet. Add one to get started!</p>
                  </div>
                ) : (
                  users.map((user, idx) => (
                    <div key={user.id} className="flex items-start w-full border-b border-gray-50 bg-white">
                      <div className="flex w-20 h-[60px] pl-3 justify-center items-center gap-2.5">
                        <span className="flex-1 text-center text-sm font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">{idx + 1}</span>
                      </div>
                      <div className="flex w-[400px] h-[60px] pl-3 items-center gap-2.5">
                        <span className="text-sm font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">{user.name}</span>
                      </div>
                      <div className="flex flex-1 h-[60px] pl-3 items-center gap-2.5">
                        <RoleBadge role={user.role} />
                      </div>
                      <div className="flex w-[120px] pl-3 items-center gap-2.5 h-[60px]">
                        <button className="flex w-[18px] h-[18px] p-0.5 justify-center items-center gap-2.5 text-[#97A1B2] hover:text-primary transition-colors">
                          <Pencil className="w-full h-full" strokeWidth={1.25} />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id, user.name)} className="flex w-4 h-4 p-0.5 justify-center items-center text-[#97A1B2] hover:text-error-500 transition-colors">
                          <Trash2 className="w-full h-full" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            </div>
          )}
        </div>

        {showAddUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => !submittingUser && setShowAddUser(false)} />
            <div className="relative w-full max-w-md bg-white rounded-md shadow-lg p-6 mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add User</h3>
                <button className="text-sm text-text-secondary" onClick={() => !submittingUser && setShowAddUser(false)} disabled={submittingUser}>Close</button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm text-text-secondary">Name of the user *</label>
                  <input value={newUser.name} onChange={(e) => setNewUser((s) => ({ ...s, name: e.target.value }))} disabled={submittingUser} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:opacity-50" />
                </div>
                <div>
                  <label className="text-sm text-text-secondary">Choose user role</label>
                  <select value={newUser.role} onChange={(e) => setNewUser((s) => ({ ...s, role: e.target.value as 'admin' | 'coordinator' }))} disabled={submittingUser} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:opacity-50">
                    <option value="admin">Admin</option>
                    <option value="coordinator">Co-ordinator</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 rounded-md bg-gray-100 text-sm" onClick={() => setShowAddUser(false)} disabled={submittingUser}>Cancel</button>
                <button className="px-4 py-2 rounded-md bg-primary text-white text-sm flex items-center gap-2" onClick={handleAddUser} disabled={submittingUser}>
                  {submittingUser && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={confirmDialog.open}
          title="Delete User"
          description={`Are you sure you want to delete "${confirmDialog.userName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDeleteUser}
          onCancel={handleCancelDeleteUser}
          isDangerous={true}
        />
      </div>
    </Layout>
  );
}
