package backend.reasoning

import org.apache.jena.query.Query
import org.apache.jena.query.QueryFactory
import org.apache.jena.vocabulary.OWL
import org.apache.jena.vocabulary.RDF
import org.apache.jena.vocabulary.RDFS

private val prefix: String = """
    prefix cpo: <http://www.k4care.net/ontologies/cpo.owl#>
    prefix rdfs: <${RDFS.getURI()}>
    prefix rdf: <${RDF.getURI()}>
    prefix owl: <${OWL.getURI()}>
    """

class Queries {
    companion object {

        /**
         * Get total diseases + total diseases associated with symptom via isSignOf.
         */
        fun getWightsForSymptoms(): Query {
            return QueryFactory.create(
                """
                $prefix
                 
                 SELECT ?signOrSymptom
                        (count(distinct ?disease) as ?totalDiseases)
                        (count(distinct ?disease1) as ?totalIsSignOf) 
                 WHERE {
                        ?signOrSymptom rdfs:subClassOf* cpo:SignAndSymptom; rdfs:subClassOf ?restriction . 
                        ?restriction owl:onProperty cpo:isSignOf .
                        ?restriction owl:allValuesFrom ?value . 
                        ?value owl:unionOf* ?diseases .
                        ?diseases rdf:rest*/rdf:first ?disease1 .
                        
                        ?disease rdfs:subClassOf* cpo:Disease .
                 } 
                 GROUP BY ?signOrSymptom
                 """
            )
        }

        /**
         * Get all diseases associated with symptoms.
         */
        fun getDiseasesForSymptomsQuery(symptoms: List<String>): Query {
            return QueryFactory.create(
                """
                $prefix
        
                SELECT DISTINCT ?disease ?symptom WHERE {
                    ?disease rdfs:subClassOf* cpo:Disease; rdfs:subClassOf ?restriction .
                    ?restriction owl:onProperty cpo:hasSignsAndSymptoms .
                    ?restriction owl:allValuesFrom ?value . 
                    ?value owl:unionOf* ?symptoms .
                    ?symptoms rdf:rest*/rdf:first ?symptom .
                    FILTER (?symptom IN (${symptoms.joinToString(",") { s -> "cpo:$s" }}))
                }
                """
            )
        }

        /**
         * Get symptoms for a given disease.
         */
        fun symptomsForDisease(disease: String): Query {
            return QueryFactory.create(
                """
                $prefix
        
                SELECT DISTINCT ?symptom WHERE {
                    cpo:${disease} rdfs:subClassOf ?restriction .
                    ?restriction owl:onProperty cpo:hasSignsAndSymptoms .
                    ?restriction owl:allValuesFrom ?value . 
                    ?value owl:unionOf* ?items .
                    ?items rdf:rest*/rdf:first ?symptom
                }
                """
            )
        }

        /**
         * Get Intervention plans for a given disease.
         */
        fun getInterventionPlansForDisease(disease: String): Query {
            return QueryFactory.create(
                """
                $prefix
        
                SELECT DISTINCT ?intervention WHERE {
                    cpo:${disease} rdfs:subClassOf ?restriction .
                    ?restriction owl:onProperty cpo:hasIntervention .
                    ?restriction owl:allValuesFrom ?value . 
                    ?value owl:unionOf* ?items .
                    ?items rdf:rest*/rdf:first ?intervention
                }
                """
            )
        }
    }
}

