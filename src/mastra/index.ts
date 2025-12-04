import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { contentAdjustmentAgent } from "./agents/content-adjustment-agent";
import { slideTemplateSelectionAgent } from "./agents/slide-template-selection-agent";
import { presentationWorkflow } from "./workflows/presentation-workflow";

export const mastra = new Mastra({
  agents: {
    contentAdjustmentAgent,
    slideTemplateSelectionAgent,
  },
  workflows: {
    presentationWorkflow,
  },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../presentation.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "PresentationEditor",
    level: "info",
  }),
});

// Export the agents and workflows for easy access
export {
  contentAdjustmentAgent,
  slideTemplateSelectionAgent,
  presentationWorkflow,
};
