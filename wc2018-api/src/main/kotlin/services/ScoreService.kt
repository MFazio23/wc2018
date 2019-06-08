package dev.mfazio.wwc2019.services

import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.jackson.responseObject
import com.google.auth.oauth2.GoogleCredentials
import dev.mfazio.wwc2019.types.Score
import dev.mfazio.wwc2019.types.Stats
import dev.mfazio.wwc2019.types.Team
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.select.Elements
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Service
class ScoreService(@Autowired val teams: List<Team>, googleCredentials: GoogleCredentials) : BaseApiService(googleCredentials) {

    fun getScores(): Map<String, Score>? {
        val accessToken = this.getAccessToken()
        val (_, _, result) = "$firebaseBaseUrl/scores.json"
            .httpGet(listOf("access_token" to accessToken))
            .responseObject<Map<String, Score>>()

        return result.component1()
    }

    fun getStats(): Map<String, Stats>? {
        val accessToken = this.getAccessToken()
        val (_, _, result) = "$firebaseBaseUrl/stats.json"
            .httpGet(listOf("access_token" to accessToken))
            .responseObject<Map<String, Stats>>()

        return result.component1()
    }

    fun processStats(): Map<String, Stats> {
        val results = loadResults()

        return this.calculateStats(results)
    }

    fun loadResults(): Map<String, Score> {
        val results: MutableMap<String, Score> = mutableMapOf()

        val doc: Document = Jsoup.connect("https://www.fifa.com/womensworldcup/matches/").get()

        val fixtures: Elements = doc.select(".fi-mu.result")

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

        val scoreRef = getDatabaseReference("scores")
        scoreRef.setValueAsync(results).get()

        return results.toMap()
    }

    fun calculateStats(scores: Map<String, Score>): Map<String, Stats> {
        val startingStats: Map<String, Stats> = this.getStats() ?: mapOf()

        val stats: MutableMap<String, Stats>
            = startingStats.mapValues { Stats(eliminated = it.value.eliminated) }.toMutableMap()

        for(score in scores.values) {
            stats.merge(score.homeId, score.calculateHomeStats()) { t: Stats, u: Stats -> t + u}
            stats.merge(score.awayId, score.calculateAwayStats()) { t: Stats, u: Stats -> t + u}
        }

        this.teams.filterNot{stats.keys.contains(it.id)}.forEach {
            stats.merge(it.id, Stats(0, 0, 0, 0)) { t, u -> t + u}
        }

        val scoreRef = getDatabaseReference("stats")
        scoreRef.setValueAsync(stats).get()

        getDatabaseReference("statsLastUpdated").setValueAsync(
            LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        )

        return stats.toMap()
    }
}