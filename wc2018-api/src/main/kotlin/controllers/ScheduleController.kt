package dev.mfazio.wwc2019.controllers

import dev.mfazio.wwc2019.services.ScheduleService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/schedule")
@CrossOrigin()
class ScheduleController {

    @Autowired
    lateinit var scheduleService: ScheduleService

    @PostMapping("")
    fun loadSchedule() {
        return this.scheduleService.loadSchedule()
    }
}