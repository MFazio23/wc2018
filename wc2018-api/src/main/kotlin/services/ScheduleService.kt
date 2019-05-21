package dev.mfazio.wwc2019.services

import com.google.auth.oauth2.GoogleCredentials
import dev.mfazio.wwc2019.types.Fixture
import dev.mfazio.wwc2019.types.Team
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.select.Elements
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


@Service
class ScheduleService(@Autowired val teams: List<Team>, googleCredentials: GoogleCredentials) : BaseApiService(googleCredentials) {

    fun getMiddle(word : String) : String {
        val midIndex: Double = word.length.toDouble() / 2.0

        return word.substring(java.lang.Math.ceil(midIndex - 1.0).toInt(), java.lang.Math.floor(midIndex).toInt())

    }

    fun loadSchedule() {
        val schedule: MutableMap<String, Fixture> = mutableMapOf()

        val doc: Document = Jsoup.connect("http://www.fifa.com/worldcup/matches/").get()

        val fixtures: Elements = doc.select(".fixture")

        for(fixture in fixtures) {
            val id: String = fixture.dataset()?.get("id") ?: return

            schedule[id] = Fixture(
                fixture.selectFirst("[class\$=datetime]")?.dataset()?.get("utcdate"),
                fixture.selectFirst("[class\$=group]")?.text()?.removePrefix("Group "),
                fixture.selectFirst("[class\$=stadium]")?.text(),
                fixture.selectFirst("[class\$=venue]")?.text(),
                fixture.selectFirst(".home [class\$=nTri]")?.text(),
                fixture.selectFirst(".away [class\$=nTri]")?.text()
            )
        }

        val scheduleRef = getDatabaseReference("schedule")
        scheduleRef.setValueAsync(schedule).get()
    }
}