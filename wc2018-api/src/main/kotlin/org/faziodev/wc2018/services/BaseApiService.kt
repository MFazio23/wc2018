package org.faziodev.wc2018.services

import com.google.auth.oauth2.GoogleCredentials
import org.springframework.beans.factory.annotation.Autowired

open class BaseApiService(@Autowired private val googleCredentials: GoogleCredentials) {

    protected fun getAccessToken() : String {
        val scoped: GoogleCredentials = this.googleCredentials.createScoped(listOf(
            "https://www.googleapis.com/auth/firebase.database",
            "https://www.googleapis.com/auth/userinfo.email"
        ))
        scoped.refresh()
        return scoped.accessToken.tokenValue
    }
}