package org.faziodev.wc2018.types.api

data class CreateParty(val name: String, val owner: BasicPartyOwner)

data class BasicPartyOwner(val id: String, val name: String)