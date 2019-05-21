package dev.mfazio.wwc2019.controllers

import dev.mfazio.wwc2019.services.RankingService
import dev.mfazio.wwc2019.types.Ranking
import dev.mfazio.wwc2019.types.Team
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/rankings")
@CrossOrigin()
class RankingController {

    @Autowired
    lateinit var rankingService: RankingService

    @PostMapping("")
    fun loadRankings() {
        return this.rankingService.loadRankings()
    }

    @GetMapping("")
    fun getRankings() : Map<String, Ranking>? {
        return this.rankingService.getRankings()
    }

    @GetMapping("/teams")
    fun getTeamsWithRankings() : List<Team>? {
        return this.rankingService.getTeamsWithRankings()
    }
}