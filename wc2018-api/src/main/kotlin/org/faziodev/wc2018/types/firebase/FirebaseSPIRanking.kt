package org.faziodev.wc2018.types.firebase

data class FirebaseSPIRanking(
    val id: String,
    val team: String,
    val roundOf16Chance: Double,
    val spiRating: Double,
    val spiRanking: Int
)