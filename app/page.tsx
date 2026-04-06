import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-indigo-600">SupportBot</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 px-4 py-2">
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          AI Customer Support
          <br />
          <span className="text-indigo-600">for your website</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Add a smart chat widget to your site in minutes. Your AI assistant
          answers customer questions 24/7 using your own knowledge base.
        </p>
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 inline-block"
        >
          Start Free Trial
        </Link>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">5-Minute Setup</h3>
            <p className="text-gray-600">
              Paste one line of code on your website. No engineers needed.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Your Knowledge Base</h3>
            <p className="text-gray-600">
              Paste in your FAQs and docs. The AI answers using only your content.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Full History</h3>
            <p className="text-gray-600">
              Review every conversation from your dashboard. See what customers ask.
            </p>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border shadow-sm">
              <h3 className="text-xl font-bold mb-1">Starter</h3>
              <div className="text-4xl font-bold text-indigo-600 mb-4">$99<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="text-gray-600 space-y-2 mb-8">
                <li>✓ 1 knowledge base</li>
                <li>✓ 500 AI responses/mo</li>
                <li>✓ Email support</li>
              </ul>
              <Link href="/register" className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
                Get Started
              </Link>
            </div>
            <div className="bg-indigo-600 p-8 rounded-2xl shadow-sm text-white">
              <h3 className="text-xl font-bold mb-1">Growth</h3>
              <div className="text-4xl font-bold mb-4">$199<span className="text-lg opacity-75 font-normal">/mo</span></div>
              <ul className="space-y-2 mb-8 opacity-90">
                <li>✓ 5 knowledge bases</li>
                <li>✓ 2,000 AI responses/mo</li>
                <li>✓ Priority support</li>
              </ul>
              <Link href="/register" className="block w-full text-center bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
