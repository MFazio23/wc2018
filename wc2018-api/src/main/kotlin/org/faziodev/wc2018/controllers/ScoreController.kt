package org.faziodev.wc2018.controllers

import org.faziodev.wc2018.services.ScoreService
import org.faziodev.wc2018.types.Score
import org.faziodev.wc2018.types.Stats
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/scores")
@CrossOrigin()
class ScoreController {

    @Autowired
    lateinit var scoreService: ScoreService

    @GetMapping("")
    fun getScores(): Map<String, Score>? {
        return this.scoreService.getScores()
    }

    @GetMapping("/stats")
    fun getStats(): Map<String, Stats>? {
        return this.scoreService.getStats()
    }

    @PostMapping("")
    fun processStats(): Map<String, Stats> {
        return this.scoreService.processStats()
    }

}