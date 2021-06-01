package backend.models

/**
 * Class used to display the condition likelihood
 */
data class Condition(
    val concept: Concept,
    val percentage: Double,
    val signsAndSymptoms: List<Concept>?,
    val interventions: List<Concept>?
)
