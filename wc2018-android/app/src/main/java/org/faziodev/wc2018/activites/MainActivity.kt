package org.faziodev.wc2018.activites

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.support.v4.app.FragmentManager
import android.support.v7.app.AppCompatActivity
import android.view.View
import android.widget.Toast
import com.firebase.ui.auth.AuthUI
import kotlinx.android.synthetic.main.app_bar_main.*
import org.faziodev.wc2018.R
import org.faziodev.wc2018.fragments.DashboardFragment
import org.faziodev.wc2018.fragments.PartyFragment

class MainActivity : AppCompatActivity(),
    DashboardFragment.OnFragmentInteractionListener,
    PartyFragment.OnFragmentInteractionListener {
    override fun onFragmentInteraction(uri: Uri) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setSupportActionBar(toolbar)

        /*val fragmentManager: FragmentManager = this.supportFragmentManager

        val dashboardFragment: DashboardFragment = DashboardFragment.newInstance()

        val fragmentTransaction = fragmentManager.beginTransaction()

        fragmentTransaction.replace(R.id.main_content_fragment, dashboardFragment)
        fragmentTransaction.addToBackStack(null)
        fragmentTransaction.commit()*/
    }

    override fun onResume() {
        super.onResume()
    }

    override fun onBackPressed() {
        //TODO: Add logic to alert them if they're about to leave.
        super.onBackPressed()
    }


    fun logOutOfFirebase(view: View) {
        AuthUI.getInstance()
            .signOut(this)
            .addOnCompleteListener({
                Toast.makeText(this, "You are logged out.", Toast.LENGTH_LONG).show()

                val intent = Intent(this, LoginActivity::class.java)
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                this.startActivity(intent)
            })
    }
}
