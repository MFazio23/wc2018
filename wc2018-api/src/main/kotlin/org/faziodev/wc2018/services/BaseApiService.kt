package org.faziodev.wc2018.services

import com.google.auth.oauth2.GoogleCredentials
import org.faziodev.wc2018.util.Config
import org.springframework.beans.factory.annotation.Autowired

open class BaseApiService(@Autowired private val googleCredentials: GoogleCredentials) {

    protected val firebaseBaseUrl: String = "https://wc2018-2bad0.firebaseio.com/${Config.firebaseEnv}"

    protected fun getAccessToken() : String {
        val scoped: GoogleCredentials = this.googleCredentials.createScoped(listOf(
            "https://www.googleapis.com/auth/firebase.database",
            "https://www.googleapis.com/auth/userinfo.email"
        ))
        scoped.refresh()
        return scoped.accessToken.tokenValue
    }
}