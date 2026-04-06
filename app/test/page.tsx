"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";

function TestWidgetContent() {
  const searchParams = useSearchParams();
  const widgetId = searchParams.get("widgetId");

  useEffect(() => {
    if (!widgetId) return;

    // Set config before loading widget
    (window as any).SupportBotConfig = { widgetId };

    // Load widget.js dynamically
    const script = document.createElement("script");
    script.src = "/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [widgetId]);

  if (!widgetId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Missing widgetId parameter.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-indigo-600 underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-lg text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Your Widget</h1>
          <p className="text-gray-500">
            Your SupportBot widget is loading in the <strong>bottom-right corner</strong> of this page.
            Click the chat bubble to open it and send a test message!
          </p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 text-left mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">What to try:</h2>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>Click the purple chat bubble in the bottom-right corner</li>
            <li>Type a question or message</li>
            <li>See the AI respond using your knowledge base</li>
            <li>
              Check{" "}
              <Link href="/dashboard/conversations" className="text-indigo-600 underline">
                Conversations
              </Link>{" "}
              to see this chat logged
            </li>
          </ol>
        </div>

        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:text-indigo-800 underline"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <TestWidgetContent />
    </Suspense>
  );
}
