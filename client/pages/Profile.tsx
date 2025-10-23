import { Layout } from "@/components/Layout";

export default function Profile() {
  return (
    <Layout>
      <div className="flex-1 flex items-start justify-center bg-gradient-to-b from-indigo-50 to-white p-6">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Ffde23aa3281240289b06d32fa51a53d8%2Fa79b9227fdd84df69503e78802f94abe?format=webp&width=800"
              alt="Shafi Mohammad"
              className="w-36 h-36 rounded-full object-cover ring-4 ring-indigo-50 shadow-lg"
            />
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">Shafi Mohammad</div>
              <div className="text-sm text-gray-600">Full-stack Developer</div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-indigo-900 mb-2">About</h2>
            <p className="text-gray-700 mb-4">Hello — I'm Shafi Mohammad. I built this assignment as requested in the provided Figma design. I enjoy building pixel-perfect, responsive UIs and wiring frontend flows.</p>

            <h3 className="text-sm font-semibold text-gray-800">Contact</h3>
            <ul className="text-gray-700 mb-4">
              <li>Email: <a className="text-primary underline" href="mailto:gepopo1272@fogdiver.com">gepopo1272@fogdiver.com</a></li>
              <li>Portfolio: <a className="text-primary underline" href="https://shafi-mohammad.web.app/" target="_blank" rel="noreferrer">shafi-mohammad.web.app</a></li>
              <li>LinkedIn: <a className="text-primary underline" href="https://www.linkedin.com/in/shafimohammad09/" target="_blank" rel="noreferrer">/in/shafimohammad09</a></li>
              <li>GitHub: <a className="text-primary underline" href="https://github.com/ShafiMohammad09" target="_blank" rel="noreferrer">ShafiMohammad09</a></li>
            </ul>

            <h3 className="text-sm font-semibold text-gray-800">Notes</h3>
            <p className="text-gray-700">This profile page replaces the placeholder and shows the contributor details as requested. If you prefer to show the 404 page instead for the profile route, tell me and I will redirect it to the 404.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
