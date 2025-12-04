import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { useMockData } = body;
    console.log("🚀 ~ POST ~ useMockData:", useMockData);

    // Check if we should use mock data
    if (useMockData) {
      console.log("Using mock data from jsonresult.json");

      try {
        // Read the mock data file
        const mockDataPath = path.join(
          process.cwd(),
          "extras",
          "jsonresult.json"
        );
        const mockDataContent = fs.readFileSync(mockDataPath, "utf8");
        const mockData = JSON.parse(mockDataContent);

        // Process mock data through enhanced template selection
        const processedSlides = mockData.data.slides.map((slide: any) => {
          // Check if this slide should have a chart template
          if (
            slide.title.toLowerCase().includes("budget allocation") ||
            slide.title.toLowerCase().includes("marketing mix")
          ) {
            // Extract percentage data from content
            const content = slide.content;
            const percentageMatches = content.match(
              /(\w+(?:\s+\w+)*):\s*(\d+)%/g
            );

            if (percentageMatches && percentageMatches.length > 0) {
              const chartData = percentageMatches.map((match: string) => {
                const [name, value] = match.split(": ");
                return {
                  name: name.trim(),
                  value: parseInt(value.replace("%", "")),
                };
              });

              return {
                ...slide,
                template: "pie-chart",
                templateData: {
                  type: "pie",
                  data: chartData,
                  dataKey: "value",
                  nameKey: "name",
                },
              };
            }
          }

          return slide;
        });

        // Return the processed mock data with enhanced templates
        return NextResponse.json({
          success: true,
          data: {
            ...mockData.data,
            slides: processedSlides,
          },
        });
      } catch (mockError) {
        console.error("Error reading mock data:", mockError);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to load mock data",
          },
          { status: 500 }
        );
      }
    }

    // Use AI to generate presentation content from JSON data
    console.log("Generating AI-powered presentation from data:", body);

    // Use the Mastra workflow to generate the presentation
    let presentationData = null;

    try {
      console.log("🤖 Using Mastra Workflow for presentation generation");

      // Use the basic presentation workflow
      const workflow = mastra.getWorkflow("presentationWorkflow");
      const run = await workflow.createRunAsync();
      const result = await run.start({ inputData: body });

      console.log("✅ Mastra workflow presentation generated successfully");
      console.log(
        "📊 Workflow result structure:",
        JSON.stringify(result, null, 2)
      );

      // Extract the actual result from the workflow response
      const actualData = (result as any).result || result;

      if (actualData && actualData.slides && Array.isArray(actualData.slides)) {
        presentationData = actualData;
      }
    } catch (workflowError) {
      console.error("Workflow generation failed:", workflowError);
      // Continue to fallback mechanism
    }

    // Fallback: Create intelligent presentation from JSON data
    if (!presentationData) {
      console.log(
        "Using fallback: creating intelligent presentation from JSON data"
      );

      const slides = [];
      let slideOrder = 0;

      // Extract title intelligently
      const title =
        body.title ||
        body.name ||
        body.company ||
        body.project ||
        body.subject ||
        body.topic ||
        "Data Analysis Presentation";

      // Create title slide
      slides.push({
        id: `slide-${slideOrder++}`,
        title: title,
        content: `# ${title}\n\n*Data-driven insights and analysis*`,
        type: "title" as const,
        layout: "centered" as const,
        order: slideOrder,
      });

      // Helper function to detect and process marketing mix data
      const processMarketingMixData = (data: any) => {
        const keys = Object.keys(data).map((k) => k.toLowerCase());
        const hasMarketingMix =
          (keys.some((k) => k.includes("product")) &&
            keys.some((k) => k.includes("price"))) ||
          (keys.some((k) => k.includes("place")) &&
            keys.some((k) => k.includes("promotion"))) ||
          keys.some((k) => k.includes("marketing_mix")) ||
          keys.some((k) => k.includes("marketing mix"));

        if (hasMarketingMix) {
          const chartData: { name: string; value: number }[] = [];

          // Check for nested marketing_mix object first
          if (data.marketing_mix && typeof data.marketing_mix === "object") {
            Object.entries(data.marketing_mix).forEach(([key, value]) => {
              if (typeof value === "number" && value > 0) {
                chartData.push({
                  name: key.charAt(0).toUpperCase() + key.slice(1),
                  value: value,
                });
              }
            });
          } else {
            // Check for direct properties
            Object.entries(data).forEach(([key, value]) => {
              if (typeof value === "number" && value > 0) {
                chartData.push({
                  name: key.charAt(0).toUpperCase() + key.slice(1),
                  value: value,
                });
              }
            });
          }

          if (chartData.length > 0) {
            // Generate markdown content for marketing mix
            const markdownContent = `## Marketing Mix Analysis

**Distribution of marketing resources across key areas**

${chartData.map((item) => `- **${item.name}**: ${item.value}%`).join("\n")}

### Key Insights
- Total allocation: ${chartData.reduce((sum, item) => sum + item.value, 0)}%
- Primary focus: ${
              chartData.reduce(
                (max, item) => (item.value > max.value ? item : max),
                chartData[0]
              ).name
            }
- Balanced distribution across ${chartData.length} key areas`;

            slides.push({
              id: `slide-${slideOrder++}`,
              title: "Marketing Mix Analysis",
              content: markdownContent,
              type: "content" as const,
              layout: "centered" as const,
              order: slideOrder,
            });
            return true; // Indicate that marketing mix was processed
          }
        }
        return false;
      };

      // Process JSON data intelligently to create meaningful slides
      const createSlidesFromData = (data: any, parentKey = "", depth = 0) => {
        if (depth > 3) return; // Prevent infinite recursion

        if (typeof data === "object" && data !== null) {
          if (Array.isArray(data)) {
            // Handle arrays - create slides for each significant item
            if (data.length > 0) {
              slides.push({
                id: `slide-${slideOrder++}`,
                title: parentKey ? `${parentKey} Overview` : "Data Overview",
                content: `## ${
                  parentKey ? `${parentKey} Overview` : "Data Overview"
                }\n\n**Total Items:** ${
                  data.length
                }\n\n*Key insights from the dataset*`,
                type: "content" as const,
                layout: "centered" as const,
                order: slideOrder,
              });

              // Create slides for items, splitting if too many
              const maxItemsPerSlide = 2; // Reduced to ensure content fits
              const itemsToProcess = data.slice(0, 8); // Limit to 8 items max

              for (
                let i = 0;
                i < itemsToProcess.length;
                i += maxItemsPerSlide
              ) {
                const slideItems = itemsToProcess.slice(
                  i,
                  i + maxItemsPerSlide
                );
                const slideTitle =
                  slideItems.length === 1
                    ? slideItems[0].name ||
                      slideItems[0].title ||
                      slideItems[0].label ||
                      `${parentKey} Item ${i + 1}`
                    : `${parentKey} Items ${i + 1}-${i + slideItems.length}`;

                const slideContent = slideItems
                  .map((item, index) => {
                    if (typeof item === "object" && item !== null) {
                      const itemTitle =
                        item.name ||
                        item.title ||
                        item.label ||
                        `Item ${i + index + 1}`;
                      const itemEntries = Object.entries(item).slice(0, 3); // Limit to 3 properties per item

                      return `#### ${itemTitle}\n\n${itemEntries
                        .map(
                          ([k, v]) =>
                            `- **${
                              k.charAt(0).toUpperCase() +
                              k.slice(1).replace(/_/g, " ")
                            }:** ${v}`
                        )
                        .join("\n")}`;
                    }
                    return `${item}`;
                  })
                  .join("\n\n");

                slides.push({
                  id: `slide-${slideOrder++}`,
                  title: slideTitle,
                  content: slideContent,
                  type: "content" as const,
                  layout: "centered" as const,
                  order: slideOrder,
                });
              }
            }
          } else {
            // Handle objects - create slides for key properties
            const entries = Object.entries(data);
            const significantEntries = entries.filter(
              ([key, value]) =>
                key !== "title" &&
                key !== "name" &&
                key !== "id" &&
                value !== null &&
                value !== undefined &&
                value !== ""
            );

            if (significantEntries.length > 0) {
              // Group related properties with size awareness
              const maxPropertiesPerSlide = 3; // Reduced to ensure content fits
              const groups: [string, any][][] = [];
              let currentGroup: [string, any][] = [];

              significantEntries.forEach(([key, value]) => {
                if (currentGroup.length >= maxPropertiesPerSlide) {
                  groups.push(currentGroup);
                  currentGroup = [];
                }
                currentGroup.push([key, value]);
              });
              if (currentGroup.length > 0) {
                groups.push(currentGroup);
              }

              groups.forEach((group, groupIndex) => {
                const slideTitle =
                  group.length === 1
                    ? group[0][0].charAt(0).toUpperCase() +
                      group[0][0].slice(1).replace(/_/g, " ")
                    : `${parentKey || "Data"} Analysis ${groupIndex + 1}`;

                // Limit content per slide to fit 16:9 aspect ratio
                const limitedGroup = group.slice(0, 3); // Max 3 items per slide
                const slideContent = `<h3>${slideTitle}</h3><ul>${limitedGroup
                  .map(([key, value]) => {
                    const formattedKey =
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/_/g, " ");
                    if (typeof value === "object" && value !== null) {
                      const jsonStr = JSON.stringify(value, null, 2);
                      // Truncate long JSON to fit slide
                      const truncatedJson =
                        jsonStr.length > 100
                          ? jsonStr.substring(0, 100) + "..."
                          : jsonStr;
                      return `<li><strong>${formattedKey}:</strong> <code>${truncatedJson}</code></li>`;
                    }
                    return `<li><strong>${formattedKey}:</strong> ${value}</li>`;
                  })
                  .join("")}</ul>`;

                slides.push({
                  id: `slide-${slideOrder++}`,
                  title: slideTitle,
                  content: slideContent,
                  type:
                    group.length > 1 ? ("list" as const) : ("content" as const),
                  layout:
                    group.length > 1
                      ? ("full-width" as const)
                      : ("centered" as const),
                  order: slideOrder,
                });
              });
            }
          }
        }
      };

      // Check for marketing mix data first
      const hasMarketingMix = processMarketingMixData(body);

      // Process the input data
      createSlidesFromData(body);

      // Note: SWOT analysis splitting is now handled by the Mastra workflow system
      // This prevents duplication between the basic route and the workflow system

      // Add conclusion slide
      slides.push({
        id: `slide-${slideOrder++}`,
        title: "Summary",
        content: `## Thank You\n\n**Key Takeaways:**\n- Data analysis completed\n- Insights generated\n- Professional presentation delivered\n\n*Questions & Discussion*`,
        type: "conclusion" as const,
        layout: "centered" as const,
        order: slideOrder,
      });

      presentationData = {
        title: title,
        slides: slides,
        theme: "modern",
        estimatedDuration: Math.ceil(slides.length * 2),
      };
    }

    console.log("Generated presentation:", presentationData);

    return NextResponse.json({
      success: true,
      data: presentationData,
    });
  } catch (error) {
    console.error("Error generating presentation:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
