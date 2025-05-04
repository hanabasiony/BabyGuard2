import React from "react";
import Slider from "react-slick";

import img1 from '../../assets/images/sample img/grocery-banner-2.jpeg'
import img2 from '../../assets/images/sample img/blog-img-1.jpeg'
import img3 from '../../assets/images/sample img/blog-img-2.jpeg'
import img4 from '../../assets/images/sample img/banner-4.jpeg'





export default function SimpleSlider() {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <div className="px-5 flex">
            <div className="w-3/4">
                <Slider {...settings}>
                    <div>
                        <div>
                            <img src={img1} classNam="w-full h-80" alt='slider' />
                        </div>
                    </div>
                    <div>
                        <div>
                            <img src={img2} className="w-full h-88 " alt='slider' />
                        </div>
                    </div>
                    <div>
                        <div>
                            <img src={img3} className="w-full h-88  " alt='slider' />
                        </div>
                    </div>
                    <div>
                        <div>
                            <img src={img4} className="w-full h-88  " alt='slider' />
                        </div>
                    </div>


                </Slider>
            </div>

            <div className="w-1/4">
                <img src={img2} classNam="w-full block" alt='slider' />
                <img src={img3} classNam="w-full block" alt='slider' />
            </div>
        </div>
    );
}