package backend.api

import backend.reasoning.Logic
import backend.reasoning.Queries
import io.javalin.http.Context
import io.javalin.http.Handler

class Symptoms {

    companion object {
        class GetAll : Handler {
            override fun handle(ctx: Context) {
                ctx.res.addHeader("Accept", "application/json")
                ctx.json(Logic.signsAndSymptoms())
            }
        }
    }
}