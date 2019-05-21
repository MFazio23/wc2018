package dev.mfazio.wwc2019.services

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import dev.mfazio.wwc2019.util.Config
import org.springframework.beans.factory.annotation.Autowired

abstract class BaseApiService(@Autowired private val googleCredentials: GoogleCredentials) {

    protected val firebaseBaseUrl: String =
        "https://wc2018-2bad0.firebaseio.com/${Config.firebaseYear}/${Config.firebaseEnv}"

    private val database: FirebaseDatabase = FirebaseDatabase.getInstance()

    protected fun getAccessToken(): String {
        val scoped: GoogleCredentials = this.googleCredentials.createScoped(
            listOf(
                "https://www.googleapis.com/auth/firebase.database",
                "https://www.googleapis.com/auth/userinfo.email"
            )
        )
        scoped.refresh()
        return scoped.accessToken.tokenValue
    }

    protected fun getDatabaseReference(path: String): DatabaseReference =
        this.database.getReference("${Config.firebaseYear}/${Config.firebaseEnv}/$path")
}