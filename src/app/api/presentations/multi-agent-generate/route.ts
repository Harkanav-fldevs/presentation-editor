import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { useMockData, useMultiAgent = true, useFallback = true } = body;

    console.log("🚀 Multi-Agent Presentation API: Starting generation");
    console.log("📊 Use Multi-Agent:", useMultiAgent);
    console.log("📊 Use Fallback:", useFallback);
    console.log("📊 Use Mock Data:", useMockData);

    // Check if we should use mock data
    if (useMockData) {
      console.log("📊 Using mock data with multi-agent template selection");

      try {
        // Read the mock data file
        const mockDataPath = path.join(
          process.cwd(),
          "extras",
          "jsonresult.json"
        );
        const mockDataContent = fs.readFileSync(mockDataPath, "utf8");
        const mockData = JSON.parse(mockDataContent);

        // Use original mock data directly to avoid duplication
        console.log(
          "📊 Using original mock data without workflow processing to prevent duplication"
        );

        return NextResponse.json({
          success: true,
          data: {
            ...mockData.data,
            enhanced: true,
            multiAgent: true,
            templateSelection: "original-mock-data",
            workflow: "mock-data-direct",
          },
        });
      } catch (mockError) {
        console.error("❌ Error processing mock data:", mockError);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to process mock data with multi-agent workflow",
          },
          { status: 500 }
        );
      }
    }

    // Use multi-agent workflow for presentation generation
    if (useMultiAgent) {
      console.log("🤖 Using Mastra Workflow for presentation generation");

      try {
        let result;
        let workflowType;

        // Use basic presentation workflow (simplified and working)
        console.log("🔄 Using Basic Presentation Workflow");
        const workflow = mastra.getWorkflow("presentationWorkflow");
        const run = await workflow.createRunAsync();
        result = await run.start({ inputData: body });
        workflowType = "presentation-workflow";

        console.log("✅ Mastra workflow presentation generated successfully");
        console.log(
          "📊 Workflow result structure:",
          JSON.stringify(result, null, 2)
        );

        // Extract the actual result from the workflow response
        const actualData = (result as any).result || result;

        return NextResponse.json({
          success: true,
          data: actualData,
          enhanced: true,
          multiAgent: true,
          templateSelection: "intelligent-mastra-workflow",
          workflow: workflowType,
        });
      } catch (agentError) {
        console.error("❌ Mastra workflow failed:", agentError);

        // Simple fallback - return error with helpful message
        return NextResponse.json(
          {
            success: false,
            error:
              "Presentation generation failed. Please try again or contact support.",
            details:
              agentError instanceof Error
                ? agentError.message
                : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    // Final fallback - return error if no workflow succeeded
    console.log("❌ All presentation generation methods failed");
    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to generate presentation. Please check your input data and try again.",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("❌ Error in multi-agent presentation generation:", error);
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

// Process mock data with Mastra workflow
async function processMockDataWithMastraWorkflow(mockData: any) {
  try {
    console.log("🔄 Processing mock data with Mastra workflow");

    // Use the basic presentation workflow for mock data
    const workflow = mastra.getWorkflow("presentationWorkflow");
    const run = await workflow.createRunAsync();

    // Create input data from mock data
    const inputData = {
      title: mockData.data.title || "Mock Presentation",
      company: mockData.data.company || "Mock Company",
      // Add any other relevant data from mockData
      ...mockData.data,
    };

    const result = await run.start({ inputData });

    console.log("✅ Mock data processed with Mastra workflow");
    return (result as any).slides || result;
  } catch (error) {
    console.error("❌ Error processing mock data with Mastra workflow:", error);
    console.log("🔄 Falling back to original mock data");
    return mockData.data.slides; // Return original slides as fallback
  }
}
