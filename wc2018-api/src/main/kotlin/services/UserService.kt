package dev.mfazio.wwc2019.services

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.UserRecord
import org.springframework.stereotype.Service

@Service
class UserService{
    fun getUserById(userId: String): UserRecord? {
        val auth: FirebaseAuth = FirebaseAuth.getInstance()

        return auth.getUserAsync(userId).get()
    }
}