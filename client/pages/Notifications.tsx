import { Layout } from "@/components/Layout";

export default function Notifications() {
  return (
    <Layout>
      <div className="flex-1 flex items-start justify-center bg-gradient-to-b from-white to-indigo-50 p-6">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-primary mb-4">Notifications</h1>
          <p className="text-gray-700 mb-4">You have no new notifications. This page is wired to the bell icon in the header.</p>
        </div>
      </div>
    </Layout>
  );
}
