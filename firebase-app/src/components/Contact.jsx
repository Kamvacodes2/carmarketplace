import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function Contact({ userRef, deal }) {
    const [owner, setOwner] = useState(null);
    const [message, setMessage] = useState("")

    useEffect(() => {
        async function getOwner() {
            const docRef = doc(db, 'users', userRef)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setOwner(docSnap.data())
            } else {
                toast.error("Could not find owner details")
            }
        }
        getOwner();
    }, [userRef])

    function onChange(e) {
        setMessage(e.target.value)  
    }
    return (
        <>
             {owner !== null && (
                <div className='flex flex-col w-full'>
                    <p>
                        Contact {owner.name} for the {deal.brand} {deal.model}
                    </p>
                    <div className='mt-3 mb-6'>
                        <textarea name="message" id="message" cols="30" rows="2" value={message}
                        onChange={onChange} className='w-[50%] px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded
                        transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'></textarea>
                    </div>
                    <a href={`mailto: ${owner.email}?Subject=${deal.name}&body=${message}`}>
                        <button className='px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md 
                        hover:bg-blue-700 hover:shadow-lg 
                        focus:bg-blue-700 focus:shadow-lg 
                        active:bg-blue-800 active:shadow-lg
                        transition duration-150 ease-in-out w-[50%] text-center
                        mb-6' 
                        type='button'>Send Message</button>
                    </a>
                </div>
             )}
        </>
    )
}
