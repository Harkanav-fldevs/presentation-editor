"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePresentationStore } from "@/stores/presentation-store";
import { useRouter } from "next/navigation";
import type { PresentationInput } from "@/lib/presentation-types";
import result from "../../extras/result.json";

export default function HomePage() {
  const [jsonInput, setJsonInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [useMockData, setUseMockData] = useState(false);
  const { setPresentation } = usePresentationStore();
  const router = useRouter();
  const response = result;

  const handleGenerate = async () => {
    if (!useMockData && !jsonInput.trim()) {
      setError("Please enter JSON content");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      let requestBody;

      if (useMockData) {
        // Use mock data - no JSON input needed
        requestBody = { useMockData: true };
      } else {
        // Parse JSON to validate format, but don't enforce specific structure
        const parsedInput = JSON.parse(jsonInput);
        requestBody = { ...parsedInput, useMockData: false };
      }

      const response = await fetch("/api/presentations/multi-agent-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...requestBody,
          useMultiAgent: true,
          useFallback: true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPresentation(result.data);
        router.push("/preview");
      } else {
        console.log("❌ API returned error:", result.error);
        setError(result.error || "Failed to generate presentation");
      }

      // const result = mockAIResponse;
      // setPresentation(result.data as any);
      // router.push("/preview");
    } catch (err) {
      setError("Invalid JSON format or generation failed");
      console.error("Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const marketingMixJSON = {
    title: "Marketing Mix Analysis",
    marketing_mix: {
      product: 40,
      price: 25,
      place: 20,
      promotion: 15,
    },
    budget_allocation: {
      "LinkedIn Advertising": 25,
      "Content Marketing": 20,
      Webinars: 15,
      "Email Marketing": 10,
      ABM: 15,
      Partnerships: 10,
      Demos: 5,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mastra Workflow AI Presentation Generator
          </h1>
          <p className="text-xl text-gray-600">
            Transform any JSON data into professional presentations using
            intelligent Mastra workflows with multi-agent AI
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by Mastra workflow control flow patterns with specialized
            content generation and template selection agents
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>JSON Input</CardTitle>
              <CardDescription>
                Enter any JSON data - the AI will intelligently create a
                presentation from it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useMockData"
                  checked={useMockData}
                  onChange={(e) => setUseMockData(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="useMockData" className="text-sm font-medium">
                  Use Mock Data (jsonresult.json)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  JSON Data{" "}
                  {useMockData && (
                    <span className="text-gray-500">
                      (disabled when using mock data)
                    </span>
                  )}
                </label>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={
                    useMockData
                      ? "Mock data will be used instead"
                      : "Enter any JSON data here... (company data, metrics, content, etc.)"
                  }
                  className="min-h-[300px] max-h-[500px] overflow-y-auto font-mono text-sm"
                  disabled={useMockData}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating
                  ? "Mastra Workflow AI Generating..."
                  : useMockData
                  ? "Load Mock Presentation (Mastra Workflow)"
                  : "Generate with Mastra Workflow AI"}
              </Button>

              <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                🔄 Mastra Workflow System Active: Sequential Steps + Parallel
                Processing + Conditional Logic
              </div>
            </CardContent>
          </Card>

          {/* Sample Section */}
          <Card>
            <CardHeader>
              <CardTitle>Sample JSON</CardTitle>
              <CardDescription>
                Example of company data that the AI can transform into a
                presentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-[400px]">
                {JSON.stringify(sampleJSON, null, 2)}
              </pre>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() =>
                  setJsonInput(JSON.stringify(sampleJSON, null, 2))
                }
              >
                Use Sample JSON
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() =>
                  setJsonInput(JSON.stringify(marketingMixJSON, null, 2))
                }
              >
                Use Marketing Mix JSON (with Charts)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">🔄</div>
                <h3 className="font-semibold mb-2">Mastra Workflows</h3>
                <p className="text-gray-600">
                  Uses Mastra workflow control flow patterns with sequential
                  steps, parallel processing, and conditional logic
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">✏️</div>
                <h3 className="font-semibold mb-2">Rich Editor</h3>
                <p className="text-gray-600">
                  Edit and customize your slides with our powerful Tiptap editor
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">📤</div>
                <h3 className="font-semibold mb-2">Export Options</h3>
                <p className="text-gray-600">
                  Export your presentations as PDF, HTML, or PowerPoint files
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const sampleJSON = {
  success: true,
  combinedData: {
    strategy: {
      id: "a786c665-f940-487e-8720-879028049d05",
      workspaceId: "8ca208e9-d265-462d-9673-5afc5a8ae61a",
      status: "complete",
      completionPercentage: 75,
      version: 2,
      isActive: true,
      swotAnalysis: {
        strengths: [
          "Strong integration of advanced analytics and automation within one platform for Indian enterprises",
          "User-friendly data upload & dashboard creation (low IT friction)",
          "Agile team size for fast adaptation to market needs",
          "Relevant case studies/persona targeting in India-focused sectors",
        ],
        weaknesses: [
          "Limited brand awareness compared to established competitors (e.g., Yellow.ai, Uniphore)",
          "Small marketing team (2-5 people) constrains campaign scale",
          "Lack of deep multi-industry testimonials (especially public sector or global MNCs)",
          "Product onboarding may still face friction for large and traditional organizations",
        ],
        opportunities: [
          "Indian enterprise digital transformation wave (BFSI, healthcare, manufacturing, retail)",
          "Competitor reliance on chat/voice AI leaves a niche for deep analytics process automation",
          "Integration-compliant with India-focused tech stacks (Tally, Zoho, local ERPs)",
          "Partnership opportunity with ERP/CRM vendors and local SI/channel partners",
        ],
        threats: [
          "Large AI incumbents investing in India/Asia",
          "Security or regulatory requirements in sensitive verticals (finance, healthcare)",
          "Commoditization of dashboard and AI analytics tools",
          "Competitor trajectory towards bundled AI/automation suites",
        ],
      },
      brandStory: {
        hero: "Indian enterprise decision-makers (e.g., IT Heads, Operations, Directors) striving for digital transformation and efficiency.",
        problem:
          "Fragmented, manual business processes block timely insights and productivity—causing slow decisions, costly errors, and low tool adoption across teams.",
        solution:
          "MI PAL's AI assistant seamlessly unifies analysis, dashboards, and workflow automation across multiple Indian business systems—enabling fast, accurate, and scalable decisions, all through accessible, no-code interfaces.",
        success:
          "Enterprises achieve rapid digital transformation with operational agility, better compliance, reduced manual effort, and empowered teams, becoming industry benchmarks for efficiency and innovation.",
      },
      marketingMix: {
        channels: [
          "LinkedIn (organic & paid)",
          "Account-Based Marketing (ABM)/sales outreach",
          "Industry-specific webinars (Indian BFSI, healthcare, retail)",
          "Content marketing (blogs, whitepapers, ROI calculators)",
          "Email nurturing sequences",
          "Channel/partner co-marketing",
          "Selective industry events & conferences (e.g., NASSCOM, CII)",
        ],
        tactics: [
          "Targeted LinkedIn campaigns for key buyer personas (filtered for Indian mid-large company titles)",
          "Create sector-relevant case studies and interactive ROI tools for BFSI, healthcare, manufacturing",
          "Host educational webinars with integration/demo focus tied to local Indian tech stacks",
          "Launch ABM/email cadences for target Indian accounts (CXO, Heads of IT/Ops)",
          "Develop translations/local content variants as needed (EN+regional for India)",
          "Set up partnerships with SI/channel/ERP vendors to extend reach",
          "Leverage reviews/testimonials from pilot users with clear business outcomes",
        ],
        budgetAllocation: {
          "LinkedIn Advertising": 25,
          "Content Marketing & SEO": 20,
          "Webinars & Industry Events": 15,
          "Email Marketing & Nurture": 10,
          "ABM/Outbound": 15,
          "Partnership/Channel Enablement": 10,
          "Product Demos/Workshops": 5,
          Other: 0,
        },
      },
      targetAudience: {
        demographics: {
          jobTitles: [
            "VP Operations",
            "Head of IT & Digital Transformation",
            "CIO",
            "Administrative Director",
          ],
          industries: [
            "Financial Services",
            "Manufacturing",
            "Healthcare",
            "Retail",
          ],
          seniority: ["Director", "VP", "Head", "CIO, CTO"],
          companySize: "200-4500 employees",
          location: "India",
          educationLevels: ["B.Tech", "MBA", "M.Tech", "Postgraduate"],
        },
        psychographics: {
          values: [
            "Efficiency",
            "Compliance",
            "Data-Driven",
            "Operational Improvement",
          ],
          motivations: [
            "Automate manual data and reporting processes",
            "Streamline cross-functional workflows",
            "Quick actionable decision-making",
            "Ensure regulatory compliance",
          ],
          frustrations: [
            "Fragmented data and tools",
            "Manual & slow reporting",
            "Limited IT bandwidth",
            "Low adoption of analytics tools",
          ],
          personalityTraits: [
            "Analytical",
            "Collaborative",
            "Goal-oriented",
            "Change Agent",
          ],
        },
        painPoints: [
          "Delayed or manual reporting impedes decisions",
          "Multiple disconnected systems",
          "Slow onboarding and user adoption",
          "Compliance and audit friction due to manual data",
          "Difficulty scaling analytics with limited resources",
        ],
      },
      implementationRoadmap: [
        {
          phase: "Foundation (Weeks 1-3)",
          tasks: [
            "Persona & ICP alignment for ABM lists",
            "Establish core content calendar (case studies, ROI tools)",
            "Set up LinkedIn campaigns and website tracking",
            "Internal workflow audit for automation priorities",
          ],
          timeline: "Weeks 1-3",
        },
        {
          phase: "Engagement (Weeks 4-8)",
          tasks: [
            "Execute LinkedIn and ABM/email outreach",
            "Launch sector-focused webinars and demo series",
            "Start partner/channel co-marketing pilots",
            "Gather early pilot case studies/testimonials",
          ],
          timeline: "Weeks 4-8",
        },
        {
          phase: "Optimization (Weeks 9-12)",
          tasks: [
            "A/B test paid and organic content for top lead drivers",
            "Deepen nurturing streams (webinar follow-ups, product tours)",
            "Refine onboarding/support flows to reduce friction",
            "Standardize two partnership/integration rollouts",
          ],
          timeline: "Weeks 9-12",
        },
        {
          phase: "Scale (Quarter 2)",
          tasks: [
            "Expand regional/localization content for further Indian states",
            "Widen ABM/partner targets based on Q1 results",
            "Annualize and syndicate best-performing content/case studies",
          ],
          timeline: "Next 90 days (Q2)",
        },
      ],
      aiConfidenceScore: 90,
      lastUpdatedStep: 1,
      createdAt: "2025-09-04T11:08:00.731Z",
      updatedAt: "2025-09-17T10:06:05.857Z",
    },
    personas: [
      {
        id: "4c639324-6018-4153-b0db-4bd456f15e85",
        workspaceId: "8ca208e9-d265-462d-9673-5afc5a8ae61a",
        strategyId: null,
        name: "Amit Mehra",
        title: "IT Manager",
        isPrimary: false,
        demographics: {
          ageRange: "32-40",
          gender: "Male",
          location: "Pune, India",
          education: "B.Tech, Computer Science",
          income: "$35,000-$50,000",
          jobTitle: "IT Manager",
          industry: "Manufacturing",
          companySize: "350",
        },
        psychographics: {
          values: ["Practical innovation", "Stability", "Security", "Learning"],
          motivations: [
            "Automate routine tasks",
            "Empower business users",
            "Reduce IT support tickets",
          ],
          frustrations: [
            "Limited team bandwidth",
            "Fragmented tech stack",
            "User resistance to change",
          ],
          personality: [
            "Hands-on",
            "Patient",
            "Problem-solver",
            "Tech enthusiast",
          ],
          interests: ["Automation tools", "Cloud migrations", "User training"],
          lifestyle: [
            "Regular work schedule",
            "Online upskilling courses",
            "Family responsibilities",
          ],
        },
        painPoints: [
          "Multiple business units use different systems—data consolidation is a big hurdle",
          "Reporting requests overload a small IT team",
          "Adoption of modern tools is slow due to user reluctance and limited resources",
        ],
        goals: [
          "Integrate data sources with minimal custom development",
          "Implement self-service dashboards for non-technical users",
          "Minimize IT intervention in generating reports and analytics",
        ],
        behaviors: {
          preferredChannels: [
            "Tech blogs",
            "YouTube tutorials",
            "LinkedIn Groups",
            "Vendor technical webinars",
          ],
          contentPreferences: [
            "How-to guides",
            "Integration documentation",
            "API references",
            "Proof-of-concept walkthroughs",
          ],
          decisionMakingProcess:
            "Evaluates solutions hands-on, pilots with a small team, and recommends vendors to decision makers based on integrations and support.",
          buyingTriggers: [
            "Spike in manual reporting",
            "Management push for cross-departmental insights",
            "New regulatory requirements",
          ],
          deviceUsage: [
            "Workstation at office",
            "Smartphone for notifications",
            "Cloud consoles",
          ],
        },
        story:
          "Amit is responsible for supporting business users across production, procurement, and inventory. He fields daily requests for data exports and troubleshooting. He knows automation will save time, but solutions must be cloud-based and easy to manage given his small team and non-technical business users.",
        quote:
          "If users can pull the reports themselves rather than rely on IT, our team will finally get ahead of our project backlog.",
        imageUrl: null,
        aiConfidenceScore: null,
        aiGeneratedFields: null,
        createdAt: "2025-09-17T09:18:01.001Z",
        updatedAt: "2025-09-17T09:18:01.001Z",
      },
      {
        id: "8fda2c83-5a93-41ad-973c-20fe1a6f28d0",
        workspaceId: "8ca208e9-d265-462d-9673-5afc5a8ae61a",
        strategyId: null,
        name: "Priya Kulkarni",
        title: "Head of Operations",
        isPrimary: false,
        demographics: {
          ageRange: "38-45",
          gender: "Female",
          location: "Mumbai, India",
          education: "MBA, Operations Management",
          income: "$40,000-$60,000/year",
          jobTitle: "Head of Operations",
          industry: "Retail",
          companySize: "200-600 employees",
        },
        psychographics: {
          values: ["Efficiency", "Accountability", "Continuous Improvement"],
          motivations: [
            "Streamlining store operations",
            "Reducing manual errors",
            "Visibility into performance metrics",
          ],
          frustrations: [
            "Slow manual reporting",
            "Fragmented data sources",
            "Delayed responses to market trends",
          ],
          personality: ["Analytical", "Process-oriented", "Pragmatic"],
          interests: [
            "Retail innovation",
            "Emerging tech",
            "Operational best practices",
          ],
          lifestyle: [
            "Busy weekdays",
            "Family-focused weekends",
            "Occasional travel",
          ],
        },
        painPoints: [
          "Unable to get real-time operational transparency",
          "Manual data entry is prone to errors and delays",
          "Trouble aligning store teams due to disconnected workflows",
        ],
        goals: [
          "Automate daily and weekly reporting",
          "Enable faster responses to inventory fluctuations and sales trends",
          "Simplify coordination across branch locations",
        ],
        behaviors: {
          preferredChannels: [
            "Email",
            "WhatsApp Business",
            "Webinars",
            "Industry conferences",
          ],
          contentPreferences: [
            "Case studies",
            "Demo videos",
            "How-to guides",
            "ROI calculator tools",
          ],
          decisionMakingProcess:
            "Gathers input from store managers and IT manager, pilots new technologies, seeks cost-benefit justification before presenting to the management committee.",
          buyingTriggers: [
            "Demonstrated reduction in manual effort",
            "Integration with existing systems",
            "Quick time-to-value",
          ],
          deviceUsage: ["Laptop", "Mobile phone", "Tablet (for field visits)"],
        },
        story:
          "Priya supervises daily operations across multiple retail branches. Her teams juggle inventory, sales reconciliation, and reporting—much of which happens manually. She's actively looking for reliable automation to free up managers for customer engagement and strategic tasks.",
        quote:
          "If I could close the books, see my store KPIs, and spot supply issues in real-time, I'd sleep a lot better.",
        imageUrl: null,
        aiConfidenceScore: null,
        aiGeneratedFields: null,
        createdAt: "2025-09-17T09:19:42.793Z",
        updatedAt: "2025-09-17T09:19:42.793Z",
      },
      {
        id: "21820af6-a6dd-4b5b-b51e-dc726d88f894",
        workspaceId: "8ca208e9-d265-462d-9673-5afc5a8ae61a",
        strategyId: null,
        name: "Sonal Mehta",
        title: "Head of Digital Strategy",
        isPrimary: true,
        demographics: {
          ageRange: "34-44",
          gender: "Female",
          location: "Mumbai, India",
          education: "MBA, Digital Marketing certification",
          income: "$50K-$60K",
          jobTitle: "Head of Digital Strategy",
          industry: "Retail",
          companySize: "850 employees",
        },
        psychographics: {
          values: [
            "Agility",
            "Customer-centricity",
            "Innovation",
            "Scalability",
          ],
          motivations: [
            "Unified view of customer data",
            "Rapid adjustments to consumer trends",
            "Scaling digital initiatives with lean resources",
          ],
          frustrations: [
            "Fragmented customer insights across ecommerce, POS, and CRM",
            "Siloed task automation projects",
            "Limited self-service analytics for business teams",
          ],
          personality: [
            "Visionary",
            "Action-oriented",
            "Collaborative",
            "Fast learner",
          ],
          interests: [
            "Omnichannel retail",
            "Analytics automation",
            "Social media insights",
          ],
          lifestyle: [
            "Frequent industry event attendee",
            "Time-limited but tech-savvy",
          ],
        },
        painPoints: [
          "Difficulty in unifying in-store, online, and CRM data for strategy planning",
          "Teams rely on outdated manual processes to track campaign results",
          "Lack of automation in regular reporting for category managers",
        ],
        goals: [
          "Aggregate data from all retail channels into actionable dashboards",
          "Empower functional teams with self-service analytics",
          "React quickly to emerging consumer behaviors",
        ],
        behaviors: {
          preferredChannels: [
            "LinkedIn",
            "Twitter",
            "Tech podcasts",
            "Networking at events",
          ],
          contentPreferences: [
            "Trend reports",
            "Best practice guides",
            "Short video explainers",
            "Interactive webinars",
          ],
          decisionMakingProcess:
            "Pilot programs with clear KPIs; involves IT and marketing leads to validate fit and champion roll-out.",
          buyingTriggers: [
            "Fast-to-deploy integrations",
            "Success stories from similar retailers",
            "Vendor support for onboarding",
          ],
          deviceUsage: ["Laptop", "Smartphone"],
        },
        story:
          "Sonal leads the omnichannel digital strategy for a leading fashion retailer. She's building a customer-data-driven culture but faces internal resistance to new workflows. She's scouting for platforms that offer fast wins and empower her team to act on fresh insights.",
        quote:
          "We want actionable insights, not more spreadsheets. Every team should move at consumer speed.",
        imageUrl: null,
        aiConfidenceScore: null,
        aiGeneratedFields: null,
        createdAt: "2025-09-17T10:06:05.847Z",
        updatedAt: "2025-09-17T10:06:11.593Z",
      },
    ],
    competitors: [
      {
        id: "1003dd23-9f62-4bf7-b184-0d2856292103",
        workspaceId: "5a1c92b0-52b0-4f08-8e5b-edfd66dff11b",
        name: "Hootsuite",
        url: "https://www.hootsuite.com/",
        manualNotes:
          "Hootsuite is an established global SaaS platform focused on social media management. While strong in multi-channel scheduling and analytics, its AI-driven strategy features are less tailored to small B2B marketing teams, and it offers limited localization for the Swedish market.",
        scrapedData: {
          contentTopics: [
            "social media scheduling",
            "analytics and reporting",
            "team collaboration tools",
            "automation for social marketers",
            "industry trends",
          ],
          adKeywords: [
            "social media management",
            "scheduling tool",
            "social analytics",
            "B2B marketing tools",
            "team collaboration for marketing",
          ],
          postingFrequency: "2-3 blog posts/week, daily LinkedIn updates",
        },
        lastScrapedAt: "2025-09-04T11:00:00.000Z",
        analysisScore: 80,
        threatLevel: "high",
        createdAt: "2025-09-04T11:33:01.160Z",
        updatedAt: "2025-09-04T11:33:01.160Z",
      },
      {
        id: "63f64978-3a3b-40d2-8e8f-ae9225fd65ea",
        workspaceId: "5a1c92b0-52b0-4f08-8e5b-edfd66dff11b",
        name: "Sprout Social",
        url: "https://sproutsocial.com/",
        manualNotes:
          "Sprout Social is a key global competitor present in the Nordics, increasingly attractive to Swedish SMBs for social media and basic automation, but lacks the full AI-driven continuous optimization and onboarding support Gemoniq offers.",
        scrapedData: {
          contentTopics: [
            "social publishing workflows",
            "social analytics",
            "collaboration tools for teams",
            "customer engagement tactics",
          ],
          adKeywords: [
            "social media management Sweden",
            "team marketing automation",
            "Swedish SaaS marketing",
          ],
          postingFrequency: "2-3 blog posts/week, regular LinkedIn posts",
        },
        lastScrapedAt: "2025-09-04T11:03:00.000Z",
        analysisScore: 75,
        threatLevel: "high",
        createdAt: "2025-09-04T11:33:01.160Z",
        updatedAt: "2025-09-04T11:33:01.160Z",
      },
      {
        id: "c56208c3-05b3-4e6f-b36e-2c9212283e96",
        workspaceId: "5a1c92b0-52b0-4f08-8e5b-edfd66dff11b",
        name: "Planhat",
        url: "https://www.planhat.com/",
        manualNotes:
          "Stockholm-based Planhat specializes in customer success automation and engagement analytics for SaaS teams, strong local reputation. Directly relevant for SMBs in Sweden focused on reducing churn and integrating marketing and CS data.",
        scrapedData: {
          contentTopics: [
            "customer onboarding automation",
            "churn reduction strategies",
            "integrations (CRM, marketing)",
            "customer data analytics",
          ],
          adKeywords: [
            "customer success automation Sweden",
            "SaaS onboarding tools",
            "churn reduction Sweden",
          ],
          postingFrequency: "1-2 blog posts/month, active LinkedIn engagement",
        },
        lastScrapedAt: "2025-09-04T11:04:00.000Z",
        analysisScore: 72,
        threatLevel: "high",
        createdAt: "2025-09-04T11:33:01.160Z",
        updatedAt: "2025-09-04T11:33:01.160Z",
      },
      {
        id: "c187425a-cd44-450e-b60e-83c58ba2d185",
        workspaceId: "5a1c92b0-52b0-4f08-8e5b-edfd66dff11b",
        name: "Upsales",
        url: "https://www.upsales.com/",
        manualNotes:
          "Swedish SaaS company serving SMBs with marketing automation and CRM. Not AI-first but offers integration and campaign management with local support, established trust in Sweden's B2B SaaS scene.",
        scrapedData: {
          contentTopics: [
            "marketing automation",
            "CRM integration",
            "pipeline management",
            "B2B sales and marketing alignment",
          ],
          adKeywords: [
            "marketing automation Sweden",
            "CRM for Swedish SaaS",
            "B2B marketing SMB Sweden",
          ],
          postingFrequency: "1-2 blog posts/month, frequent LinkedIn posts",
        },
        lastScrapedAt: "2025-09-04T11:06:00.000Z",
        analysisScore: 70,
        threatLevel: "medium",
        createdAt: "2025-09-04T11:33:01.160Z",
        updatedAt: "2025-09-04T11:33:01.160Z",
      },
      {
        id: "bdc9cbb9-a619-4308-8873-eae90f756f81",
        workspaceId: "5a1c92b0-52b0-4f08-8e5b-edfd66dff11b",
        name: "Dataciph",
        url: "https://dataciph.com",
        manualNotes:
          "Focused on AI-powered data analytics and intelligence, Dataciph offers automation for marketing but has limited brand presence and unclear traction in Sweden, especially among SMBs; seems more analytics-driven than holistic marketing automation.",
        scrapedData: {
          contentTopics: [
            "AI analytics for marketing",
            "data-driven optimization",
            "automation for digital campaigns",
            "MarTech integrations",
          ],
          adKeywords: [
            "marketing analytics AI",
            "campaign optimization Sweden",
            "Swedish SMB marketing tools",
          ],
          postingFrequency: "1 blog post/month, sporadic LinkedIn activity",
        },
        lastScrapedAt: "2025-09-04T11:02:00.000Z",
        analysisScore: 55,
        threatLevel: "medium",
        createdAt: "2025-09-04T11:33:01.160Z",
        updatedAt: "2025-09-04T11:33:01.160Z",
      },
    ],
    idealCustomerProfiles: [
      {
        id: "9ca29ce6-4ece-4824-890d-1b22a7683874",
        workspaceId: "8ca208e9-d265-462d-9673-5afc5a8ae61a",
        name: "SMB to Mid-Market Indian Enterprises in Retail, Healthcare, and Manufacturing",
        profileType: "b2b",
        segments: ["Retail", "Healthcare", "Manufacturing"],
        pains: [
          "Lack of integrated data systems causing fragmented operational visibility",
          "Manual and error-prone reporting and analytics processes",
          "Difficulty in adapting to fast-changing market demands with timely insights",
          "Limited IT resources hindering adoption of advanced analytics tools",
          "Challenges in automating cross-departmental workflows for efficiency",
        ],
        useCases: [
          "Automate generation of operational dashboards and performance reports",
          "Aggregate and analyze data from sales, inventory, and supply chain systems",
          "Streamline routine data entry and reporting tasks to reduce manual effort",
          "Enable data-driven decision making to respond quickly to market changes",
          "Create interactive dashboards tailored to different business units",
        ],
        budgetRange: "$10K-65K",
        triggers: [
          "Implementation of digital transformation projects",
          "Need to improve operational efficiency and reduce costs",
          "Adoption of new regulatory or compliance data requirements",
          "Scalability challenges with existing manual reporting",
          "Transition from legacy software to modern analytics platforms",
        ],
        completeness: 100,
        isDefault: true,
        firmographics: {
          industry: "Retail, Healthcare, and Manufacturing",
          geography: "India",
          companyType: "SMB to Mid-Market",
          revenueRange: "$5M-$100M",
          employeeRange: "50-1000",
        },
        techStack: [
          "ERP systems (e.g., Tally, Zoho Books)",
          "CRM platforms (e.g., Zoho CRM, Freshsales)",
          "Cloud storage solutions (e.g., Google Drive, AWS S3)",
          "Business Intelligence tools (e.g., Microsoft Power BI, Google Data Studio)",
          "Workflow automation tools (e.g., Zapier, Microsoft Power Automate)",
        ],
        demographics: {
          gender: "",
          ageRange: "",
          location: "",
          education: "",
          incomeRange: "",
          familyStatus: "",
        },
        psychographics: {
          values: [],
          interests: [],
          lifestyle: [],
          personality: [],
        },
        channels: [],
        endUserConsiderations: {
          endUserPains: [],
          endUserChannels: [],
          endUserSegments: [],
        },
        createdAt: "2025-09-02T08:27:11.726Z",
        updatedAt: "2025-09-03T05:35:19.607Z",
      },
      {
        id: "606b785e-c3f8-4015-80f3-489ee737d674",
        workspaceId: "8ca208e9-d265-462d-9673-5afc5a8ae61a",
        name: "SMB to Mid-Market Indian Enterprises in Retail, Healthcare, and Manufacturing",
        profileType: "b2b",
        segments: ["Retail", "Healthcare", "Manufacturing"],
        pains: [
          "Lack of integrated data systems causing fragmented operational visibility",
          "Manual and error-prone reporting and analytics processes",
          "Difficulty in adapting to fast-changing market demands with timely insights",
          "Limited IT resources hindering adoption of advanced analytics tools",
          "Challenges in automating cross-departmental workflows for efficiency",
        ],
        useCases: [
          "Automate generation of operational dashboards and performance reports",
          "Aggregate and analyze data from sales, inventory, and supply chain systems",
          "Streamline routine data entry and reporting tasks to reduce manual effort",
          "Enable data-driven decision making to respond quickly to market changes",
          "Create interactive dashboards tailored to different business units",
        ],
        budgetRange: "$10K-75K",
        triggers: [
          "Implementation of digital transformation projects",
          "Need to improve operational efficiency and reduce costs",
          "Adoption of new regulatory or compliance data requirements",
          "Scalability challenges with existing manual reporting",
          "Transition from legacy software to modern analytics platforms",
        ],
        completeness: 100,
        isDefault: false,
        firmographics: {
          industry: "Retail, Healthcare, and Manufacturing",
          geography: "India",
          companyType: "SMB to Mid-Market",
          revenueRange: "$5M-$100M",
          businessModel: "B2B",
          employeeRange: "50-1000",
        },
        techStack: [
          "ERP systems (e.g., Tally, Zoho Books)",
          "CRM platforms (e.g., Zoho CRM, Freshsales)",
          "Cloud storage solutions (e.g., Google Drive, AWS S3)",
          "Business Intelligence tools (e.g., Microsoft Power BI, Google Data Studio)",
          "Workflow automation tools (e.g., Zapier, Microsoft Power Automate)",
        ],
        demographics: null,
        psychographics: null,
        channels: null,
        endUserConsiderations: null,
        createdAt: "2025-09-02T08:27:07.499Z",
        updatedAt: "2025-09-02T08:27:07.499Z",
      },
      {
        id: "95940c54-9517-4e08-9a55-fb96b3ce3dcb",
        workspaceId: "8ca208e9-d265-462d-9673-5afc5a8ae61a",
        name: "Mid-Large Indian Enterprises in Technology and Data-Intensive Sectors",
        profileType: "b2b",
        segments: [
          "Information Technology",
          "Financial Services",
          "E-commerce",
          "Telecommunications",
        ],
        pains: [
          "Difficulty consolidating data from multiple business systems for timely insights",
          "Inefficient manual data processing and reporting workflows",
          "Low user adoption of existing analytics tools",
          "Slow decision-making due to lack of real-time analytics",
          "Churn risks from inadequate onboarding and support processes",
        ],
        useCases: [
          "Automate generation of charts and dashboards from uploaded files",
          "Analyze cross-system business data for actionable insights",
          "Build interactive dashboards for different departments",
          "Automate routine data processing and customer support workflows",
          "Enhance data-driven decision-making at enterprise level",
        ],
        budgetRange: {
          max: 200000,
          min: 50000,
          currency: "USD",
        },
        triggers: [
          "Enterprise digital transformation initiatives",
          "Need to reduce operational costs and improve efficiency",
          "Implementation of new data governance policies",
          "Renewal or replacement of legacy BI and analytics platforms",
          "Expansion into new business units or markets requiring scalable analytics",
        ],
        completeness: 100,
        isDefault: false,
        firmographics: {
          industry: "Technology and Data-Driven Enterprises",
          geography: "India",
          companyType: "Mid-market to Large Enterprise",
          revenueRange: "$20M-$500M",
          businessModel: "B2B",
          employeeRange: "200-5000",
        },
        techStack: [
          "ERP systems (e.g., SAP, Oracle)",
          "CRM platforms (e.g., Salesforce)",
          "Cloud storage (e.g., AWS S3, Azure Blob)",
          "Business Intelligence tools (e.g., Tableau, Power BI)",
          "Data integration platforms (e.g., Informatica)",
        ],
        demographics: null,
        psychographics: null,
        channels: null,
        endUserConsiderations: null,
        createdAt: "2025-09-01T11:50:12.145Z",
        updatedAt: "2025-09-01T11:50:12.145Z",
      },
    ],
    goals: [
      {
        id: "20da60a8-96a7-4ddd-9c5d-1cf42e8a89c3",
        workspaceId: "8ca208e9-d265-462d-9673-5afc5a8ae61a",
        strategyId: "5db51d15-29a0-4f02-bb27-2214107ec5c1",
        goal: "Launch two new Indian market-specific use cases and publish at least three localized case studies featuring top enterprise customers.",
        metric: "Number of localized use cases and case studies published.",
        timeline: "Within 9 months.",
        target: "2 new use cases and 3 case studies published.",
        priority: "medium",
        status: "active",
        progress: 0,
        category: "brand_awareness",
        dueDate: null,
        createdAt: "2025-09-01T12:55:45.808Z",
        updatedAt: "2025-09-01T12:55:45.808Z",
        businessGoalRef: null,
        alignmentRationale: null,
        createdBy: "6bd6f6be-6123-4830-bad7-aeca2a208dfc",
        isActive: true,
      },
      {
        id: "6d74f220-5a60-4305-b9ca-1c849d4ea167",
        workspaceId: "8ca208e9-d265-462d-9673-5afc5a8ae61a",
        strategyId: "5db51d15-29a0-4f02-bb27-2214107ec5c1",
        goal: "Increase customer onboarding capacity and reduce enterprise onboarding time by 30% by hiring and training a dedicated Indian enterprise onboarding team.",
        metric:
          "Reduction in average onboarding time and number of new hires trained.",
        timeline: "Within 6 months.",
        target:
          "Hire and train at least 4 onboarding specialists; reduce average onboarding time by 30%.",
        priority: "high",
        status: "active",
        progress: 0,
        category: "customer_retention",
        dueDate: null,
        createdAt: "2025-09-01T12:55:45.804Z",
        updatedAt: "2025-09-01T12:55:45.804Z",
        businessGoalRef: null,
        alignmentRationale: null,
        createdBy: "6bd6f6be-6123-4830-bad7-aeca2a208dfc",
        isActive: true,
      },
      {
        id: "60d8ba59-ba11-4cd0-b4a2-d677efa42a62",
        workspaceId: "8ca208e9-d265-462d-9673-5afc5a8ae61a",
        strategyId: "5db51d15-29a0-4f02-bb27-2214107ec5c1",
        goal: "Integrate MIPAL with at least three additional major Indian ERP/legacy systems and secure 5 new large enterprise clients through these integrations.",
        metric:
          "Number of new integrations completed and number of new enterprise clients acquired via these integrations.",
        timeline: "Within 12 months.",
        target: "3 new ERP/legacy integrations and 5 new enterprise clients.",
        priority: "high",
        status: "active",
        progress: 0,
        category: "lead_generation",
        dueDate: null,
        createdAt: "2025-09-01T12:55:45.799Z",
        updatedAt: "2025-09-01T12:55:45.799Z",
        businessGoalRef: null,
        alignmentRationale: null,
        createdBy: "6bd6f6be-6123-4830-bad7-aeca2a208dfc",
        isActive: true,
      },
    ],
    keyResults: [
      {
        id: "0f64a759-ba0d-404b-9117-1fdbb39b50a8",
        goalId: "20da60a8-96a7-4ddd-9c5d-1cf42e8a89c3",
        name: "Increase website conversion rates from organic traffic. ",
        baseline: "0.00",
        target: "100.00",
        current: "0.00",
        unit: "users",
        rationale: null,
        metricSource: null,
        progress: 0,
        period: "Q3 2025",
        metric: "Increase website conversion rates from organic traffic. ",
        dueDate: null,
        status: "active",
        createdAt: "2025-09-05T11:34:12.101Z",
        updatedAt: "2025-09-05T11:34:12.101Z",
      },
    ],
    initiatives: [
      {
        id: "3507bb2c-4632-4ce0-a862-01f302f03457",
        keyResultId: "0f64a759-ba0d-404b-9117-1fdbb39b50a8",
        productId: null,
        title: "Social Media Content Campaign",
        hypothesis:
          "Creating daily LinkedIn content with industry insights will increase brand visibility and generate 40% more qualified leads through organic reach",
        iceScore: null,
        ownerId: "6bd6f6be-6123-4830-bad7-aeca2a208dfc",
        status: "planned",
        startDate: null,
        endDate: null,
        swotCategory: "opportunity",
        skillRequirements: null,
        createdAt: "2025-09-30T08:08:14.730Z",
        updatedAt: "2025-09-30T08:08:14.730Z",
      },
    ],
  },
  metadata: {
    totalRecords: {
      strategy: 1,
      personas: 3,
      competitors: 5,
      idealCustomerProfiles: 3,
      goals: 3,
      keyResults: 1,
      initiatives: 1,
    },
    createdAt: "2025-01-27T12:00:00.000Z",
    version: "1.0",
  },
};

const mockAIResponse = {
  success: true,
  data: {
    title: "Strategic Overview for Indian Enterprises",
    slides: [
      {
        id: "slide-1-strengths",
        title: "Strengths",
        content:
          "- Strong integration of advanced analytics and automation within one platform for Indian enterprises.\n- User-friendly data upload & dashboard creation (low IT friction).\n- Agile team size for fast adaptation to market needs.\n- Relevant case studies/persona targeting in India-focused sectors.",
        type: "content",
        order: 1,
        template: "strengths",
        templateData: {
          strengths: [
            "Strong integration of advanced analytics and automation within one platform for Indian enterprises.",
            "User-friendly data upload & dashboard creation (low IT friction).",
            "Agile team size for fast adaptation to market needs.",
            "Relevant case studies/persona targeting in India-focused sectors.",
          ],
        },
      },
      {
        id: "slide-1-weaknesses",
        title: "Weaknesses",
        content:
          "- Limited brand awareness compared to established competitors (e.g., Yellow.ai, Uniphore).\n- Small marketing team (2-5 people) constrains campaign scale.\n- Lack of deep multi-industry testimonials (especially public sector or global MNCs).\n- Product onboarding may still face friction for large and traditional organizations.",
        type: "content",
        order: 1.1,
        template: "weaknesses",
        templateData: {
          weaknesses: [
            "Limited brand awareness compared to established competitors (e.g., Yellow.ai, Uniphore).",
            "Small marketing team (2-5 people) constrains campaign scale.",
            "Lack of deep multi-industry testimonials (especially public sector or global MNCs).",
            "Product onboarding may still face friction for large and traditional organizations.",
          ],
        },
      },
      {
        id: "slide-1-opportunities",
        title: "Opportunities",
        content:
          "- Indian enterprise digital transformation wave (BFSI, healthcare, manufacturing, retail).\n- Competitor reliance on chat/voice AI leaves a niche for deep analytics process automation.\n- Integration-compliant with India-focused tech stacks (Tally, Zoho, local ERPs).",
        type: "content",
        order: 1.2,
        template: "opportunities",
        templateData: {
          opportunities: [
            "Indian enterprise digital transformation wave (BFSI, healthcare, manufacturing, retail).",
            "Competitor reliance on chat/voice AI leaves a niche for deep analytics process automation.",
            "Integration-compliant with India-focused tech stacks (Tally, Zoho, local ERPs).",
          ],
        },
      },
      {
        id: "slide-1-threats",
        title: "Threats",
        content:
          "- Large AI incumbents investing in India/Asia.\n- Security or regulatory requirements in sensitive verticals (finance, healthcare).\n- Commoditization of dashboard and AI analytics tools.\n- Competitor trajectory towards bundled AI/automation suites.",
        type: "content",
        order: 1.3,
        template: "threats",
        templateData: {
          threats: [
            "Large AI incumbents investing in India/Asia.",
            "Security or regulatory requirements in sensitive verticals (finance, healthcare).",
            "Commoditization of dashboard and AI analytics tools.",
            "Competitor trajectory towards bundled AI/automation suites.",
          ],
        },
      },
      {
        id: "slide-2",
        title: "Brand Story",
        content:
          "Hero: Indian enterprise decision-makers (e.g., IT Heads, Operations, Directors) striving for digital transformation and efficiency.\n\nProblem: Fragmented, manual business processes block timely insights and productivity—causing slow decisions, costly errors, and low tool adoption across teams.\n\nSolution: MI PAL's AI assistant seamlessly unifies analysis, dashboards, and workflow automation across multiple Indian business systems—enabling fast, accurate, and scalable decisions, all through accessible, no-code interfaces.\n\nSuccess: Enterprises achieve rapid digital transformation with operational agility, better compliance, reduced manual effort, and empowered teams, becoming industry benchmarks for efficiency and innovation.",
        type: "content",
        order: 2,
        template: "content",
        templateData: {},
      },
      {
        id: "slide-3",
        title: "Marketing Mix",
        content:
          "Channels:\n- LinkedIn (organic & paid)\n- Account-Based Marketing (ABM)/sales outreach\n- Industry-specific webinars (Indian BFSI, healthcare, retail)\n- Content marketing (blogs, whitepapers, ROI calculators)\n- Email nurturing sequences\n- Channel/partner co-marketing\n- Selective industry events & conferences (e.g., NASSCOM, CII)\n\nTactics:\n- Targeted LinkedIn campaigns for key buyer personas (filtered for Indian mid-large company titles).\n- Create sector-relevant case studies and interactive ROI tools for BFSI, healthcare, manufacturing.\n- Host educational webinars with integration/demo focus tied to local Indian tech stacks.\n- Launch ABM/email cadences for target Indian accounts (CXO, Heads of IT/Ops).\n- Develop translations/local content variants as needed (EN+regional for India).\n- Set up partnerships with SI/channel/ERP vendors to extend reach.\n- Leverage reviews/testimonials from pilot users with clear business outcomes.\n\nBudget Allocation:\n- LinkedIn Advertising: 25%\n- Content Marketing & SEO: 20%\n- Webinars & Industry Events: 15%\n- Email Marketing & Nurture: 10%\n- ABM/Outbound: 15%\n- Partnership/Channel Enablement: 10%\n- Product Demos/Workshops: 5%\n- Other: 0%",
        type: "content",
        order: 3,
        template: "content",
        templateData: {},
      },
      {
        id: "slide-4",
        title: "Target Audience",
        content:
          "Demographics:\n- Job Titles: VP Operations, Head of IT & Digital Transformation, CIO, Administrative Director.\n- Industries: Financial Services, Manufacturing, Healthcare, Retail.\n- Seniority: Director, VP, Head, CIO, CTO.\n- Company Size: 200-4500 employees.\n- Location: India.\n- Education Levels: B.Tech, MBA, M.Tech, Postgraduate.\n\nPsychographics:\n- Values: Efficiency, Compliance, Data-Driven, Operational Improvement.\n- Motivations: Automate manual data and reporting processes, streamline cross-functional workflows, quick actionable decision-making, ensure regulatory compliance.\n- Frustrations: Fragmented data and tools, manual & slow reporting, limited IT bandwidth, low adoption of analytics tools.\n- Personality Traits: Analytical, Collaborative, Goal-oriented, Change Agent.\n\nPain Points:\n- Delayed or manual reporting impedes decisions.\n- Multiple disconnected systems.\n- Slow onboarding and user adoption.\n- Compliance and audit friction due to manual data.\n- Difficulty scaling analytics with limited resources.",
        type: "content",
        order: 4,
        template: "content",
        templateData: {},
      },
      {
        id: "slide-5",
        title: "Implementation Roadmap",
        content:
          "Phase: Foundation (Weeks 1-3)\n- Tasks: Persona & ICP alignment for ABM lists, establish core content calendar (case studies, ROI tools), set up LinkedIn campaigns and website tracking, internal workflow audit for automation priorities.\n\nPhase: Engagement (Weeks 4-8)\n- Tasks: Execute LinkedIn and ABM/email outreach, launch sector-focused webinars and demo series, start partner/channel co-marketing pilots, gather early pilot case studies/testimonials.\n\nPhase: Optimization (Weeks 9-12)\n- Tasks: A/B test paid and organic content for top lead drivers, deepen nurturing streams (webinar follow-ups, product tours), refine onboarding/support flows to reduce friction, standardize two partnership/integration rollouts.\n\nPhase: Scale (Quarter 2)\n- Tasks: Expand regional/localization content for further Indian states, widen ABM/partner targets based on Q1 results, annualize and syndicate best-performing content/case studies.",
        type: "content",
        order: 5,
        template: "timeline",
        templateData: {
          events: [
            {
              phase: "Foundation",
              duration: "Weeks 1-3",
              tasks: [
                "Persona & ICP alignment for ABM lists",
                "Establish core content calendar (case studies, ROI tools)",
                "Set up LinkedIn campaigns and website tracking",
                "Internal workflow audit for automation priorities",
              ],
            },
            {
              phase: "Engagement",
              duration: "Weeks 4-8",
              tasks: [
                "Execute LinkedIn and ABM/email outreach",
                "Launch sector-focused webinars and demo series",
                "Start partner/channel co-marketing pilots",
                "Gather early pilot case studies/testimonials",
              ],
            },
            {
              phase: "Optimization",
              duration: "Weeks 9-12",
              tasks: [
                "A/B test paid and organic content for top lead drivers",
                "Deepen nurturing streams (webinar follow-ups, product tours)",
                "Refine onboarding/support flows to reduce friction",
                "Standardize two partnership/integration rollouts",
              ],
            },
            {
              phase: "Scale",
              duration: "Quarter 2",
              tasks: [
                "Expand regional/localization content for further Indian states",
                "Widen ABM/partner targets based on Q1 results",
                "Annualize and syndicate best-performing content/case studies",
              ],
            },
          ],
        },
      },
      {
        id: "slide-6",
        title: "Persona: Amit Mehra",
        content:
          "Title: IT Manager\n\nDemographics:\n- Age Range: 32-40\n- Gender: Male\n- Location: Pune, India\n- Education: B.Tech, Computer Science\n- Income: $35,000-$50,000\n- Job Title: IT Manager\n- Industry: Manufacturing\n- Company Size: 350\n\nPsychographics:\n- Values: Practical innovation, Stability, Security, Learning.\n- Motivations: Automate routine tasks, empower business users, reduce IT support tickets.\n- Frustrations: Limited team bandwidth, fragmented tech stack, user resistance to change.\n- Personality: Hands-on, Patient, Problem-solver, Tech enthusiast.\n- Interests: Automation tools, Cloud migrations, User training.\n- Lifestyle: Regular work schedule, online upskilling courses, family responsibilities.\n\nPain Points:\n- Multiple business units use different systems—data consolidation is a big hurdle.\n- Reporting requests overload a small IT team.\n- Adoption of modern tools is slow due to user reluctance and limited resources.",
        type: "content",
        order: 6,
        template: "persona-card",
        templateData: {
          name: "Amit Mehra",
          role: "IT Manager",
          demographics: {
            age: "32-40",
            gender: "Male",
            location: "Pune, India",
            education: "B.Tech, Computer Science",
            income: "$35,000-$50,000",
            jobTitle: "IT Manager",
            industry: "Manufacturing",
            companySize: "350",
          },
          psychographics: {
            values: [
              "Practical innovation",
              "Stability",
              "Security",
              "Learning",
            ],
            motivations: [
              "Automate routine tasks",
              "Empower business users",
              "Reduce IT support tickets",
            ],
            frustrations: [
              "Limited team bandwidth",
              "Fragmented tech stack",
              "User resistance to change",
            ],
            personality: [
              "Hands-on",
              "Patient",
              "Problem-solver",
              "Tech enthusiast",
            ],
            interests: [
              "Automation tools",
              "Cloud migrations",
              "User training",
            ],
            lifestyle: [
              "Regular work schedule",
              "Online upskilling courses",
              "Family responsibilities",
            ],
          },
          painPoints: [
            "Multiple business units use different systems—data consolidation is a big hurdle.",
            "Reporting requests overload a small IT team.",
            "Adoption of modern tools is slow due to user reluctance and limited resources.",
          ],
        },
      },
      {
        id: "slide-7",
        title: "Persona: Priya Kulkarni",
        content:
          "Title: Head of Operations\n\nDemographics:\n- Age Range: 38-45\n- Gender: Female\n- Location: Mumbai, India\n- Education: MBA, Operations Management\n- Income: $40,000-$60,000/year\n- Job Title: Head of Operations\n- Industry: Retail\n- Company Size: 200-600 employees\n\nPsychographics:\n- Values: Efficiency, Accountability, Continuous Improvement.\n- Motivations: Streamlining store operations, reducing manual errors, visibility into performance metrics.\n- Frustrations: Slow manual reporting, fragmented data sources, delayed responses to market trends.\n- Personality: Analytical, Process-oriented, Pragmatic.\n- Interests: Retail innovation, Emerging tech, Operational best practices.\n- Lifestyle: Busy weekdays, family-focused weekends, occasional travel.\n\nPain Points:\n- Unable to get real-time operational transparency.\n- Manual data entry is prone to errors and delays.\n- Trouble aligning store teams due to disconnected workflows.",
        type: "content",
        order: 7,
        template: "persona-card",
        templateData: {
          name: "Priya Kulkarni",
          role: "Head of Operations",
          demographics: {
            age: "38-45",
            gender: "Female",
            location: "Mumbai, India",
            education: "MBA, Operations Management",
            income: "$40,000-$60,000/year",
            jobTitle: "Head of Operations",
            industry: "Retail",
            companySize: "200-600 employees",
          },
          psychographics: {
            values: ["Efficiency", "Accountability", "Continuous Improvement"],
            motivations: [
              "Streamlining store operations",
              "Reducing manual errors",
              "Visibility into performance metrics",
            ],
            frustrations: [
              "Slow manual reporting",
              "Fragmented data sources",
              "Delayed responses to market trends",
            ],
            personality: ["Analytical", "Process-oriented", "Pragmatic"],
            interests: [
              "Retail innovation",
              "Emerging tech",
              "Operational best practices",
            ],
            lifestyle: [
              "Busy weekdays",
              "Family-focused weekends",
              "Occasional travel",
            ],
          },
          painPoints: [
            "Unable to get real-time operational transparency.",
            "Manual data entry is prone to errors and delays.",
            "Trouble aligning store teams due to disconnected workflows.",
          ],
        },
      },
      {
        id: "slide-8",
        title: "Persona: Sonal Mehta",
        content:
          "Title: Head of Digital Strategy\n\nDemographics:\n- Age Range: 34-44\n- Gender: Female\n- Location: Mumbai, India\n- Education: MBA, Digital Marketing certification\n- Income: $50K-$60K\n- Job Title: Head of Digital Strategy\n- Industry: Retail\n- Company Size: 850 employees\n\nPsychographics:\n- Values: Agility, Customer-centricity, Innovation, Scalability.\n- Motivations: Unified view of customer data, rapid adjustments to consumer trends, scaling digital initiatives with lean resources.\n- Frustrations: Fragmented customer insights across ecommerce, POS, and CRM, siloed task automation projects, limited self-service analytics for business teams.\n- Personality: Visionary, Action-oriented, Collaborative, Fast learner.\n- Interests: Omnichannel retail, Analytics automation, Social media insights.\n- Lifestyle: Frequent industry event attendee, time-limited but tech-savvy.\n\nPain Points:\n- Difficulty in unifying in-store, online, and CRM data for strategy planning.\n- Teams rely on outdated manual processes to track campaign results.\n- Lack of automation in regular reporting for category managers.",
        type: "content",
        order: 8,
        template: "persona-card",
        templateData: {
          name: "Sonal Mehta",
          role: "Head of Digital Strategy",
          demographics: {
            age: "34-44",
            gender: "Female",
            location: "Mumbai, India",
            education: "MBA, Digital Marketing certification",
            income: "$50K-$60K",
            jobTitle: "Head of Digital Strategy",
            industry: "Retail",
            companySize: "850 employees",
          },
          psychographics: {
            values: [
              "Agility",
              "Customer-centricity",
              "Innovation",
              "Scalability",
            ],
            motivations: [
              "Unified view of customer data",
              "Rapid adjustments to consumer trends",
              "Scaling digital initiatives with lean resources",
            ],
            frustrations: [
              "Fragmented customer insights across ecommerce, POS, and CRM",
              "Siloed task automation projects",
              "Limited self-service analytics for business teams",
            ],
            personality: [
              "Visionary",
              "Action-oriented",
              "Collaborative",
              "Fast learner",
            ],
            interests: [
              "Omnichannel retail",
              "Analytics automation",
              "Social media insights",
            ],
            lifestyle: [
              "Frequent industry event attendee",
              "Time-limited but tech-savvy",
            ],
          },
          painPoints: [
            "Difficulty in unifying in-store, online, and CRM data for strategy planning.",
            "Teams rely on outdated manual processes to track campaign results.",
            "Lack of automation in regular reporting for category managers.",
          ],
        },
      },
      {
        id: "slide-9",
        title: "Competitor Analysis: Hootsuite",
        content:
          "Company Overview: Hootsuite is an established global SaaS platform focused on social media management. While strong in multi-channel scheduling and analytics, its AI-driven strategy features are less tailored to small B2B marketing teams, and it offers limited localization for the Swedish market.\n\nMarket Position: High threat level with an analysis score of 80, indicating strong competition in social media management.\n\nKey Strengths:\n- Social media scheduling\n- Analytics and reporting\n- Team collaboration tools\n- Automation for social marketers\n- Industry trends\n\nContent Strategy: They target social media management and scheduling tools, with a posting frequency of 2-3 blog posts/week and daily LinkedIn updates.\n\nOur Competitive Advantage: Unlike Hootsuite, we offer more tailored solutions for small B2B marketing teams.\n\nStrategic Insight: Focus on enhancing localization features to better serve the Swedish market.",
        type: "content",
        order: 9,
        template: "comparison-table",
        templateData: {
          headers: ["Aspect", "Details"],
          rows: [
            [
              "Company Overview",
              "Hootsuite is an established global SaaS platform focused on social media management. While strong in multi-channel scheduling and analytics, its AI-driven strategy features are less tailored to small B2B marketing teams, and it offers limited localization for the Swedish market.",
            ],
            [
              "Market Position",
              "High threat level with an analysis score of 80, indicating strong competition in social media management.",
            ],
            [
              "Key Strengths",
              "Social media scheduling, Analytics and reporting, Team collaboration tools, Automation for social marketers, Industry trends",
            ],
            [
              "Content Strategy",
              "They target social media management and scheduling tools, with a posting frequency of 2-3 blog posts/week and daily LinkedIn updates.",
            ],
            [
              "Our Competitive Advantage",
              "Unlike Hootsuite, we offer more tailored solutions for small B2B marketing teams.",
            ],
            [
              "Strategic Insight",
              "Focus on enhancing localization features to better serve the Swedish market.",
            ],
          ],
        },
      },
      {
        id: "slide-10",
        title: "Competitor Analysis: Sprout Social",
        content:
          "Company Overview: Sprout Social is a key global competitor present in the Nordics, increasingly attractive to Swedish SMBs for social media and basic automation, but lacks the full AI-driven continuous optimization and onboarding support Gemoniq offers.\n\nMarket Position: High threat level with an analysis score of 75, indicating strong competition in social media management.\n\nKey Strengths:\n- Social publishing workflows\n- Social analytics\n- Collaboration tools for teams\n- Customer engagement tactics\n\nContent Strategy: They target social media management in Sweden, with a posting frequency of 2-3 blog posts/week and regular LinkedIn posts.\n\nOur Competitive Advantage: We provide comprehensive onboarding support and AI-driven optimization.\n\nStrategic Insight: Emphasize our unique onboarding capabilities in marketing materials.",
        type: "content",
        order: 10,
        template: "comparison-table",
        templateData: {
          headers: ["Aspect", "Details"],
          rows: [
            [
              "Company Overview",
              "Sprout Social is a key global competitor present in the Nordics, increasingly attractive to Swedish SMBs for social media and basic automation, but lacks the full AI-driven continuous optimization and onboarding support Gemoniq offers.",
            ],
            [
              "Market Position",
              "High threat level with an analysis score of 75, indicating strong competition in social media management.",
            ],
            [
              "Key Strengths",
              "Social publishing workflows, Social analytics, Collaboration tools for teams, Customer engagement tactics",
            ],
            [
              "Content Strategy",
              "They target social media management in Sweden, with a posting frequency of 2-3 blog posts/week and regular LinkedIn posts.",
            ],
            [
              "Our Competitive Advantage",
              "We provide comprehensive onboarding support and AI-driven optimization.",
            ],
            [
              "Strategic Insight",
              "Emphasize our unique onboarding capabilities in marketing materials.",
            ],
          ],
        },
      },
      {
        id: "slide-11",
        title: "Competitor Analysis: Planhat",
        content:
          "Company Overview: Stockholm-based Planhat specializes in customer success automation and engagement analytics for SaaS teams, strong local reputation. Directly relevant for SMBs in Sweden focused on reducing churn and integrating marketing and CS data.\n\nMarket Position: High threat level with an analysis score of 72, indicating strong competition in customer success automation.\n\nKey Strengths:\n- Customer onboarding automation\n- Churn reduction strategies\n- Integrations (CRM, marketing)\n- Customer data analytics\n\nContent Strategy: They target customer success automation in Sweden, with a posting frequency of 1-2 blog posts/month and active LinkedIn engagement.\n\nOur Competitive Advantage: We offer a more holistic approach to customer success and marketing integration.\n\nStrategic Insight: Highlight our comprehensive analytics capabilities in comparison.",
        type: "content",
        order: 11,
        template: "comparison-table",
        templateData: {
          headers: ["Aspect", "Details"],
          rows: [
            [
              "Company Overview",
              "Stockholm-based Planhat specializes in customer success automation and engagement analytics for SaaS teams, strong local reputation. Directly relevant for SMBs in Sweden focused on reducing churn and integrating marketing and CS data.",
            ],
            [
              "Market Position",
              "High threat level with an analysis score of 72, indicating strong competition in customer success automation.",
            ],
            [
              "Key Strengths",
              "Customer onboarding automation, Churn reduction strategies, Integrations (CRM, marketing), Customer data analytics",
            ],
            [
              "Content Strategy",
              "They target customer success automation in Sweden, with a posting frequency of 1-2 blog posts/month and active LinkedIn engagement.",
            ],
            [
              "Our Competitive Advantage",
              "We offer a more holistic approach to customer success and marketing integration.",
            ],
            [
              "Strategic Insight",
              "Highlight our comprehensive analytics capabilities in comparison.",
            ],
          ],
        },
      },
      {
        id: "slide-12",
        title: "Competitor Analysis: Upsales",
        content:
          "Company Overview: Swedish SaaS company serving SMBs with marketing automation and CRM. Not AI-first but offers integration and campaign management with local support, established trust in Sweden's B2B SaaS scene.\n\nMarket Position: Medium threat level with an analysis score of 70, indicating moderate competition in marketing automation.\n\nKey Strengths:\n- Marketing automation\n- CRM integration\n- Pipeline management\n- B2B sales and marketing alignment\n\nContent Strategy: They target marketing automation in Sweden, with a posting frequency of 1-2 blog posts/month and frequent LinkedIn posts.\n\nOur Competitive Advantage: We provide AI-driven insights and automation tailored for SMBs.\n\nStrategic Insight: Focus on our AI capabilities in marketing materials.",
        type: "content",
        order: 12,
        template: "comparison-table",
        templateData: {
          headers: ["Aspect", "Details"],
          rows: [
            [
              "Company Overview",
              "Swedish SaaS company serving SMBs with marketing automation and CRM. Not AI-first but offers integration and campaign management with local support, established trust in Sweden's B2B SaaS scene.",
            ],
            [
              "Market Position",
              "Medium threat level with an analysis score of 70, indicating moderate competition in marketing automation.",
            ],
            [
              "Key Strengths",
              "Marketing automation, CRM integration, Pipeline management, B2B sales and marketing alignment",
            ],
            [
              "Content Strategy",
              "They target marketing automation in Sweden, with a posting frequency of 1-2 blog posts/month and frequent LinkedIn posts.",
            ],
            [
              "Our Competitive Advantage",
              "We provide AI-driven insights and automation tailored for SMBs.",
            ],
            [
              "Strategic Insight",
              "Focus on our AI capabilities in marketing materials.",
            ],
          ],
        },
      },
      {
        id: "slide-13",
        title: "Competitor Analysis: Dataciph",
        content:
          "Company Overview: Focused on AI-powered data analytics and intelligence, Dataciph offers automation for marketing but has limited brand presence and unclear traction in Sweden, especially among SMBs; seems more analytics-driven than holistic marketing automation.\n\nMarket Position: Medium threat level with an analysis score of 55, indicating weaker competition in marketing automation.\n\nKey Strengths:\n- AI analytics for marketing\n- Data-driven optimization\n- Automation for digital campaigns\n- MarTech integrations\n\nContent Strategy: They target marketing analytics in Sweden, with a posting frequency of 1 blog post/month and sporadic LinkedIn activity.\n\nOur Competitive Advantage: We offer a more comprehensive marketing automation solution with strong support.\n\nStrategic Insight: Emphasize our holistic approach to marketing automation.",
        type: "content",
        order: 13,
        template: "comparison-table",
        templateData: {
          headers: ["Aspect", "Details"],
          rows: [
            [
              "Company Overview",
              "Focused on AI-powered data analytics and intelligence, Dataciph offers automation for marketing but has limited brand presence and unclear traction in Sweden, especially among SMBs; seems more analytics-driven than holistic marketing automation.",
            ],
            [
              "Market Position",
              "Medium threat level with an analysis score of 55, indicating weaker competition in marketing automation.",
            ],
            [
              "Key Strengths",
              "AI analytics for marketing, Data-driven optimization, Automation for digital campaigns, MarTech integrations",
            ],
            [
              "Content Strategy",
              "They target marketing analytics in Sweden, with a posting frequency of 1 blog post/month and sporadic LinkedIn activity.",
            ],
            [
              "Our Competitive Advantage",
              "We offer a more comprehensive marketing automation solution with strong support.",
            ],
            [
              "Strategic Insight",
              "Emphasize our holistic approach to marketing automation.",
            ],
          ],
        },
      },
      {
        id: "slide-14",
        title: "Goal: Brand Awareness",
        content:
          "Goal: Launch two new Indian market-specific use cases and publish at least three localized case studies featuring top enterprise customers.\n\nMetric: Number of localized use cases and case studies published.\nTimeline: Within 9 months.\nTarget: 2 new use cases and 3 case studies published.\nPriority: Medium.\nStatus: Active.",
        type: "content",
        order: 14,
        template: "content",
        templateData: {},
      },
      {
        id: "slide-15",
        title:
          "Key Result: Increase website conversion rates from organic traffic",
        content:
          "Parent Goal: Launch two new Indian market-specific use cases and publish at least three localized case studies featuring top enterprise customers.\n\nKPI Name: Increase website conversion rates from organic traffic.\n\nMetric Details:\n- Baseline: 0.00\n- Target: 100.00\n- Current: 0.00\n- Progress: 0%\n- Period: Q3 2025\n- Status: Active.",
        type: "content",
        order: 15,
        template: "content",
        templateData: {},
      },
      {
        id: "slide-16",
        title: "Initiative: Social Media Content Campaign",
        content:
          "Parent KPI: Increase website conversion rates from organic traffic.\n\nInitiative Title: Social Media Content Campaign.\n\nInitiative Details:\n- Hypothesis: Creating daily LinkedIn content with industry insights will increase brand visibility and generate 40% more qualified leads through organic reach.\n- Status: Planned.",
        type: "content",
        order: 16,
        template: "content",
        templateData: {},
      },
    ],
    theme: "modern",
    estimatedDuration: 10,
  },
  enhanced: true,
  multiAgent: true,
  templateSelection: "intelligent-mastra-workflow",
  workflow: "presentation-workflow",
};
