package org.faziodev.wc2018.activities

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.support.design.widget.NavigationView
import android.support.v4.view.GravityCompat
import android.support.v7.app.ActionBarDrawerToggle
import android.support.v7.app.AppCompatActivity
import android.view.Menu
import android.view.MenuItem
import com.firebase.ui.auth.AuthUI
import com.google.firebase.auth.FirebaseAuth
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.app_bar_main.*
import kotlinx.android.synthetic.main.nav_header_main.view.*
import org.faziodev.wc2018.R
import org.faziodev.wc2018.fragments.*
import org.jetbrains.anko.contentView
import org.jetbrains.anko.design.snackbar
import org.jetbrains.anko.toast

class MainActivity : AppCompatActivity(),
    NavigationView.OnNavigationItemSelectedListener,
    OverviewFragment.OnFragmentInteractionListener,
    PartiesFragment.OnFragmentInteractionListener,
    PrivacyTermsFragment.OnFragmentInteractionListener,
    RankingsFragment.OnFragmentInteractionListener {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setSupportActionBar(toolbar)

        val toggle = ActionBarDrawerToggle(
            this, drawer_layout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close)
        drawer_layout.addDrawerListener(toggle)
        toggle.syncState()

        nav_view.setNavigationItemSelectedListener(this)
        nav_view.menu.findItem(R.id.nav_parties)?.let {
            this.onNavigationItemSelected(it)
        }

        val auth: FirebaseAuth = FirebaseAuth.getInstance()
        if (auth.currentUser != null) {
            val headerView = nav_view.getHeaderView(0)
            headerView?.nav_header_username?.text = auth.currentUser?.displayName
            headerView?.nav_header_email?.text = auth.currentUser?.email
        }
    }

    override fun onBackPressed() {
        if (drawer_layout.isDrawerOpen(GravityCompat.START)) {
            drawer_layout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        return when (item.itemId) {
            R.id.action_logout -> {
                this.logOutUser()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        // Handle navigation view item clicks here.
        val fragment: TitledFragment = when (item.itemId) {
            R.id.nav_parties -> PartiesFragment.newInstance()
            R.id.nav_overview -> OverviewFragment.newInstance()
            R.id.nav_rankings -> RankingsFragment.newInstance()
            R.id.nav_privacy_terms -> PrivacyTermsFragment.newInstance()
            R.id.nav_logout -> {
                this.logOutUser()
                return false
            }
            else -> PartiesFragment.newInstance()
        }

        this.supportFragmentManager.beginTransaction().replace(R.id.main_content, fragment).commit()

        toolbar.title = fragment.title

        drawer_layout.closeDrawer(GravityCompat.START)
        return true
    }

    override fun onFragmentInteraction(uri: Uri) {
        toast("Fragment interaction").show()
    }

    private fun logOutUser() {
        AuthUI.getInstance()
            .signOut(this)
            .addOnCompleteListener({
                //Toast.makeText(this, "You are logged out.", Toast.LENGTH_LONG).show()
                if (this.contentView != null) snackbar(this.contentView!!, "You are now logged out.")

                val intent = Intent(this, LoginActivity::class.java)
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                this.startActivity(intent)
            })

    }
}
