import { getAuth, updateProfile } from "firebase/auth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from '../firebase';
import { toast } from "react-toastify";
import { IoCarSportSharp } from "react-icons/io5";
import ListingItem from "../components/ListingItem";



export default function Profile() {
    const auth = getAuth();
    const navigate = useNavigate();
    const [changeDetail, setChangeDetail] = useState(false);
    const [deals, setDeals] = useState(null);
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    function onLogout() {
        auth.signOut()
        navigate('/')
    }
    const { name, email } = formData

    function onChange(e) {
        setFormData((prevState) => ({
            ...prevState, [e.target.id]: e.target.value
        }))
    }

    async function onSubmit() {
        try {
            if (auth.currentUser.displayName !== name) {
                //update display name in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name
                });
                //update name in firestore
                const docRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(docRef, {
                    name
                })
            }
            toast.success('Profile updated successfully')
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    useEffect(() => {
        async function fetchUserDeal() {
            const dealsRef = collection(db, "car-deals");
            const q = query(dealsRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
            const querySnap = await getDocs(q)
            let deals = []
            querySnap.forEach((doc) => {
                return deals.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setDeals(deals)
            setLoading(false)
        }
        fetchUserDeal();
    }, [auth.currentUser.uid])

   async function onDelete(dealID) {
        if(window.confirm('Are you sure you want to delete?')) {
            await deleteDoc(doc(db, "car-deals", dealID))
            const updatedDeals = deals.filter(
                (deal)=> deal.id !== dealID
            );
            setDeals(updatedDeals)
            toast.success('Successfully deleted')
        }
    }
    
    function onEdit(dealID) {
        navigate(`/edit-deal/${dealID}`)
    }


    return (
        <>
            <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
                <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
                <div className="w-full md:w-[50%] mt-6 px-3">
                    <form action="">
                        {/*Name Input*/}
                        <input type="text" id="name" value={name} disabled={!changeDetail} onChange={onChange} className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`} />
                        {/*Email Input*/}
                        <input type="email" id="email" value={email} disabled className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out" />
                        <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
                            <p className="flex items-center">Do you want to change your name?
                                <span onClick={() => {
                                    changeDetail && onSubmit();
                                    setChangeDetail((prevState) => !prevState)
                                }} className="text-red-600 hover:text-red-800 transition ease-in-out duration-200 ml-1 cursor-pointer"> {changeDetail ? "Apply change" : "Edit"}</span>
                            </p>
                            <p onClick={onLogout} className="text-blue-600 hover:text-blue-800 transition ease-in-out duration-200 ml-1 cursor-pointer">
                                Sign out
                            </p>
                        </div>
                    </form>
                    <button type="submit" className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">
                        <Link to="/create-deal" className="flex justify-center  items-center">
                            <IoCarSportSharp className="mr-2 text-3xl bg-green-400 rounded-full p-1 border-2" />Sell your car
                        </Link>
                    </button>
                </div>
            </section>
            <div className="max-w-6xl px-3 mt-6 mx-auto">
                {!loading && deals.length > 0 && (
                    <>
                        <h2 className="text-2xl text-center font-semibold">My Car Offers</h2>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl-grid-cols-5 mt-6 mb-6">
                            {deals.map((deal)=>(
                                <ListingItem key={deal.id} id={deal.id} deal={deal.data} onDelete={()=> onDelete(deal.id)}
                                onEdit={()=> onEdit(deal.id)
                                }/>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </>
    )
}