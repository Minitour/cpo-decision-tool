package backend.knowledge

import org.apache.jena.rdf.model.Model
import org.apache.jena.riot.RDFDataMgr

class Ontology {
    companion object {
        val model: Model = RDFDataMgr.loadModel("CPO.owl")
    }
}