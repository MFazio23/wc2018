package dev.mfazio.wwc2019.types

data class Team(val id: String, val name: String, val eloCode: String, val group: String, var rankings: Map<RankingType, Int>? = mapOf())

