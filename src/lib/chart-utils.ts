import { ChartData } from "@/mastra/types/slide-templates";

/**
 * Parse percentage data from Budget Allocation content
 * Example: "**LinkedIn Advertising:** 25%\n**Content Marketing & SEO:** 20%"
 */
export function parseBudgetAllocationData(content: string): ChartData | null {
  const lines = content.split("\n");
  const data: Array<{ name: string; value: number }> = [];

  for (const line of lines) {
    // Try multiple patterns to match different formats
    // Format 1: **text:** number% (colon inside bold)
    let match = line.match(/\*\*(.*?):\*\*\s*(\d+)%/);
    if (!match) {
      // Format 2: **text**: number% (colon outside bold)
      match = line.match(/\*\*(.*?)\*\*:\s*(\d+)%/);
    }
    if (!match) {
      // Format 3: - text: number% (bullet point format)
      match = line.match(/^-\s*([^:]+):\s*(\d+)%/);
    }
    if (!match) {
      // Format 4: text: number% (no bold, no bullet)
      match = line.match(/([^:]+):\s*(\d+)%/);
    }

    if (match) {
      const name = match[1].trim();
      const value = parseInt(match[2]);
      if (!isNaN(value)) {
        data.push({ name, value });
      }
    }
  }

  if (data.length === 0) {
    return null;
  }

  // Don't show chart if there's only one data point
  if (data.length === 1) {
    // console.log(
    //   "📊 Single data point detected, skipping chart generation:",
    //   data
    // );
    return null;
  }

  return {
    type: "pie",
    data,
    dataKey: "value",
    nameKey: "name",
    colors: [
      "#3b82f6", // Blue
      "#10b981", // Green
      "#f59e0b", // Yellow
      "#ef4444", // Red
      "#8b5cf6", // Purple
      "#ec4899", // Pink
      "#14b8a6", // Teal
      "#f97316", // Orange
    ],
  };
}

/**
 * Check if a slide should display a chart based on its title and content
 */
export function shouldShowChart(slide: {
  title: string;
  content: string;
  type: string;
}): boolean {
  // Check for Budget Allocation or similar chart-worthy titles
  const chartTitles = [
    "Budget Allocation",
    "Budget Distribution",
    "Spending Breakdown",
    "Cost Analysis",
    "Investment Distribution",
    "Resource Allocation",
    "Marketing Mix",
  ];

  // Remove "(continued)" from title for matching
  const cleanTitle = slide.title.replace(/\s*\(continued\)\s*$/i, "");

  const titleMatch = chartTitles.some((title) =>
    cleanTitle.toLowerCase().includes(title.toLowerCase())
  );

  // Also check if content contains percentage data
  const hasPercentageData = /\d+%/.test(slide.content);

  return titleMatch || hasPercentageData;
}

/**
 * Parse chart data from slide content based on slide type
 */
export function parseChartDataFromSlide(slide: {
  title: string;
  content: string;
  type: string;
}): ChartData | null {
  if (shouldShowChart(slide)) {
    return parseBudgetAllocationData(slide.content);
  }

  return null;
}
