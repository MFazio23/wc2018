package dev.mfazio.wwc2019.types.firebase

data class FirebasePartyUser(val name: String, val teams: Map<String, String>? = mapOf())