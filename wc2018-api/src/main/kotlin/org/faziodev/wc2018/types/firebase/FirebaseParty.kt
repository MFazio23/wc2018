package org.faziodev.wc2018.types.firebase

import org.faziodev.wc2018.types.PartyOwner
import org.faziodev.wc2018.types.PartyUser

data class FirebaseParty(
    var token: String?,
    val name: String,
    val owner: PartyOwner,
    var users: Map<String, PartyUser>? = mapOf())