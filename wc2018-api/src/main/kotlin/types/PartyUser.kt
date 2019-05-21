package dev.mfazio.wwc2019.types

data class PartyUser(val id: String, val name: String, val teams: Map<String, String>? = mapOf())