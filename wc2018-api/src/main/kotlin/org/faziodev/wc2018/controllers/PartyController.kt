package org.faziodev.wc2018.controllers

import org.faziodev.wc2018.services.PartyService
import org.faziodev.wc2018.types.PartyUser
import org.faziodev.wc2018.types.Party
import org.faziodev.wc2018.types.RankingType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/party")
@CrossOrigin()
class PartyController {

    @Autowired
    lateinit var partyService: PartyService

    @GetMapping("/test")
    fun getTestParty(): Party {
        return Party("TSTPTY", "Test Party", PartyUser("TESTUSER", "Test User"))
    }

    @GetMapping("")
    fun getAllParties(): List<Party>? {
        return this.partyService.getAllParties()
    }

    @GetMapping("", params = ["userId"])
    fun getPartiesByUserId(@RequestParam(value = "userId") userId: String): List<Party>? {
        return this.partyService.getPartiesByUserId(userId)
    }

    @GetMapping("/tokens", params = ["userId"])
    fun getPartyTokensByUserId(@RequestParam(value = "userId") userId: String): List<String?>? {
        return this.partyService.getPartyTokensByUserId(userId)
    }

    @GetMapping("/{partyToken}")
    fun getPartyByToken(@PathVariable("partyToken") partyToken: String): Party? {
        return this.partyService.getPartyByToken(partyToken)
    }

    @PostMapping("")
    fun createNewParty(@RequestBody party: Party): Party {
        return this.partyService.createNewParty(party)
    }

    @DeleteMapping("/{partyToken}")
    fun deleteParty(@PathVariable("partyToken") partyToken: String) {
        return this.partyService.deleteParty(partyToken)
    }

    @PostMapping("/{partyToken}/user")
    fun addUserToParty(@PathVariable("partyToken") partyToken: String, @RequestBody user: PartyUser) {
        return this.partyService.addUserToParty(partyToken, user)
    }

    @PostMapping("/{partyToken}/users")
    fun addMultipleUsersToParty(@PathVariable("partyToken") partyToken: String, @RequestBody users: List<PartyUser>) {
        return this.partyService.addMultipleUsersToParty(partyToken, users)
    }

    @DeleteMapping("/{partyToken}/user")
    fun removeUserFromParty(@PathVariable("partyToken") partyToken: String, @RequestParam(name = "userId") userId: String): Party? {
        return this.partyService.removeUserFromParty(partyToken, userId)
    }

    @PostMapping("/{partyToken}/teams")
    fun distributeTeamsForParty(
        @PathVariable("partyToken") partyToken: String,
        @RequestParam(name = "rankingType") rankingType: RankingType,
        @RequestParam(name = "teamsPerUser") teamsPerUser: Int): Party? {

        return this.partyService.distributeTeamsForParty(partyToken, rankingType, teamsPerUser)
    }

    @GetMapping("token")
    fun generatePartyToken(): String {
        return this.partyService.generatePartyToken()
    }
}