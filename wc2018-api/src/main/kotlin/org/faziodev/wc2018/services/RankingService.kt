package org.faziodev.wc2018.services

import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.jackson.responseObject
import com.google.auth.oauth2.GoogleCredentials
import org.faziodev.wc2018.types.Ranking
import org.faziodev.wc2018.types.Team
import org.faziodev.wc2018.types.firebase.FirebaseRanking
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.select.Elements
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RankingService(@Autowired val teams: List<Team>, googleCredentials: GoogleCredentials) :
    BaseApiService(googleCredentials) {

    fun loadRankings() {
        val elo = this.loadELORankings()
        val fifa = this.loadFIFARankings()

        val rankings: Map<String, Ranking> = this.teams.associate { it.id to Ranking(it.name, fifa[it.id], elo[it.id]) }
        val fbRankings: Map<String, FirebaseRanking> =
            rankings.mapValues { (_, ranking) -> FirebaseRanking.convertFromRanking(ranking) }

        val rankingRef = getDatabaseReference("rankings")
        rankingRef.setValueAsync(fbRankings).get()
    }

    fun getTeamsWithRankings(): List<Team>? {
        val rankings: Map<String, Ranking> = this.getRankings()

        return teams.map { team -> team.copy(rankings = rankings[team.id]?.getMap()) }
    }

    fun getRankings(): Map<String, Ranking> {
        val accessToken = this.getAccessToken()
        val (_, _, result) = "$firebaseBaseUrl/rankings.json"
            .httpGet(listOf("access_token" to accessToken))
            .responseObject<Map<String, Ranking>>()

        val rankings: Map<String, Ranking> = result.component1() ?: return mapOf()

        val randomRankings: List<Int> = (1..32).toList().shuffled()

        var ind = 0

        return rankings.mapValues { it.value.copy(random = randomRankings[ind++]) }
    }

    private fun loadELORankings(): Map<String, Int> {
        val rankings: MutableMap<String, Int> = mutableMapOf()

        val (_, _, result) = "http://www.eloratings.net/2018_World_Cup.tsv".httpGet().responseString()

        val teams = result.component1()?.split("\n") ?: return mapOf()

        for (teamLine in teams) {
            val teamSplit: List<String> = teamLine.split("\t")

            val team: Team = this.teams.firstOrNull { t -> t.eloCode == teamSplit[2] } ?: return mapOf()

            rankings[team.id] = teamSplit[0].toInt()
        }

        return rankings.toMap()
    }

    private fun loadFIFARankings(): Map<String, Int> {
        val rankings: MutableMap<String, Int> = mutableMapOf()

        val doc: Document = Jsoup.connect("http://www.fifa.com/fifa-world-ranking/ranking-table/men/index.html").get()

        val rows: Elements = doc.select("table.tbl-ranking tr.anchor")

        for (row in rows) {
            val id: String = row.select(".tbl-countrycode").text()

            if (this.teams.any { t -> t.id == id }) {
                val ranking: Int? = row.select(".tbl-rank").text().toIntOrNull()
                if (ranking != null) {
                    rankings[id] = ranking
                }
            }
        }

        return rankings.toMap()
    }

}