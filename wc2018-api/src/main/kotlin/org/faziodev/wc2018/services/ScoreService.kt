package org.faziodev.wc2018.services

import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.jackson.responseObject
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.database.FirebaseDatabase
import org.faziodev.wc2018.types.Score
import org.faziodev.wc2018.types.Stats
import org.faziodev.wc2018.types.Team
import org.faziodev.wc2018.util.Config
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.select.Elements
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Service
class ScoreService(@Autowired val teams: List<Team>, googleCredentials: GoogleCredentials) : BaseApiService(googleCredentials) {

    private val database: FirebaseDatabase = FirebaseDatabase.getInstance()

    fun getScores(): Map<String, Score>? {
        val accessToken = this.getAccessToken()
        val (_, _, result) = "$firebaseBaseUrl/scores.json"
            .httpGet(listOf("access_token" to accessToken))
            .responseObject<Map<String, Score>>()

        return result.component1()
    }

    fun getStats() {

    }

    fun processStats(): Map<String, Stats> {
        val results = loadResults()

        return this.calculateStats(results)
    }

    fun loadResults(): Map<String, Score> {
        val results: MutableMap<String, Score> = mutableMapOf()

        val doc: Document = Jsoup.connect("https://www.fifa.com/worldcup/matches/").get()

        val fixtures: Elements = doc.select("div.result")

        for(fixture in fixtures) {
            val id: String = fixture.dataset()["id"] ?: continue

            val gameScore = fixture.select("span.fi-s__scoreText").text()?.trim() ?: continue
            val homeScore = gameScore.substringBefore("-").toIntOrNull() ?: continue
            val awayScore = gameScore.substringAfter("-").toIntOrNull() ?: continue

            val score = Score(
                fixture.select(".home [class$=nTri]").text(),
                fixture.select(".away [class$=nTri]").text(),
                homeScore,
                awayScore
            )

            results[id] = score
        }

        val scoreRef = this.database.getReference("${Config.firebaseEnv}/scores")
        scoreRef.setValueAsync(results).get()

        return results.toMap()
    }

    fun calculateStats(scores: Map<String, Score>): Map<String, Stats> {
        val stats: MutableMap<String, Stats> = mutableMapOf()

        for(score in scores.values) {
            stats.merge(score.homeId, score.calculateHomeStats()) { t: Stats, u: Stats -> t + u}
            stats.merge(score.awayId, score.calculateAwayStats()) {t: Stats, u: Stats -> t + u}
        }

        this.teams.filterNot{stats.keys.contains(it.id)}.forEach {
            stats.merge(it.id, Stats(0,0,0,0)) { t, u -> t + u}
        }

        val scoreRef = this.database.getReference("${Config.firebaseEnv}/stats")
        scoreRef.setValueAsync(stats).get()

        this.database.getReference("${Config.firebaseEnv}/statsLastUpdated").setValueAsync(
            LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        )

        return stats.toMap()
    }
}