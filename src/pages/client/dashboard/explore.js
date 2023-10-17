import React, { useEffect, useState } from "react";
// import UserNavbar from "@/components/navbar/UserNavbar";
import styles from "@/styles/client/dashboard/ExplorePsychics.module.css";
import Slider from "react-slick";
import classNames from "classnames";
import { AiOutlineRight } from "react-icons/ai";
import Link from "next/link";
import UserNavbar from "../../../components/navbars/UserNavbar";
import { explorePsychicData } from "@/store/client/explorepsychic";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";

const Explorephysics = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
      speed: 2000,
      autoplaySpeed: 2000,
    // infinite: false,
    // cssEase: "linear",
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1220,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const dispatch = useDispatch();
  const [exploreData, setExploreData] = useState([]);

  useEffect(() => {
    dispatch(explorePsychicData()).then((res) => {
      if (!res.error) {
        setExploreData(res.payload);
      }
    });
  }, []);
  const RenderingNames = {
    STYLES: "Styles",
    TOOLS: "Tools",
    ABILITIES: "Abilities",
    READING_TOPIC: "Reading Topics",
  };

  return (
    <>
      <Head>
        <title>Explore | Psychix</title>
        <meta name="description" content="ExplorePhysics | Psychix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserNavbar />

      <section className={styles.wrapper_main}>
        <div className={classNames(styles.cntr_main, "container-fluid")}>
          <div className="row">
            <div className="col-md-12">
              <div className={styles.heading_para_first}>
                <h2>Explore Psychics</h2>
              </div>
            </div>
            {exploreData?.map((ele, index) => {
              return (
                <div className="col-md-12 col-sm-12 col-lg-12">
                  <p
                    className={classNames(styles.subtitle, "")}
                    style={{ textTransform: "capitalize" }}
                  >
                    Explore by {RenderingNames[ele._id].toLocaleLowerCase()}
                  </p>
                  <div className="slider">
                    <Slider {...settings}>
                      {ele?.list.map((item) => {
                        return (
                          <Link
                                href={`/client/dashboard/type?type=${item.type}&value=${item.name}`}
                              >
                          <div key={item.id} className={styles.first_slide}>
                            <div className={styles.main_box}>
                              <p>IX</p>
                              <div className={styles.cent_img}>
                                <img src={item.image} alt="img-exp" />
                              </div>
                            </div>
                            <div className={styles.box_footer}>
                              <h6 >{item.name}</h6>
                              <Link
                                href={`/client/dashboard/type?type=${item.type}&value=${item.name}`}
                              >
                                Explore <AiOutlineRight />
                              </Link>
                            </div>
                          </div>
                          </Link>
                        );
                      })}
                    </Slider>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Explorephysics;
