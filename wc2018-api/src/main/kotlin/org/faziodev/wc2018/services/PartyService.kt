package org.faziodev.wc2018.services

import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.jackson.responseObject
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.database.FirebaseDatabase
import com.google.gson.Gson
import org.faziodev.wc2018.types.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class PartyService(@Autowired val googleCredentials: GoogleCredentials) : BaseApiService(googleCredentials) {

    private val validPartyTokenCharacters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789".toList()
    private val partyTokenLength = 6

    private val database: FirebaseDatabase = FirebaseDatabase.getInstance()
    @Autowired lateinit var rankingsService: RankingService

    fun getAllParties(): List<Party>? {
        val accessToken = this.getAccessToken()
        val (_, _, result) = "https://wc2018-2bad0.firebaseio.com/parties.json"
            .httpGet(listOf("access_token" to accessToken))
            .responseObject<Map<String, Party>>()

        return result.component1()?.map {(token, party) -> party.copy(token = token) }
    }

    fun getPartiesByUserId(userId: String): List<Party>? {
        //TODO: Make this better.
        return this.getAllParties()?.filter { it.users?.any { it.id == userId } ?: false }
    }

    fun getPartyTokensByUserId(userId: String): List<String?>? {
        //TODO: Make this better.
        return this.getAllParties()?.filter { it.users?.any { it.id == userId } ?: false }?.map { party -> party.token }
    }

    fun createNewParty(party: Party) : Party {
        var partyToken: String
        do {
            partyToken = this.generatePartyToken()
        } while (this.getPartyByToken(partyToken) != null)

        val updatedParty = party.copy(owner = party.owner.copy(isOwner = true), token = partyToken)
        this.saveParty(updatedParty)

        return updatedParty
    }

    fun deleteParty(partyToken: String) {
        val partyRef = this.database.getReference("parties/$partyToken")
        partyRef.removeValueAsync()
    }

    fun getPartyByToken(partyToken: String) : Party? {
        val accessToken = this.getAccessToken()
        val (_, _, result) = "https://wc2018-2bad0.firebaseio.com/parties/$partyToken.json"
            .httpGet(listOf("access_token" to accessToken))
            .responseString()

        return Gson().fromJson(result.component1(), Party::class.java)
    }

    fun addUserToParty(partyToken: String, user: PartyUser) {
        val party: Party = this.getPartyByToken(partyToken) ?: return

        this.saveParty(party.copy(users = party.users?.plus(user)))
    }

    fun removeUserFromParty(partyToken: String, userId: String) {
        val party: Party = this.getPartyByToken(partyToken) ?: return

        this.saveParty(party.copy(users = party.users?.filter { partyUser -> partyUser.id != userId }))
    }

    fun generatePartyToken() : String {
        val shuffledTokens = this.validPartyTokenCharacters.shuffled()
        val tokenList: List<Char> = shuffledTokens.take(this.partyTokenLength)

        return tokenList.joinToString("")
    }

    fun distributeTeamsForParty(partyToken: String, rankingType: RankingType, teamsPerUser: Int): Party? {
        val party: Party = this.getPartyByToken(partyToken) ?: return null
        val users: List<PartyUser> = party.users ?: return party
        if(teamsPerUser <= 0 || users.size * teamsPerUser > 32) return party
        val rankedTeams = this.rankingsService.getTeamsWithRankings() ?: return party

        val sortedTeams = rankedTeams.sortedBy { it.rankings?.get(rankingType) }.subList(0, users.size * teamsPerUser)
        val splitTeams = sortedTeams
            .chunked(users.size, { it -> it.shuffled()})
            .filter { it.size == users.size }
        val usersWithTeams = users
            .withIndex()
            .map {(ind, user) -> user.copy(teams = splitTeams.map { it[ind] })}

        val partyWithTeams = party.copy(users = usersWithTeams)

        this.saveParty(partyWithTeams)

        return partyWithTeams
    }

    private fun saveParty(party: Party) {
        val partyRef = this.database.getReference("parties/${party.token}")
        partyRef.setValueAsync(party).get()
    }
}