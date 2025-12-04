import { PresentationTheme } from "@/lib/presentation-types";

/**
 * Utility functions to ensure proper text contrast in dark themes
 */

/**
 * Determines if a theme is dark based on background color
 */
export function isDarkTheme(theme: PresentationTheme): boolean {
  const bgColor = theme.colors.background.toLowerCase();

  // Check for common dark color patterns
  if (
    bgColor.includes("#000") ||
    bgColor.includes("#1") ||
    bgColor.includes("#2") ||
    bgColor.includes("#3") ||
    bgColor.includes("rgb(0") ||
    bgColor.includes("rgb(1") ||
    bgColor.includes("rgb(2") ||
    bgColor.includes("rgb(3")
  ) {
    return true;
  }

  return false;
}

/**
 * Gets appropriate text color for a theme, ensuring contrast
 */
export function getContrastTextColor(theme: PresentationTheme): string {
  if (isDarkTheme(theme)) {
    return "#ffffff"; // White text for dark backgrounds
  }
  return theme.colors.text || "#1f2937"; // Use theme text color for light backgrounds
}

/**
 * Gets appropriate primary color for a theme, ensuring contrast
 */
export function getContrastPrimaryColor(theme: PresentationTheme): string {
  if (isDarkTheme(theme)) {
    return "#60a5fa"; // Lighter blue for dark backgrounds
  }
  return theme.colors.primary || "#3b82f6"; // Use theme primary color for light backgrounds
}

/**
 * Generates CSS styles that ensure proper contrast for HTML content
 */
export function getContrastStyles(
  theme: PresentationTheme
): React.CSSProperties {
  const isDark = isDarkTheme(theme);

  return {
    color: getContrastTextColor(theme),
    // Ensure all child elements inherit proper colors
    "--tw-prose-body": getContrastTextColor(theme),
    "--tw-prose-headings": getContrastPrimaryColor(theme),
    "--tw-prose-lead": getContrastTextColor(theme),
    "--tw-prose-links": getContrastPrimaryColor(theme),
    "--tw-prose-bold": getContrastTextColor(theme),
    "--tw-prose-counters": getContrastTextColor(theme),
    "--tw-prose-bullets": getContrastTextColor(theme),
    "--tw-prose-hr": isDark ? "#374151" : "#e5e7eb",
    "--tw-prose-quotes": getContrastTextColor(theme),
    "--tw-prose-quote-borders": isDark ? "#374151" : "#e5e7eb",
    "--tw-prose-captions": getContrastTextColor(theme),
    "--tw-prose-code": isDark ? "#fbbf24" : "#1f2937",
    "--tw-prose-pre-code": isDark ? "#fbbf24" : "#1f2937",
    "--tw-prose-pre-bg": isDark ? "#1f2937" : "#f3f4f6",
    "--tw-prose-th-borders": isDark ? "#374151" : "#e5e7eb",
    "--tw-prose-td-borders": isDark ? "#374151" : "#e5e7eb",
  } as React.CSSProperties;
}

/**
 * Generates CSS classes for HTML content that ensure proper contrast
 */
export function getContrastClasses(theme: PresentationTheme): string {
  const isDark = isDarkTheme(theme);

  if (isDark) {
    return "prose prose-lg max-w-none h-full overflow-y-auto prose-invert";
  }

  return "prose prose-lg max-w-none h-full overflow-y-auto";
}

