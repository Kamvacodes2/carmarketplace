import { useState, useEffect } from "react";
import Slider from "../components/Slider";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Home() {
  //Offers
  const [offerList, setOfferList] = useState(null)
  useEffect(() => {
    async function fetchUserDeals() {
      try {
        //get reference
        const dealRef = collection(db, 'car-deals')
        //create the query
        const q = query(dealRef, orderBy('timestamp', 'desc'), limit(4))
        //execute the query
        const querySnap = await getDocs(q)
        const deals = []
        querySnap.forEach((doc) => {
          const data = doc.data()
          return deals.push({
            id: doc.id,
            data: data
          })
        })
        setOfferList(deals)
        console.log(deals)
      } catch (error) {
        console.log(error)
      }
    }
    fetchUserDeals()
  }, [])
  return <><Slider />
    <div className="max-w-6xl mx-auto pt-4 space-y-6">
      {offerList && offerList.length > 0 && (
        <div className="max-w-6xl mx-auto pt-4 space-y-6">
          <h2 className="px-3 text-2xl mt-6 font-semibold">
            Recent offers
          </h2>
          <Link to='/offers'>
            <p className="px-3 text-sm text-blue-500 hover:text-blue-800 transition duration-150 ease-in-out
          ">Show more offers</p>
          </Link>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            {offerList.map((offer) => (
              <ListingItem key={offer.id} deal={offer.data} id={offer.id} />
            ))}
          </ul>
        </div>
      )}
    </div>
  </>
}