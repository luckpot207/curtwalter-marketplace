import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';
// import "swiper/components/pagination/pagination.css";
// import "swiper/components/effect-coverflow/effect-coverflow.css";
import { Top } from '../tops/Top';
import SwiperCore, { Pagination, EffectCoverflow } from "swiper";



export function Recommended() {
  SwiperCore.use([Pagination, EffectCoverflow]);
  return (
    <div className='relative h-full text-sm text-black m-0 p-0'>
      <div className=' w-full h-full bg-center bg-cover block'>
      <Swiper
        effect="fade"
        // grabCursor="true"
        // centeredSlides="true"
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
        }}

      >
        <SwiperSlide key={1}><Top /></SwiperSlide>
        <SwiperSlide key={2}><Top /></SwiperSlide>
        <SwiperSlide key={3}><Top /></SwiperSlide>
      </Swiper>
      </div>
    </div>
  );
};