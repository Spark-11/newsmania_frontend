import React from "react";
import NewsFeed from "./components/NewsFeed";
import Notes from "./components/Notes";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center sm:justify-start space-x-4">
                <NewspaperIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 min-w-[32px] min-h-[32px] text-blue-600" />
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Newsmania
                  </h1>
                  <p className="text-sm text-gray-600">
                    Stay informed with AI-powered news summaries from trusted
                    sources
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
            <Routes>
              <Route path="/" element={<NewsFeed />} />
              <Route path="/notes" element={<Notes />} />
            </Routes>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;