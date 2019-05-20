package org.faziodev.wc2018

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import org.faziodev.wc2018.types.Team
import org.faziodev.wc2018.util.Config
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.core.io.ClassPathResource

@SpringBootApplication(exclude = [SecurityAutoConfiguration::class])
//@EnableGlobalMethodSecurity(securedEnabled = true)
class WC2018ApiApp(baseDBUrl: String = "https://wc2018-2bad0.firebaseio.com") {
    final var googleCredentials: GoogleCredentials

    init {
        val res = ClassPathResource("wc2018-2bad0-firebase-adminsdk-mjmfq-09f204e686.json")
        val serviceAccount = res.inputStream

        this.googleCredentials = GoogleCredentials.fromStream(serviceAccount)

        val options: FirebaseOptions = FirebaseOptions.Builder()
            .setCredentials(this.googleCredentials)
            .setDatabaseUrl(baseDBUrl)
            .build()

        FirebaseApp.initializeApp(options)
    }

    @Bean
    fun googleCredentials(): GoogleCredentials {
        return this.googleCredentials
    }

    @Bean
    fun teams(): List<Team> {
        return listOf(
            Team("FRA", "France", "FR", "A"),
            Team("KOR", "Korea Republic", "KR", "A"),
            Team("NOR", "Norway", "NO", "A"),
            Team("NGA", "Nigeria", "NG", "A"),
            Team("GER", "Germany", "DE", "B"),
            Team("CHN", "China", "CN", "B"),
            Team("ESP", "Spain", "ES", "B"),
            Team("RSA", "South Africa", "ZA", "B"),
            Team("AUS", "Australia", "AU", "C"),
            Team("ITA", "Italy", "IT", "C"),
            Team("BRA", "Brazil", "BR", "C"),
            Team("JAM", "Jamaica", "JM", "C"),
            Team("ENG", "England", "EN", "D"),
            Team("SCO", "Scotland", "SQ", "D"),
            Team("ARG", "Argentina", "AR", "D"),
            Team("JPN", "Japan", "JP", "D"),
            Team("CAN", "Canada", "CA", "E"),
            Team("CMR", "Cameroon", "CM", "E"),
            Team("NZL", "New Zealand", "NZ", "E"),
            Team("NED", "Netherlands", "NL", "E"),
            Team("USA", "USA", "US", "F"),
            Team("THA", "Thailand", "TH", "F"),
            Team("CHI", "Chile", "CL", "F"),
            Team("SWE", "Sweden", "SE", "F")
        )
    }
}

fun main(args: Array<String>) {
    runApplication<WC2018ApiApp>(*args)
}
