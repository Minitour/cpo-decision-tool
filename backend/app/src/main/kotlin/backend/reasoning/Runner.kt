package backend.reasoning

import org.apache.jena.query.Query
import org.apache.jena.query.QueryExecution
import org.apache.jena.query.QueryExecutionFactory
import org.apache.jena.query.ResultSet
import org.apache.jena.rdf.model.Model

class Runner {
    companion object {
        fun <T> run(model: Model, query: Query, handler: (ResultSet) -> T): T {
            val queryExec: QueryExecution = QueryExecutionFactory.create(query, model)
            queryExec.use {
                return handler(queryExec.execSelect())
            }
        }
    }
}