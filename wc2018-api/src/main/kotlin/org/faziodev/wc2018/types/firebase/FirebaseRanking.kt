package org.faziodev.wc2018.types.firebase

import org.faziodev.wc2018.types.Ranking

data class FirebaseRanking(val name: String, val fifa: Int?, val elo: Int?, val spi: Int?) {
    companion object {
        fun convertFromRanking(ranking: Ranking): FirebaseRanking {
            return FirebaseRanking(
                ranking.name,
                ranking.fifa,
                ranking.elo,
                ranking.spi
            )
        }
    }
}