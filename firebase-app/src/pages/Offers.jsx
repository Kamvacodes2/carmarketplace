import { useEffect, useState } from "react"
import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore"
import { db } from "../firebase"
import { toast } from 'react-toastify';
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

export default function Offers() {
  const [offers,setOffers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedDeal,setLastFetchedDeal] = useState(null)

  useEffect(()=>{
    async function fetchUserDeals(){
      try {
        const docRef = collection(db,'car-deals')
        // create query for reference
        const q = query(docRef, orderBy('timestamp', 'desc'),limit(8))
        //add snapshot
        const querySnap = await getDocs(q)
        const deals = []  
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedDeal(lastVisible) 
        querySnap.forEach((doc)=> {
          const data = doc.data()
          return deals.push({
            id: doc.id,
            data: data
          })
        }) 
        setOffers(deals)    
        setLoading(false)
      } catch (error) {
        toast.error("Could not find offers")
      }
    }
    fetchUserDeals()
  },[])

  async function onFetchMore(){
    try {
      const docRef = collection(db,'car-deals')
      // create query for reference
      const q = query(docRef, orderBy('timestamp', 'desc'),startAfter(lastFetchedDeal), limit(4))
      //add snapshot
      const querySnap = await getDocs(q)
      const deals = []  
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedDeal(lastVisible) 
      querySnap.forEach((doc)=> {
        const data = doc.data()
        return deals.push({
          id: doc.id,
          data: data
        })
      }) 
      setOffers((prevState)=>[...prevState, ...deals])    
      setLoading(false)
    } catch (error) {
      toast.error("Could not find offers")
    }
  }
  return (
    <div className="max-w-6xl max-auto px-3 ">
      <h1 className="text-3xl text-center mt-6 font-bold">Offers</h1>
      {loading ? (
        <Spinner/> 
      ) : offers && offers.length > 0 ? (
        <>
        <main>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {offers.map((deal)=>(
              <ListingItem key={deal.id} deal={deal.data} id={deal.id} />
            ))}
          </ul>
        </main>
        {lastFetchedDeal && (
          <div className="flex justify-center items-center">
            <button onClick={onFetchMore} className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6
            hover:border-slate-600 rounded transition duration-150 ease-in-out ">Load more</button>
          </div>
      )}
        </>
      ): (
        <p>There are no current offers available</p>
      )}
    </div>
  )
}
