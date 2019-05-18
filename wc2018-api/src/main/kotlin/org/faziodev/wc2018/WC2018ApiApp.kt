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
            Team("RUS", "Russia", "RU", "A"),
            Team("KSA", "Saudi Arabia", "SA", "A"),
            Team("EGY", "Egypt", "EG", "A"),
            Team("URU", "Uruguay", "UY", "A"),
            Team("POR", "Portugal", "PT", "B"),
            Team("ESP", "Spain", "ES", "B"),
            Team("MAR", "Morocco", "MA", "B"),
            Team("IRN", "Iran", "IR", "B"),
            Team("FRA", "France", "FR", "C"),
            Team("AUS", "Australia", "AU", "C"),
            Team("PER", "Peru", "PE", "C"),
            Team("DEN", "Denmark", "DK", "C"),
            Team("ARG", "Argentina", "AR", "D"),
            Team("ISL", "Iceland", "IS", "D"),
            Team("CRO", "Croatia", "HR", "D"),
            Team("NGA", "Nigeria", "NG", "D"),
            Team("BRA", "Brazil", "BR", "E"),
            Team("SUI", "Switzerland", "CH", "E"),
            Team("CRC", "Costa Rica", "CR", "E"),
            Team("SRB", "Serbia", "RS", "E"),
            Team("GER", "Germany", "DE", "F"),
            Team("MEX", "Mexico", "MX", "F"),
            Team("SWE", "Sweden", "SE", "F"),
            Team("KOR", "Korea Republic", "KR", "F"),
            Team("BEL", "Belgium", "BE", "G"),
            Team("PAN", "Panama", "PA", "G"),
            Team("TUN", "Tunisia", "TN", "G"),
            Team("ENG", "England", "EN", "G"),
            Team("POL", "Poland", "PL", "H"),
            Team("SEN", "Senegal", "SN", "H"),
            Team("COL", "Colombia", "CO", "H"),
            Team("JPN", "Japan", "JP", "H")
        )
    }
}

fun main(args: Array<String>) {
    runApplication<WC2018ApiApp>(*args)
}
