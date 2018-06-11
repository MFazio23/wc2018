package org.faziodev.wc2018.security

import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter

@Configuration
class SecurityConfig() : WebSecurityConfigurerAdapter() {
    override fun configure(http: HttpSecurity?) {
        http?.addFilterAfter(FirebaseFilter(), BasicAuthenticationFilter::class.java)
    }
}