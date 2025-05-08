import React, { useState } from "react";
import {CalendarIcon, NewspaperIcon, ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/outline";

const NewsCard = ({ article }) => {
  const [expanded, setExpanded] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  //clean HTML content
  const cleanContent = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const getContentPreview = (content) => {
    const cleanedContent = cleanContent(content);
    return cleanedContent.length > 200
      ? cleanedContent.substring(0, 200) + "..."
      : cleanedContent;
  };

  const handleSummarize = async () => {
    if (!article.content || !article._id) return;
  
    try {
      setIsSummarizing(true);
      setSummaryError(null);

      const backendURL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendURL}/api/news/${article._id}/summary`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: cleanContent(article.content),
        }),
      });
  
      const data = await response.json();
      article.summary = data.summary;
      setExpanded(true);
    } catch (error) {
      console.log("Summarization failed : ", error);
      setSummaryError("Failed to generate summary. Please try again later.");
    } finally {
      setIsSummarizing(false);
    }
  };
  
  return (
    <>
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500 flex items-center">
            <NewspaperIcon className="h-4 w-4 mr-1" />
            {article.source}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {new Date(article.publishDate).toLocaleDateString()}
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          {article.title}
        </h2>
        <p className="text-gray-600 mb-4">
          {getContentPreview(article.content)}
        </p>

        {/* AI Summary Section new */}
        <div className="mb-4 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-blue-900">
              AI-Generated Summary
            </h3>
            {article.summary ? (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {" "}
                {expanded ? "Hide Summary" : "Show Summary"}{" "}
              </button>
            ) : (
              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className={`text-sm px-3 py-1 rounded ${
                  isSummarizing
                    ? "bg-gray-300 text-gray-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isSummarizing ? "Summarizing..." : "Summarize"}
              </button>
            )}
          </div>

          {summaryError && (
            <p className="text-red-500 text-sm mt-2">{summaryError}</p>
          )}

          {expanded && article.summary && (
            <div className="mt-2">
              <p className="text-blue-800">{article.summary}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Read full article →
          </a>
        </div>
      </div>
    </div>
    </>
  );
};

export default NewsCard;