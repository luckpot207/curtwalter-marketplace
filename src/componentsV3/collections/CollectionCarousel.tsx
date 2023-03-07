import { Swiper, SwiperSlide } from 'swiper/react';
import {Pagination} from "swiper";
import {CarouselSlide, CarouselSlideProps} from "./CarouselSlide";
import {NavLink} from "react-router-dom";

type Props = {
  title: string,
  data: CarouselSlideProps[]
  url?: string
}

export function CollectionCarousel({title, url, data}: Props) {
  return (
    <section className='mx-auto'>
      <div className="px-4 flex items-center justify-center sm:justify-between lg:px-0">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          {title}
        </h2>
        {url && (
          <h4 className="w-full text-right">
            {" "}
            <NavLink to={url} className="cursor-pointer mr-4 hover:text-velvet dark:hover:text-white">
              View all
            </NavLink>
          </h4>
        )}
      </div>
      <Swiper
        // install Swiper modules
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        effect={"cards"}
        freeMode={true}
        pagination={{ clickable: true }}
        breakpoints={{
          520: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 5,
          },
          1536: {
            slidesPerView: 6,
          }
        }}
      >
        {data.map((item, idx) => (
          <SwiperSlide key={idx}>
            <CarouselSlide
              image={item.image}
              imageType={item.imageType}
              title={item.title}
              url={item.url}
              floorPrice={item.floorPrice ? item.floorPrice : undefined}
              listed={item.listed ? item.listed : undefined}
              mintAt={item.mintAt ? item.mintAt : undefined}
              twitterUrl={item.twitterUrl ? item.twitterUrl : undefined}
              addedAt={item.addedAt ? item.addedAt : undefined}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}