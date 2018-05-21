package org.faziodev.wc2018.fragments

import android.app.AlertDialog
import android.content.Context
import android.content.DialogInterface
import android.net.Uri
import android.os.Bundle
import android.support.v4.app.Fragment
import android.text.InputType
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.github.kittinunf.fuel.httpPost
import com.google.gson.Gson

import org.faziodev.wc2018.R
import org.faziodev.wc2018.types.api.BasicPartyOwner
import org.faziodev.wc2018.types.api.CreateParty
import org.jetbrains.anko.*
import org.jetbrains.anko.appcompat.v7.tintedEditText
import org.jetbrains.anko.custom.async
import org.jetbrains.anko.support.v4.alert
import org.jetbrains.anko.support.v4.dip
import org.jetbrains.anko.support.v4.toast

/**
 * A simple [Fragment] subclass.
 * Activities that contain this fragment must implement the
 * [DashboardFragment.OnFragmentInteractionListener] interface
 * to handle interaction events.
 * Use the [DashboardFragment.newInstance] factory method to
 * create an instance of this fragment.
 *
 */
class DashboardFragment : Fragment() {

    private var listener: OnFragmentInteractionListener? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_dashboard, container, false)

        view.findViewById<Button>(R.id.join_party).setOnClickListener { joinPartyClicked() }
        view.findViewById<Button>(R.id.create_party).setOnClickListener { createPartyClicked() }

        return view
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is OnFragmentInteractionListener) {
            listener = context
        } else {
            throw RuntimeException(context.toString() + " must implement OnFragmentInteractionListener")
        }
    }

    override fun onDetach() {
        super.onDetach()
        listener = null
    }

    private fun joinPartyClicked() {
        val builder: AlertDialog.Builder = AlertDialog.Builder(this.activity)

        builder.setTitle("Join a Party")
        builder.setNegativeButton("Cancel") {_, _ -> }
        val contentView = LayoutInflater.from(context).inflate(R.layout.join_party_dialog, null)
        builder.setView(contentView)
        builder.setPositiveButton("Join") { _, _ ->
            val partyTokenField = contentView.findViewById<EditText>(R.id.join_party_dialog_token)

        }

        val dialog = builder.create()

        dialog.show()
    }

    private fun createPartyClicked() {
        val builder: AlertDialog.Builder = AlertDialog.Builder(this.activity)

        builder.setTitle("Create a Party")
        builder.setNegativeButton("Cancel") {_, _ -> }
        val contentView = LayoutInflater.from(context).inflate(R.layout.join_party_dialog, null)
        builder.setView(contentView)
        builder.setPositiveButton("Create") { _, _ ->
            val partyTokenField = contentView.findViewById<EditText>(R.id.join_party_dialog_token)
            val party = CreateParty(partyTokenField.text.toString(), BasicPartyOwner("TestID123", "Test Owner"))
            doAsync {
                "http://fazbook:8080/party"
                    .httpPost()
                    .body(Gson().toJson(party))
                    .response {_, _, result -> Toast.makeText(context, "Done posting? $result", Toast.LENGTH_SHORT).show() }
            }
        }

        val dialog = builder.create()

        dialog.show()
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     *
     *
     * See the Android Training lesson [Communicating with Other Fragments]
     * (http://developer.android.com/training/basics/fragments/communicating.html)
     * for more information.
     */
    interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        fun onFragmentInteraction(uri: Uri)
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @return A new instance of fragment DashboardFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance() =
            DashboardFragment().apply {}
    }
}
