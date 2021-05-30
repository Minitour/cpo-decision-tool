package backend.reasoning


import backend.knowledge.Ontology
import backend.models.WeightedSymptom


class Logic {
    companion object {

        fun getWeightedSymptoms(): List<WeightedSymptom> {
            val query = Queries.getWightsForSymptoms()

            return Runner.run(Ontology.model, query) { results ->
                results.iterator()
                    .asSequence()
                    .map { a ->
                        Triple(
                            a.get("signOrSymptom").asResource().localName,
                            a.get("totalDiseases").asLiteral().value as Int,
                            a.get("totalIsSignOf").asLiteral().value as Int
                        )
                    }
                    .map { (a, b, c) -> WeightedSymptom(a, b, c) }
                    .toList()
            }
        }

        fun symptomsForDisease(disease: String): List<String> {
            val query = Queries.symptomsForDisease(disease)
            return Runner.run(Ontology.model, query) {
                it.iterator()
                    .asSequence()
                    .map { a -> a.get("symptom").asResource().localName }
                    .toList()
            }
        }

        fun diseasesForSymptoms(symptoms: List<String>): List<String> {
            val query = Queries.getDiseasesForSymptomsQuery(symptoms)
            return Runner.run(Ontology.model, query) {
                it.iterator()
                    .asSequence()
                    .map { a -> a.get("disease").asResource().localName }
                    .toSet()
                    .toList()
            }
        }
    }
}

