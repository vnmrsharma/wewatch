// Utility functions for cleaning up text content

export const cleanMarkdownArtifacts = (text: string): string => {
  if (!text) return '';
  
  return text
    // Remove markdown code blocks first (including JSON blocks)
    .replace(/```json\s*([\s\S]*?)\s*```/g, (match, content) => {
      try {
        const parsed = JSON.parse(content.trim());
        // If it's a JSON object with summary, return the summary
        if (parsed.summary) return parsed.summary;
        // If it's a JSON object with other text fields, return the first meaningful field
        if (parsed.description) return parsed.description;
        if (parsed.text) return parsed.text;
        if (parsed.content) return parsed.content;
        // Otherwise return the JSON as a readable string
        return JSON.stringify(parsed, null, 2);
      } catch {
        // If JSON parsing fails, return the content as-is
        return content.trim();
      }
    })
    .replace(/```[\s\S]*?```/g, '')
    // Remove markdown bold/italic markers
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove markdown links but keep the text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown lists
    .replace(/^[\s]*[-*+]\s+/gm, '• ')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

export const formatTextForDisplay = (text: string): string => {
  return cleanMarkdownArtifacts(text)
    // Ensure proper sentence spacing
    .replace(/\.([A-Z])/g, '. $1')
    // Clean up any remaining artifacts
    .replace(/[^\w\s.,!?;:()\-'"]/g, '')
    .trim();
};

export const truncateText = (text: string, maxLength: number = 200): string => {
  const cleaned = cleanMarkdownArtifacts(text);
  if (cleaned.length <= maxLength) return cleaned;
  
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

export const highlightKeywords = (text: string, keywords: string[]): string => {
  let highlighted = cleanMarkdownArtifacts(text);
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    highlighted = highlighted.replace(regex, `<span class="font-semibold text-blue-700">$1</span>`);
  });
  
  return highlighted;
};
