package dev.mfazio.wwc2019.controllers

import com.google.firebase.auth.UserRecord
import dev.mfazio.wwc2019.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/user")
@CrossOrigin()
class UserController {

    @Autowired
    lateinit var userService: UserService

    @GetMapping("")
    fun getUserById(@RequestParam(value = "userId") userId: String) : UserRecord? {
        return this.userService.getUserById(userId)
    }
}