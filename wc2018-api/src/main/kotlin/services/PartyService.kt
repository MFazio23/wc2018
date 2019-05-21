package dev.mfazio.wwc2019.services

import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.jackson.responseObject
import com.google.auth.oauth2.GoogleCredentials
import com.google.gson.Gson
import dev.mfazio.wwc2019.types.*
import dev.mfazio.wwc2019.types.firebase.FirebaseParty
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class PartyService(@Autowired val teams: List<Team>, @Autowired val googleCredentials: GoogleCredentials) :
    BaseApiService(googleCredentials) {

    private val validPartyTokenCharacters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789".toList()
    private val partyTokenLength = 6

    @Autowired
    lateinit var rankingsService: RankingService

    fun getAllParties(): List<Party>? {
        val accessToken = this.getAccessToken()
        val (_, _, result) = "$firebaseBaseUrl/parties.json"
            .httpGet(listOf("access_token" to accessToken))
            .responseObject<Map<String, Party>>()

        return result.get().map { (token, party) -> party.copy(token = token) }
    }

    fun getPartiesByUserId(userId: String): List<Party>? {
        //TODO: Make this better.
        return this.getAllParties()?.filter { it.users?.any { (id) -> id == userId } ?: false }
    }

    fun getPartyTokensByUserId(userId: String): List<String?>? {
        //TODO: Make this better.
        return this.getAllParties()
            ?.filter { it.users?.any { (id) -> id == userId } ?: false }
            ?.map { party -> party.token }
    }

    fun createNewParty(party: Party): Party {
        var partyToken: String
        do {
            partyToken = this.generatePartyToken()
        } while (this.getPartyByToken(partyToken) != null)

        val updatedParty = party.copy(owner = party.owner, token = partyToken)
        this.saveParty(updatedParty)

        return updatedParty
    }

    fun deleteParty(partyToken: String) {
        val partyRef = getDatabaseReference("parties/$partyToken")
        partyRef.removeValueAsync()
    }

    fun getPartyByToken(partyToken: String): Party? {
        val accessToken = this.getAccessToken()
        val (_, _, result) = "$firebaseBaseUrl/parties/$partyToken.json"
            .httpGet(listOf("access_token" to accessToken))
            .responseString()

        return Gson().fromJson(result.component1(), Party::class.java)
    }

    fun addUserToParty(partyToken: String, user: PartyUser) {
        val party: Party = this.getPartyByToken(partyToken) ?: return

        if (party.users?.count() ?: 0 < teams.size) {
            this.saveParty(party.copy(users = party.users?.plus(user.id to user)))
        }
    }

    fun addMultipleUsersToParty(partyToken: String, users: List<PartyUser>) {
        users.forEach { user -> addUserToParty(partyToken, user) }
    }

    fun removeUserFromParty(partyToken: String, userIdToDelete: String): Party? {
        val party: Party = this.getPartyByToken(partyToken) ?: return null

        val newParty = party.copy(users = party.users?.filter { (userId, _) -> userIdToDelete != userId })

        this.saveParty(newParty)

        return newParty
    }

    fun generatePartyToken(): String {
        val shuffledTokens = this.validPartyTokenCharacters.shuffled()
        val tokenList: List<Char> = shuffledTokens.take(this.partyTokenLength)

        return tokenList.joinToString("")
    }

    fun distributeTeamsForParty(partyToken: String, rankingType: RankingType, teamsPerUser: Int): Party? {
        val party: Party = this.getPartyByToken(partyToken) ?: return null
        val users: Map<String, PartyUser> = party.users ?: return party
        if (teamsPerUser <= 0 || users.size * teamsPerUser > teams.size) return party
        val rankedTeams = this.rankingsService.getTeamsWithRankings() ?: return party

        val sortedTeams = rankedTeams
            .sortedBy { it.rankings?.get(rankingType) }
            .subList(0, users.size * teamsPerUser)
        val splitTeams = sortedTeams
            .chunked(users.size) { it.shuffled() }
            .filter { it.size == users.size }
        val usersWithTeams = users.values
            .withIndex()
            .associate { (ind, user) ->
                user.id to user.copy(
                    teams = splitTeams.associate { teamList -> teamList[ind].id to teamList[ind].name })
            }

        val partyWithTeams = party.copy(users = usersWithTeams)

        this.saveParty(partyWithTeams)

        return partyWithTeams
    }

    private fun saveParty(party: Party) {
        val firebaseParty = FirebaseParty(
            party.token,
            party.name,
            PartyOwner(party.owner.id, party.owner.name),
            party.users
        )

        val partyRef = getDatabaseReference("parties/${party.token}")
        partyRef.setValueAsync(firebaseParty).get()
    }

    fun getRemainingTeamsForParty(partyToken: String): List<Team> {
        val partyUsers: List<PartyUser> =
            this.getPartyByToken(partyToken)
                ?.users
                ?.values
                ?.filter { it.teams != null } ?: return listOf()

        val teams: List<String> = partyUsers.flatMap { it.teams?.values ?: listOf() }

        return this.teams.filter { !teams.contains(it.name) }.shuffled()
    }
}