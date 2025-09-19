import React, { useState } from 'react';
import { Newspaper, ExternalLink, Filter, Calendar } from 'lucide-react';
import { NewsItem } from '../../types/user';

interface NewsCardProps {
  news: NewsItem[];
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const [filter, setFilter] = useState<'all' | 'policy' | 'event' | 'research' | 'community'>('all');
  
  const filteredNews = news.filter(item => filter === 'all' || item.category === filter);

  const getCategoryIcon = (category: NewsItem['category']) => {
    return category === 'policy' ? '🏛️' : category === 'event' ? '📅' : category === 'research' ? '🔬' : '🌍';
  };

  const getCategoryColor = (category: NewsItem['category']) => {
    const colorMap = {
      policy: 'bg-purple-100 text-purple-800',
      event: 'bg-green-100 text-green-800',
      research: 'bg-blue-100 text-blue-800',
      community: 'bg-orange-100 text-orange-800',
    };
    return colorMap[category];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-100 p-3 rounded-full">
            <Newspaper className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Local Climate News</h2>
            <p className="text-gray-600">Latest environmental updates</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'policy', 'event', 'research', 'community'] as const).map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === category
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="capitalize">{category}</span>
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <article
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(item.category)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{item.source}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors duration-200"
                >
                  <span>Read more</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <Filter className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">No news found</h3>
              <p className="text-gray-600 text-sm">
                No articles match the selected filter.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          News aggregated from local and international sources • Updated hourly
        </p>
      </div>
    </div>
  );
};