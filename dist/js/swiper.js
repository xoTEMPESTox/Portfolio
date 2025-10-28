new Swiper(".mySwiper", {
    slidesPerView: 3,
    loop: true,
    grabCursor: true,
    spaceBetween: 30,
    autoplay: {
        delay: 1500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
    breakpoints: {
        200: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        500: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        640: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        991: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        1020: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        1120: {
            slidesPerView: 3,
            spaceBetween: 40,
        },
    }
});

new Swiper(".mySwiperReviews", {
    slidesPerView: 1,
    loop: true,
    grabCursor: true,
    spaceBetween: 30,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
});