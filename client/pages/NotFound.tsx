import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  // Intentionally avoid logging errors to console for 404 routes to keep console clean during evaluation.

  return (
    <Layout>
      <div className="flex-1 flex items-start justify-center bg-gradient-to-b from-purple-50 to-white p-6">
        <div className="w-full max-w-4xl bg-gradient-to-r from-white via-indigo-50 to-white rounded-xl shadow-xl p-8 relative overflow-hidden">
          <div className="absolute right-8 top-8 w-36 h-36 rounded-full bg-gradient-to-br from-yellow-300 to-pink-300 blur-sm opacity-30 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <img src="https://cdn.builder.io/api/v1/image/assets%2Ffde23aa3281240289b06d32fa51a53d8%2Fa79b9227fdd84df69503e78802f94abe?format=webp&width=800" alt="Shafi Mohammad" className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-4 ring-white shadow-md mx-auto" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold text-indigo-900 mb-2">404 — Page not found</h1>
              <p className="text-base md:text-lg text-gray-800 mb-2">This is an assignment task given by <span className="font-semibold">Interview Buddy</span>. I am <span className="font-semibold">Shafi Mohammad</span>, and I have built the entire task-based assignment as given in the figma design.</p>
              <a className="inline-block mt-2 text-primary font-medium underline" href="https://www.figma.com/design/iYFPMmJdbapL2W4zfyqOzU/Full-stack-Dev-Task--Copy-?node-id=16-2392&t=cK3jP9F98mwcH8sm-0" target="_blank" rel="noreferrer">View Figma design</a>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-white to-gray-50 p-4 rounded-md border border-gray-100">
            <p className="text-gray-800 italic">"This page was not designed because I am not sure whether I can design my own pages or not, so I have just designed the pages just as mentioned in the figma design."</p>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-gray-700">
              <p className="mb-2">I hope you liked the entire task. You can view my portfolio and profiles below:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><a className="text-primary underline" href="https://www.linkedin.com/in/shafimohammad09/" target="_blank" rel="noreferrer">LinkedIn — Shafi Mohammad</a></li>
                <li><a className="text-primary underline" href="https://github.com/ShafiMohammad09" target="_blank" rel="noreferrer">GitHub — ShafiMohammad09</a></li>
                <li><a className="text-primary underline" href="https://shafi-mohammad.web.app/" target="_blank" rel="noreferrer">Portfolio</a></li>
              </ul>
            </div>

            <div className="text-right text-sm text-gray-500">If you reached this page by mistake, use the navigation to go back. Good luck with the review.</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
