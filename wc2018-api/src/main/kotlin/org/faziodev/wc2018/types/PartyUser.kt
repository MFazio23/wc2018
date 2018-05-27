package org.faziodev.wc2018.types

data class PartyUser(val id: String, val name: String, val teams: Map<String, String>? = mapOf())