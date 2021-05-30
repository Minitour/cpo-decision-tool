package backend.models

import kotlin.math.pow

data class WeightedSymptom(val name: String, val totalDiseases: Int, val totalIsSignOf: Int) {

    fun getWeight(): Double {
        val a = (totalDiseases - totalIsSignOf).toDouble() / (totalDiseases - 1).toDouble()
        return a.pow(2)
    }
}
