import Concept from "./Concept";

export default interface Condition {
    concept: Concept
    percentage: number
    signsAndSymptoms: Concept[]
    interventions: Concept[]
}