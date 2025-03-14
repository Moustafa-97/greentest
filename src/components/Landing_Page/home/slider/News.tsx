/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import styles from "./news.module.css";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import { useTranslations } from "next-intl";

function News() {
  const t = useTranslations('landing.news');
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 1, spacing: 25 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 25 },
      },
    },
    slides: { perView: 1 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  const card = () => {
    return (
      <>
        <div className={styles.card}>
          <div className={styles.img}></div>
          <div className={styles.title}>
            <h5>{t('technology')}</h5>
          </div>
          <div className={styles.context}>
            <h5>
              {t('ultimate')}
            </h5>
          </div>
          <div className={styles.text}>
            <h5>
              {t('AIWont')}
            </h5>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.user}>
              <div className={styles.img}></div>
              <div className={styles.name}>{t('hannah')}</div>
            </div>
            <div className={styles.readMore}>
              <Link href={""}>{t('readMore')}</Link>
              <FaArrowRight />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.newsHeader}>
          <div className={styles.title}>
            <h5>{t('news')}</h5>
            <h3>{t('seeGreenTeam')}</h3>
          </div>
          <div className={styles.arrows}>
            {loaded && instanceRef.current && (
              <>
                <Arrow
                  left
                  onClick={(e: any) =>
                    e.stopPropagation() || instanceRef.current?.prev()
                  }
                  disabled={currentSlide === 0}
                />

                <Arrow
                  onClick={(e: any) =>
                    e.stopPropagation() || instanceRef.current?.next()
                  }
                  disabled={
                    currentSlide ===
                    instanceRef.current.track.details.slides.length - 1
                  }
                />
              </>
            )}
          </div>
        </div>
        <div className={styles.newsSlider}>
          <div
            ref={sliderRef}
            // style={{ width: "fit-content" }}
            className={`keen-slider ${styles.slider}`}
          >
            <div className={`keen-slider__slide ${styles.slide}`}>{card()}</div>
            <div className={`keen-slider__slide ${styles.slide}`}>{card()}</div>
            <div className={`keen-slider__slide ${styles.slide}`}>{card()}</div>
            <div className={`keen-slider__slide ${styles.slide}`}>{card()}</div>
            <div className={`keen-slider__slide ${styles.slide}`}>{card()}</div>
            <div className={`keen-slider__slide ${styles.slide}`}>{card()}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default News;
function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
}) {
  const disabled = props.disabled ? `${styles.arrowDisabled}` : "";
  return (
    <svg
      onClick={props.onClick}
      className={`${styles.arrow} ${
        props.left ? `${styles.arrowLeft}` : `${styles.arrowRight}`
      } ${disabled}`}
      style={{ width: "64px" }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && <FaArrowLeft />}
      {!props.left && <FaArrowRight />}
    </svg>
  );
}
