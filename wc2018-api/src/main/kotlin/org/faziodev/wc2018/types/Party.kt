package org.faziodev.wc2018.types

import com.github.kittinunf.fuel.core.ResponseDeserializable
import com.google.gson.Gson

data class Party(
    var token: String?,
    val name: String,
    val owner: PartyUser,
    var users: List<PartyUser>? = listOf(owner)) {

    class Deserializer : ResponseDeserializable<Party> {
        override fun deserialize(content: String): Party? = Gson().fromJson(content, Party::class.java)
    }
}