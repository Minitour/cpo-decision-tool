package backend

import backend.api.Conditions
import backend.api.Interventions
import backend.api.Symptoms
import io.javalin.Javalin
import org.apache.jena.sys.JenaSystem

fun main(args: Array<String>) {
    JenaSystem.DEBUG_INIT = true;
    JenaSystem.init()
    org.apache.jena.query.ARQ.init()
    val app = Javalin.create { config ->
        config.addStaticFiles("/public")
        config.enableCorsForAllOrigins()
    }.start(getPort())

    app.get("/api/symptoms", Symptoms.Companion.GetAll())
    app.get("/api/interventions", Interventions.Companion.GetAll())
    app.get("/api/conditions", Conditions.Companion.GetAll())
    app.post("/api/conditions/infer", Conditions.Companion.Infer())

    println("Setup done.")
}

fun getPort(): Int {
    val port: String = System.getenv("PORT") ?: "7000"
    return port.toInt()
}
