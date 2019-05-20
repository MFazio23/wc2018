package org.faziodev.wc2018.types

data class Ranking(val name: String, val fifa: Int?, val elo: Int?, val spi: Int?, val random: Int? = -1) {
    fun getMap(): Map<RankingType, Int> {
        return mapOf(
            RankingType.FIFA to (this.fifa ?: -1),
            RankingType.ELO to (this.elo ?: -1),
            RankingType.SPI to (this.spi ?: -1),
            RankingType.Random to (this.random ?: -1)
        )
    }
}