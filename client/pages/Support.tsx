import { Layout } from "@/components/Layout";

export default function Support() {
  return (
    <Layout>
      <div className="flex-1 flex items-start justify-center bg-gradient-to-b from-indigo-50 to-white p-6">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Support</h1>
          <p className="text-gray-700 mb-4">If you need help, please contact our support team at <a className="text-primary underline" href="mailto:support@example.com">support@example.com</a>.</p>
          <p className="text-gray-600">This is a placeholder support page wired to the header icon.</p>
        </div>
      </div>
    </Layout>
  );
}
