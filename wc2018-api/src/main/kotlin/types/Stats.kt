package dev.mfazio.wwc2019.types

data class Stats(val cs: Int = 0, val d: Int = 0, val g: Int = 0, val w: Int = 0, val eliminated: Boolean = false) {
    operator fun plus(other: Stats): Stats {
        return Stats(
            this.cs + other.cs,
            this.d + other.d,
            this.g + other.g,
            this.w + other.w,
            this.eliminated || other.eliminated
        )
    }

    operator fun Stats?.plus(other: Stats): Stats {
        return other
    }
}