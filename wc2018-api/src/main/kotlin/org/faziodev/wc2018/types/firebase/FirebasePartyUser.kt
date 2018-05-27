package org.faziodev.wc2018.types.firebase

data class FirebasePartyUser(val name: String, val teams: Map<String, String>? = mapOf())