import React, { useState } from 'react';
import { AlertTriangle, Flame, Droplets, Wind, Thermometer, Clock, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { CriticalIssue } from '../../types/user';
import { cleanMarkdownArtifacts } from '../../utils/textUtils';

interface CriticalIssuesCardProps {
  issues: CriticalIssue[];
}

const getIssueIcon = (type: CriticalIssue['type']) => {
  const iconMap = {
    heatwave: Thermometer,
    drought: Droplets,
    flooding: Droplets,
    pollution: Wind,
    wildfire: Flame,
    'air-quality': Wind,
    storm: Wind,
    'extreme-weather': AlertTriangle,
    'health-risk': AlertTriangle,
    'infrastructure-risk': AlertTriangle,
  };
  return iconMap[type] || AlertTriangle;
};

const getSeverityColor = (severity: CriticalIssue['severity']) => {
  const colorMap = {
    low: 'bg-green-50 border-green-200 text-green-800',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    high: 'bg-orange-50 border-orange-200 text-orange-800',
    critical: 'bg-red-50 border-red-200 text-red-800',
  };
  return colorMap[severity];
};

export const CriticalIssuesCard: React.FC<CriticalIssuesCardProps> = ({ issues }) => {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const criticalIssues = issues.filter(issue => issue.severity === 'critical' || issue.severity === 'high');
  const allIssues = issues; // Show all issues, not just critical ones

  const toggleExpanded = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe?.toLowerCase()) {
      case 'immediate': return 'bg-red-100 text-red-800';
      case 'short-term (1-3 days)': return 'bg-orange-100 text-orange-800';
      case 'medium-term (1-2 weeks)': return 'bg-yellow-100 text-yellow-800';
      case 'long-term (1+ months)': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-red-100 p-3 rounded-full">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Critical Environmental Issues</h2>
          <p className="text-gray-600">Urgent concerns requiring attention</p>
        </div>
      </div>

      <div className="space-y-4">
        {allIssues.length > 0 ? (
          allIssues.map((issue) => {
            const IconComponent = getIssueIcon(issue.type);
            const isExpanded = expandedIssues.has(issue.id);
            return (
              <div
                key={issue.id}
                className={`p-4 rounded-xl border-2 ${getSeverityColor(issue.severity)}`}
              >
                <div className="flex items-start space-x-3">
                  <IconComponent className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{issue.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white">
                          {issue.severity.toUpperCase()}
                        </span>
                        <button
                          onClick={() => toggleExpanded(issue.id)}
                          className="p-1 hover:bg-white/50 rounded-full transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Enhanced metadata */}
                    <div className="flex items-center space-x-3 mb-3">
                      {(issue as any).timeframe && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span className={`text-xs px-2 py-1 rounded-full ${getTimeframeColor((issue as any).timeframe)}`}>
                            {(issue as any).timeframe}
                          </span>
                        </div>
                      )}
                      {(issue as any).confidence && (
                        <div className="flex items-center space-x-1">
                          <Target className="h-3 w-3" />
                          <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor((issue as any).confidence)}`}>
                            {(issue as any).confidence} confidence
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm opacity-90 mb-3">{cleanMarkdownArtifacts(issue.description)}</p>
                    
                    {isExpanded && (
                      <div className="space-y-3">
                        <div className="bg-white/50 rounded-lg p-3">
                          <p className="text-sm font-medium mb-1">AI Cross-Reference Analysis:</p>
                          <p className="text-sm">{cleanMarkdownArtifacts(issue.aiInsights)}</p>
                        </div>

                        {issue.actionSuggestions.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Recommended Actions:</p>
                            <ul className="space-y-1">
                              {issue.actionSuggestions.map((action, index) => (
                                <li key={index} className="text-sm flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></div>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="bg-green-50 rounded-xl p-6">
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <AlertTriangle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-900 mb-2">All Clear!</h3>
              <p className="text-green-700">No critical environmental issues detected for your area.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};