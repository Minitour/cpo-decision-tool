package backend.knowledge

import backend.reasoning.Logic

class DecisionSupport {
    companion object {
        /**
         * Based on the paper, for each given symptom in the ontology the weight is calculated as
         *  ((d - ds)/(d - 1))^2 where d is the total number of diseases in the ontology and ds is the number of
         *  diseases of which the symptom is associated with (via isSignOf).
         */
        val weightedSymptoms: Map<String, Double> =
            Logic.getWeightedSymptoms().associateBy({ it.name }, { it.getWeight() })

        /**
         * Given disease and signs and symptoms - calculate the probability score of having that disease.
         * The function returns a percentage (0-100).
         */
        fun calculateDiseasePercentage(disease: String, signsAndSymptoms: List<String>): Double {
            val diseaseSymptoms = Logic.symptomsForDisease(disease)

            // sum of all symptom scores.
            val totalScore = diseaseSymptoms
                .asSequence()
                .map { weightedSymptoms.getOrDefault(it, 0.0) }
                .sum()

            // sum of confirmed symptoms.
            val confirmedScore = signsAndSymptoms
                .asSequence()
                .filter { diseaseSymptoms.contains(it) }
                .map { weightedSymptoms.getOrDefault(it, 0.0) }
                .sum()

            if (totalScore == 0.0) {
                return 0.0;
            }

            return (confirmedScore / totalScore) * 100
        }
    }
}