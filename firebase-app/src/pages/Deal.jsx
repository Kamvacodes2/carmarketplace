import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css/bundle';
import { FaShare } from "react-icons/fa";
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';

export default function Deal() {
    const auth = getAuth();
    const params = useParams();
    const [deal, setDeals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactOwner, setContactOwner] = useState(false);
    SwiperCore.use([Autoplay, Navigation, Pagination]);

    useEffect(() => {
        async function fetchUserDeal() {
            const docRef = doc(db, 'car-deals', params.dealID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setDeals(docSnap.data());
                setLoading(false);
            }
        }
        fetchUserDeal();
    }, [params.dealID]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <main>
            <div className="flex flex-col lg:flex-row max-w-6xl lg:mx-auto p-4 space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="lg:w-1/2">
                    <Swiper
                        slidesPerView={1}
                        navigation
                        pagination={{ type: "progressbar" }}
                        effect='fade'
                        modules={[EffectFade]}
                        autoplay={{ delay: 3000 }}
                    >
                        {deal.imgUrls.map((url, index) => (
                            <SwiperSlide key={index}>
                                <div className='relative w-full overflow-hidden h-[500px]'>
                                    <img
                                        src={deal.imgUrls[index]}
                                        alt={deal.brand}
                                        className='object-cover w-full h-full'
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className="lg:w-1/2 flex flex-col justify-between">
                    <div>
                        <div className='fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center' onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setShareLinkCopied(true);
                            setTimeout(() => {
                                setShareLinkCopied(false);
                            }, 2000);
                        }}>
                            <FaShare className='text-lg font-light text-slate-500' />
                        </div>
                        {shareLinkCopied && (
                            <p className='fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2'>Link Copied</p>
                        )}
                        <div className='w-full'>
                            <p className='text-2xl font-bold mb-3 text-blue-900'>
                                {deal.brand} - {deal.model} - R {deal.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </p>
                            <div className='flex justify-start items-center space-x-4'>
                                <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
                                    Total kms: {deal.kms.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>
                                <div>
                                    <p className='bg-green-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md'>
                                        {deal.type === "manual" ? "Manual" : "Automatic"}
                                    </p>
                                </div>
                            </div>
                            <p className='mt-3 mb-4'>
                                <span className='font-semibold'>Description - </span>
                                {deal.description}
                            </p>
                        </div>
                    </div>
                    {deal.userRef !== auth.currentUser?.uid && !contactOwner && (
                        <div className='mt-6'>
                            <button
                                onClick={() => setContactOwner(true)}
                                className='px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg text-center transition duration-150 ease-in-out'>
                                Contact Owner
                            </button>
                        </div>
                    )}
                    {contactOwner && (
                        <Contact userRef={deal.userRef} deal={deal} />
                    )}
                </div>
            </div>
        </main>
    );
}
