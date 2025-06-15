import React from "react";
import NewsBot from "../bots/NewsBot";
import "./NewsFeed.css";

export default function NewsFeed({ compact }) {
  return (
    <div className={compact ? "news-feed compact" : "news-feed"}>
      <NewsBot />
    </div>
  );
}