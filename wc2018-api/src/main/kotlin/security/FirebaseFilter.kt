package dev.mfazio.wwc2019.security

import com.google.firebase.auth.FirebaseAuth
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.GenericFilterBean
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
@Order(1)
class FirebaseFilter : GenericFilterBean() {

    val pathsToIgnore: List<String> = listOf(
        "/rankings",
        "/status",
        "/scores"
    )

    override fun doFilter(request: ServletRequest?, response: ServletResponse?, chain: FilterChain?) {

        val httpServletRequest: HttpServletRequest = request as HttpServletRequest
        val httpServletResponse: HttpServletResponse = response as HttpServletResponse

        if (httpServletRequest.method != "OPTIONS" && validatePath(httpServletRequest.servletPath)) {
            val authHeader = httpServletRequest.getHeader("Authorization")

            if (authHeader == null) {
                httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED)
                return
            }

            val firebaseAuth: FirebaseAuth = FirebaseAuth.getInstance()
            val firebaseToken = firebaseAuth.verifyIdTokenAsync(authHeader.removePrefix("Bearer ")).get()

            if (firebaseToken == null) {
                httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED)
                return
            }

            println("Auth. Header: $authHeader, Method: ${httpServletRequest.method}, Firebase Name: ${firebaseToken.name}, Firebase UID: ${firebaseToken.uid}")
        }

        chain?.doFilter(request, response)
    }

    fun validatePath(path: String): Boolean {
        return !this.pathsToIgnore.contains(path)
    }
}