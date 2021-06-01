package backend.api

import backend.knowledge.DecisionSupport
import backend.models.Condition
import backend.reasoning.Logic
import com.google.common.reflect.TypeToken
import com.google.gson.Gson
import com.google.gson.JsonElement
import io.javalin.http.Context
import io.javalin.http.Handler


class Conditions {

    companion object {
        val gson: Gson = Gson()

        class Infer : Handler {
            override fun handle(ctx: Context) {
                val sType = object : TypeToken<JsonElement>() {}.type
                val body: JsonElement = gson.fromJson(ctx.body(), sType)

                val symptoms = body.asJsonObject["symptoms"].asJsonArray.toList().map { it.asString }
                val interventions = body.asJsonObject["interventions"].asJsonArray.toList().map { it.asString }

                // get diseases based on signs and symptoms
                val conditions = Logic.diseasesFromSymptomsAndInterventions(symptoms, interventions)

                // calculate disease score based on signs and symptoms
                ctx.json(
                    conditions.map {
                        val percentage = DecisionSupport.calculateDiseasePercentage(it.id, symptoms)
                        Condition(it, percentage, Logic.signsAndSymptoms(it.id), Logic.interventions(it.id))
                    }.sortedByDescending {
                        it.percentage
                    }
                )
            }
        }

        class GetAll : Handler {
            override fun handle(ctx: Context) {
                ctx.json(Logic.diseases())
            }
        }
    }


}