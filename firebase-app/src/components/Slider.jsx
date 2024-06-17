import React, { useEffect, useState } from 'react';
import { collection, limit, orderBy, query, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from 'swiper';
import "swiper/css/bundle";
import { useNavigate } from 'react-router-dom';

export default function Slider() {
    const [deals, setDeals] = useState(null);
    const [loading, setLoading] = useState(true);
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserDeal() {
            const dealsRef = collection(db, 'car-deals');
            const q = query(dealsRef, orderBy('timestamp', 'desc'), limit(5));
            const querySnap = await getDocs(q);
            let deals = [];
            querySnap.forEach((doc) => {
                const data = doc.data();
                if (data.imgUrls && data.imgUrls.length > 0) {
                    deals.push({
                        id: doc.id,
                        data: data,
                    });
                } else {
                    console.warn(`Document with id ${doc.id} has no imgUrls or imgUrls is empty.`);
                }
            });
            setDeals(deals);
            setLoading(false);
        }
        fetchUserDeal();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (!deals || deals.length === 0) {
        return <></>;
    }

    return (
        deals && (
            <>
                <Swiper 
                    slidesPerView={1} 
                    navigation 
                    pagination={{ type: 'progressbar' }} 
                    effect='fade'
                    modules={[EffectFade]} 
                    autoplay={{ delay: 2000 }}
                >
                    {deals.map((deal, id) => (
                        <SwiperSlide key={id} onClick={() => navigate(`/category/${deal.data.type}/${deal.id}`)}>
                            <div className='relative w-full h-[300px] overflow-hidden'>
                                <img src={deal.data.imgUrls[0]} alt={deal.data.brand} className='w-full h-full object-cover' />
                            </div>
                            <p className='text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d]
                                shadow-lg opacity-90 p-2 rounded'>
                                {deal.data.brand}
                            </p>
                            <p className='text-[#f1faee] absolute left-1 bottom-3 font-semibold max-w-[90%] bg-[#e63946]
                                shadow-lg opacity-90 p-2 rounded'>
                                R {deal.data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        )
    );
}
