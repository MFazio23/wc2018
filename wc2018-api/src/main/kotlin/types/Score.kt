package dev.mfazio.wwc2019.types

data class Score(val homeId: String, val awayId: String, val homeScore: Int, val awayScore: Int) {

    fun calculateAllStats(): Map<String, Stats> = mapOf(
        homeId to this.calculateHomeStats(),
        awayId to this.calculateAwayStats())

    fun calculateHomeStats(): Stats {
        return calculateStats(this.homeScore, this.awayScore)
    }

    fun calculateAwayStats(): Stats {
        return calculateStats(this.awayScore, this.homeScore)
    }

    private fun calculateStats(score: Int, otherScore: Int): Stats {
        return Stats(
            if (otherScore == 0) 1 else 0,
            if (score == otherScore) 1 else 0,
            score,
            if (score > otherScore) 1 else 0
        )
    }
}