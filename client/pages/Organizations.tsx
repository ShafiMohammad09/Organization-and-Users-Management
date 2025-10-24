import { Layout } from "@/components/Layout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus, Search, Eye, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { organizationsApi, type Organization } from "@/lib/api";
import { useNotifications } from "@/hooks/use-notifications";

export default function Organizations() {
  const notifications = useNotifications();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", email: "", contact: "" });

  // search state
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  // confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    orgId: number | null;
    orgName: string;
  }>({ open: false, orgId: null, orgName: "" });

  // Fetch organizations on mount
  useEffect(() => {
    loadOrganizations();
  }, []);

  async function loadOrganizations() {
    try {
      setLoading(true);
      setError(null);
      const data = await organizationsApi.getAll();
      setOrganizations(data);
    } catch (err: any) {
      console.error("Error fetching organizations:", err);
      setError(err.message || "Failed to load organizations");
      notifications.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  }

  const filteredOrganizations = organizations.filter((o) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.slug.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q)
    );
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleAddOrganization() {
    if (!form.name.trim() || !form.email.trim()) {
      notifications.error("Name and email are required");
      return;
    }

    try {
      setSubmitting(true);
      const slug = form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const avatar = `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(form.name)}`;
      
      const newOrg = await organizationsApi.create({
        name: form.name.trim(),
        slug,
        email: form.email.trim(),
        phone: form.contact.trim() || undefined,
        avatar,
      });

      setOrganizations((s) => [newOrg, ...s]);
      setForm({ name: "", slug: "", email: "", contact: "" });
      setShowAdd(false);
      notifications.organizationAdded(form.name.trim());
    } catch (err: any) {
      console.error("Error creating organization:", err);
      notifications.error(err.message || "Failed to create organization");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteOrganization(id: number, name: string) {
    setConfirmDialog({ open: true, orgId: id, orgName: name });
  }

  async function handleConfirmDelete() {
    if (confirmDialog.orgId !== null) {
      try {
        await organizationsApi.delete(confirmDialog.orgId);
        setOrganizations((s) => s.filter((org) => org.id !== confirmDialog.orgId));
        notifications.organizationDeleted(confirmDialog.orgName);
        setConfirmDialog({ open: false, orgId: null, orgName: "" });
      } catch (err: any) {
        console.error("Error deleting organization:", err);
        notifications.error(err.message || "Failed to delete organization");
      }
    }
  }

  function handleCancelDelete() {
    setConfirmDialog({ open: false, orgId: null, orgName: "" });
  }

  return (
    <Layout>
      <div className="flex flex-col items-center gap-6 px-4 sm:px-6 md:px-[70px] py-6">
        <div className="flex flex-col items-start gap-3 w-full max-w-[1140px]">
          <div className="flex justify-between items-center w-full">
            <Breadcrumb items={[{ label: "Manage B2B organizations", path: "/" }]} />

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowSearch((s) => !s)}
                  className="flex w-8 h-8 p-2 justify-center items-center gap-1 rounded-md bg-brand-50 hover:bg-brand-50/80 transition-colors"
                  aria-label="Toggle search"
                >
                  <Search className="w-3.5 h-3.5 text-primary" />
                </button>

                {showSearch && (
                  <>
                    <div className="fixed inset-0" onClick={() => setShowSearch(false)} />
                    <div className="absolute right-0 mt-2 w-[380px] bg-white border border-gray-100 rounded-lg shadow-lg p-4 z-50">
                      <div className="flex items-center gap-2 mb-3">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                          autoFocus
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setShowSearch(false);
                          }}
                          placeholder="Search organizations by name or email..."
                          className="flex-1 bg-transparent text-sm outline-none text-text-primary placeholder:text-gray-400"
                        />
                        {query && (
                          <button
                            onClick={() => setQuery("")}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Clear search"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        {filteredOrganizations.length > 0 ? (
                          <div className="max-h-[280px] overflow-y-auto">
                            {filteredOrganizations.map((org) => (
                              <Link
                                key={org.id}
                                to={`/organization/${org.id}`}
                                onClick={() => setShowSearch(false)}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
                              >
                                <img src={org.avatar || ''} alt={org.name} className="w-7 h-7 rounded-full object-cover" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-text-primary truncate">{org.name}</div>
                                  <div className="text-xs text-gray-400 truncate">{org.email}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 text-center py-4">
                            {query ? "No organizations found" : "Start typing to search..."}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start w-full border border-gray-100 rounded-md">
            <div className="flex px-5 py-3 justify-between items-center w-full">
              <h1 className="text-base font-semibold leading-6 text-text-primary">B2B organizations</h1>
              <Button size="sm" onClick={() => setShowAdd(true)} className="h-8 px-4 gap-1 rounded-md bg-primary hover:bg-primary/90 text-white text-xs">
                <Plus className="w-3 h-3" />
                Add organization
              </Button>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="flex items-start w-full bg-gray-50">
                <div className="flex w-20 h-11 px-3 items-center gap-2">
                  <span className="flex-1 text-center text-xs font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">Sr. No</span>
                </div>
                <div className="flex w-[400px] h-11 px-3 items-center gap-2">
                  <span className="flex-1 text-xs font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">Organizations</span>
                </div>
                <div className="flex flex-1 h-11 px-3 items-center gap-2">
                  <span className="flex-1 text-xs font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">Pending requests</span>
                </div>
                <div className="flex w-40 h-11 px-3 items-center gap-2">
                  <span className="flex-1 text-xs font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">Status</span>
                </div>
                <div className="flex w-[120px] h-11 px-3 items-center gap-2">
                  <span className="flex-1 text-xs font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">Action</span>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <p className="text-sm text-red-600">{error}</p>
                  <Button onClick={loadOrganizations} size="sm">Retry</Button>
                </div>
              ) : filteredOrganizations.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-text-secondary">
                    {query ? "No organizations found matching your search" : "No organizations yet. Create one to get started!"}
                  </p>
                </div>
              ) : (
                filteredOrganizations.map((org) => (
                  <div key={org.id} className="flex items-start w-full border-b border-gray-50 bg-white">
                    <div className="flex w-20 h-[60px] pl-3 justify-center items-center gap-2.5">
                      <span className="flex-1 text-center text-sm font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">{org.id}</span>
                    </div>
                    <div className="flex w-[400px] h-[60px] pl-3 items-center gap-1">
                      <div className="flex items-center gap-2">
                        <img src={org.avatar || ''} alt={org.name} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-semibold leading-5 text-text-primary">{org.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-1 h-[60px] pl-3 items-center gap-2.5">
                      <span className="text-sm font-normal leading-5 text-text-primary overflow-hidden text-ellipsis">{org.pendingRequests} pending requests</span>
                    </div>
                    <div className="flex w-40 h-[60px] pl-3 items-center gap-2.5"><StatusBadge status={org.status} /></div>
                    <div className="flex w-[120px] pl-3 items-center gap-2.5 h-[60px]">
                      <Link to={`/organization/${org.id}`} className="flex w-[18px] h-[18px] p-0.5 justify-center items-center gap-2.5 text-[#97A1B2] hover:text-primary transition-colors">
                        <Eye className="w-full h-full" strokeWidth={1.25} />
                      </Link>
                      <button onClick={() => handleDeleteOrganization(org.id, org.name)} className="flex w-4 h-4 p-0.5 justify-center items-center text-[#97A1B2] hover:text-error-500 transition-colors">
                        <Trash2 className="w-full h-full" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !submitting && setShowAdd(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-md shadow-lg p-6 mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Organization</h3>
              <button className="text-sm text-text-secondary" onClick={() => !submitting && setShowAdd(false)} disabled={submitting}>Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-text-secondary">Name of the organization *</label>
                <input name="name" value={form.name} onChange={handleChange} disabled={submitting} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:opacity-50" />
              </div>
              <div>
                <label className="text-sm text-text-secondary">Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange} disabled={submitting} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:opacity-50" placeholder="Auto-generated if empty" />
              </div>
              <div>
                <label className="text-sm text-text-secondary">Organization email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} disabled={submitting} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:opacity-50" />
              </div>
              <div>
                <label className="text-sm text-text-secondary">Contact</label>
                <input name="contact" value={form.contact} onChange={handleChange} disabled={submitting} className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white disabled:opacity-50" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 rounded-md bg-gray-100 text-sm" onClick={() => setShowAdd(false)} disabled={submitting}>Cancel</button>
              <button className="px-4 py-2 rounded-md bg-primary text-white text-sm flex items-center gap-2" onClick={handleAddOrganization} disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        title="Delete Organization"
        description={`Are you sure you want to delete "${confirmDialog.orgName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDangerous={true}
      />
    </Layout>
  );
}
