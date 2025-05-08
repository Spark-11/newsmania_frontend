import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NewsCard from "./NewsCard";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const NewsFeed = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSource, setSelectedSource] = useState("all");

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const backendURL = import.meta.env.VITE_BACKEND_URL;
      const url =
        selectedSource === "all"
          ? `${backendURL}/api/news`
          : `${backendURL}/api/news/source/${selectedSource}`;

      const response = await axios.get(url);
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to fetch news articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedSource]);

  useEffect(() => {
    fetchNews();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const renderSourceButton = (source, label) => (
    <button
      onClick={() => setSelectedSource(source)}
      className={`px-4 py-2 rounded-lg transition-colors ${
        selectedSource === source
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 mb-8">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
            <div className="flex gap-2">
              {renderSourceButton("all", "All Sources")}
              {renderSourceButton("ABP Live", "ABP Live")}
            </div>

            <div className="flex gap-2">
              {renderSourceButton("Amar Ujala", "Amar Ujala")}
              <button
                onClick={() => navigate("/notes")}
                className="px-3 py-2 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500 transition-colors"
              >
                Notes
              </button>
              <button
                onClick={fetchNews}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Refresh news"
                disabled={loading}
              >
                <ArrowPathIcon
                  className={`h-5 w-5 text-gray-700 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No articles found from this source.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article._id || article.link} article={article} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NewsFeed;
