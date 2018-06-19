package org.faziodev.wc2018.types

data class Stats(val cs: Int, val d: Int, val g: Int, val w: Int) {
    operator fun plus(other: Stats): Stats {
        return Stats(
            this.cs + other.cs,
            this.d + other.d,
            this.g + other.g,
            this.w + other.w
        )
    }

    operator fun Stats?.plus(other: Stats): Stats {
        return other
    }
}