package dev.mfazio.wwc2019.types.firebase

import dev.mfazio.wwc2019.types.PartyOwner
import dev.mfazio.wwc2019.types.PartyUser

data class FirebaseParty(
    var token: String?,
    val name: String,
    val owner: PartyOwner,
    var users: Map<String, PartyUser>? = mapOf())