package org.faziodev.wc2018.types

data class PartyUser(val id: String, val name: String, var isOwner: Boolean = false, val teams: List<Team>? = listOf())