package dev.mfazio.wwc2019.types.firebase

data class FirebaseTeam(
    val id: String,
    val name: String,
    val eloCode: String,
    val group: String,
    var rankings: Map<String, Int>? = mapOf()
)
