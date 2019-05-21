package dev.mfazio.wwc2019.types

data class Party(
    var token: String?,
    val name: String,
    val owner: PartyUser,
    var users: Map<String, PartyUser>? = mapOf(owner.id to owner))