package backend.reasoning


import backend.knowledge.Ontology
import backend.models.Concept
import backend.models.WeightedSymptom
import backend.util.toHumanReadable
import org.apache.jena.query.QuerySolution


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

        fun diseasesFromSymptomsAndInterventions(symptoms: List<String>, interventions: List<String>): List<Concept> {
            val query = Queries.getDiseasesForSymptoms(symptoms)

            fun resultToConcept(item: QuerySolution): Concept {
                val id = item.get("disease").asResource().localName
                val comment = item.get("description").asLiteral().string
                val display = id.split("-").last().toHumanReadable()
                return Concept(id, display, comment)
            }

            val list1 = Runner.run(Ontology.model, query) {
                it.iterator()
                    .asSequence()
                    .map { item -> resultToConcept(item) }
                    .toSet()
                    .toList()
            }
            val list2 = Runner.run(Ontology.model, query) {
                it.iterator()
                    .asSequence()
                    .map { item -> resultToConcept(item) }
                    .toSet()
                    .toList()
            }

            return (list1 + list2).distinct()
        }


        fun signsAndSymptoms(disease: String? = null): List<Concept> {

            val query =
                if (disease != null) Queries.getSignsAndSymptomsOfDisease(disease) else Queries.getAllSignsAndSymptoms()
            return Runner.run(Ontology.model, query) {
                it.iterator().asSequence().map { item ->
                    val id = item.get("signOrSymptom").asResource().localName
                    val comment = item.get("description")?.asLiteral()?.string
                    val display = id.split("-").last().toHumanReadable()
                    Concept(id, display, comment)
                }.toList()
            }
        }


        fun interventions(disease: String? = null): List<Concept> {
            val query =
                if (disease != null) Queries.getInterventionPlansForDisease(disease) else Queries.getAllInterventions()
            return Runner.run(Ontology.model, query) {
                it.iterator().asSequence().map { item ->
                    val id = item.get("intervention").asResource().localName
                    val comment = item.get("description")?.asLiteral()?.string
                    val display = id.split("-").last().toHumanReadable()
                    Concept(id, display, comment)
                }.toList()
            }
        }

        fun diseases(): List<Concept> {
            val query = Queries.getAllDiseases()
            return Runner.run(Ontology.model, query) {
                it.iterator().asSequence().map { item ->
                    val id = item.get("disease").asResource().localName
                    val comment = item.get("description").asLiteral().string
                    val display = id.split("-").last().toHumanReadable()
                    Concept(id, display, comment)
                }.toList()
            }
        }
    }
}

