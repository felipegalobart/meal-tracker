import { z } from "zod"

// ---------- Suspect Foods ----------
const SuspectFoodSchema = z.object({
  ingredient: z.string().describe("The specific food or ingredient suspected"),
  category: z
    .enum(["fodmap", "histamina", "irritante_gi", "alergenio_comum", "outro"])
    .describe("Classification of why this food may be problematic"),
  suspicionLevel: z
    .enum(["baixa", "moderada", "alta", "muito_alta"])
    .describe("How confident the analysis is that this food triggers symptoms"),
  symptomTypes: z
    .array(z.string())
    .describe("Which symptom types this food is linked to (e.g. 'gases', 'inchaço', 'fezes alteradas', 'irritação na pele')"),
  occurrences: z
    .number()
    .describe("Number of times this food appeared before symptom episodes in the data"),
  reasoning: z
    .string()
    .describe("Brief explanation of the evidence linking this food to symptoms"),
})

// ---------- Temporal Correlations ----------
const TemporalCorrelationSchema = z.object({
  meal: z.string().describe("The specific meal or food consumed"),
  mealDate: z.string().describe("When the meal was consumed (date/time)"),
  symptom: z.string().describe("The symptom that followed"),
  symptomDate: z.string().describe("When the symptom appeared (date/time)"),
  delayHours: z
    .number()
    .describe("Approximate hours between meal and symptom onset"),
  severity: z.number().describe("Symptom severity 1-5"),
  suspectIngredients: z
    .array(z.string())
    .describe("Which ingredients from that meal are most likely responsible"),
})

// ---------- Symptom Clusters ----------
const SymptomClusterSchema = z.object({
  clusterName: z
    .string()
    .describe("Name for this symptom group (e.g. 'Motilidade digestiva', 'Gases e inchaço', 'Pele')"),
  symptoms: z
    .array(z.string())
    .describe("Symptoms in this cluster"),
  averageSeverity: z
    .number()
    .describe("Average severity across episodes in this cluster"),
  trend: z
    .enum(["melhorando", "piorando", "estável", "dados_insuficientes"])
    .describe("Whether this cluster is getting better, worse, or staying the same"),
  topTriggers: z
    .array(z.string())
    .describe("Top 3 foods/ingredients most associated with this cluster"),
  observations: z
    .string()
    .describe("Additional observations about this symptom cluster"),
})

// ---------- Elimination Experiments ----------
const EliminationExperimentSchema = z.object({
  title: z
    .string()
    .describe("Short name for the experiment (e.g. 'Eliminar laticínios por 14 dias')"),
  foodsToRemove: z
    .array(z.string())
    .describe("Specific foods/ingredients to eliminate"),
  duration: z
    .string()
    .describe("Recommended elimination period (e.g. '14 dias', '3 semanas')"),
  rationale: z
    .string()
    .describe("Why this experiment is recommended based on the data"),
  expectedImprovement: z
    .string()
    .describe("Which symptoms should improve if the hypothesis is correct"),
  priority: z
    .enum(["alta", "média", "baixa"])
    .describe("How strongly the data supports trying this experiment first"),
})

// ---------- Data Quality ----------
const DataQualitySchema = z.object({
  totalMeals: z.number(),
  totalSymptoms: z.number(),
  trackingDays: z
    .number()
    .describe("Number of distinct days with at least one log entry"),
  completeness: z
    .enum(["insuficiente", "parcial", "bom", "excelente"])
    .describe("Overall data completeness assessment"),
  gaps: z
    .array(z.string())
    .describe("Specific data gaps that limit analysis (e.g. 'Poucos registros de café da manhã', 'Sem dados nos fins de semana')"),
  suggestion: z
    .string()
    .describe("What the user should log more of to improve analysis quality"),
})

// ---------- Full Report ----------
export const ReportSchema = z.object({
  executiveSummary: z
    .string()
    .describe(
      "3-5 sentence high-level summary: key findings, most suspect foods, and the single most important action to take. Written in Brazilian Portuguese."
    ),
  suspectFoods: z
    .array(SuspectFoodSchema)
    .describe(
      "Ranked list of suspect foods/ingredients, from most to least suspicious. Include at least the top suspects found."
    ),
  temporalCorrelations: z
    .array(TemporalCorrelationSchema)
    .describe(
      "Specific meal-to-symptom timeline events found in the data. Include the strongest examples."
    ),
  symptomClusters: z
    .array(SymptomClusterSchema)
    .describe(
      "Symptoms grouped by type/body system with their associated triggers and trends."
    ),
  eliminationExperiments: z
    .array(EliminationExperimentSchema)
    .describe(
      "Concrete elimination diet experiments to run, ordered by priority."
    ),
  dataQuality: DataQualitySchema.describe(
    "Assessment of the data available and what is needed for better analysis."
  ),
})

export type Report = z.infer<typeof ReportSchema>
export type SuspectFood = z.infer<typeof SuspectFoodSchema>
export type TemporalCorrelation = z.infer<typeof TemporalCorrelationSchema>
export type SymptomCluster = z.infer<typeof SymptomClusterSchema>
export type EliminationExperiment = z.infer<typeof EliminationExperimentSchema>
export type DataQuality = z.infer<typeof DataQualitySchema>
