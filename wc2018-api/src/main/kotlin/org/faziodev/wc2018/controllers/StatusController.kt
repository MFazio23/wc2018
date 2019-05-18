package org.faziodev.wc2018.controllers

import org.faziodev.wc2018.util.Config
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/status")
@CrossOrigin()
class StatusController {

    @GetMapping("")
    fun checkStatus(): APIStatus {
        return APIStatus()
    }

    data class APIStatus(val firebaseEnv: String = Config.firebaseEnv, val firebaseYear: String = Config.firebaseYear)
}