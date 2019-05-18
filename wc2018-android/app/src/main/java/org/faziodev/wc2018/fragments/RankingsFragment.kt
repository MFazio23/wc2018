package org.faziodev.wc2018.fragments

import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.firebase.database.*

import org.faziodev.wc2018.R
import org.faziodev.wc2018.types.api.Rankings


/**
 * A simple [Fragment] subclass.
 * Activities that contain this fragment must implement the
 * [RankingsFragment.OnFragmentInteractionListener] interface
 * to handle interaction events.
 * Use the [RankingsFragment.newInstance] factory method to
 * create an instance of this fragment.
 *
 */
class RankingsFragment : TitledFragment() {
    private var listener: OnFragmentInteractionListener? = null

    override val title: String = "Rankings"

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {

        val db = FirebaseDatabase.getInstance()
        db.getReference("prod/rankings").addValueEventListener(object : ValueEventListener {
            override fun onDataChange(dataSnapshot: DataSnapshot) {
                val typeIndicator: GenericTypeIndicator<HashMap<String, Rankings>> = GenericTypeIndicator()
                val value = dataSnapshot.getValue(typeIndicator)
                println("New value $value")
            }

            override fun onCancelled(error: DatabaseError) {
                println("Rankings load failed.")
            }
        })

        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_rankings, container, false)
    }

    // TODO: Rename method, update argument and hook method into UI event
    fun onButtonPressed(uri: Uri) {
        listener?.onFragmentInteraction(uri)
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
         * @return A new instance of fragment RankingsFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance() = RankingsFragment().apply { }
    }
}
