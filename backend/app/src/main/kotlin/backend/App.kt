package backend

import backend.api.Conditions
import backend.api.Interventions
import backend.api.Symptoms
import io.javalin.Javalin

fun main(args: Array<String>) {
    val app = Javalin.create { config ->
        config.addStaticFiles("/public")
    }.start(getPort())

    app.get("/api/symptoms", Symptoms.Companion.GetAll())
    app.get("/api/interventions", Interventions.Companion.GetAll())
    app.get("/api/conditions/infer", Conditions.Companion.Infer())

}

fun getPort(): Int {
    val port: String = System.getenv("PORT") ?: "7000"
    return port.toInt()
}
