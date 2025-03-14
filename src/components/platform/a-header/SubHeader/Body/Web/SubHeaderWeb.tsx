import React, { useState } from "react";
import Image from "next/image";
import styles from "../../SubHeader.module.css";
import toRight from "@/../public/ZPLATFORM/A-iconsAndBtns/ToRights.svg";
import likes from "@/../public/ZPLATFORM/header/like.svg";
import message from "@/../public/ZPLATFORM/header/message.svg";
import addNew from "@/../public/ZPLATFORM/header/addNew.svg";
import post from "@/../public/ZPLATFORM/header/posts.svg";
import { Suspense } from "react";
import Categories from "../../categoriesDimond/Categories";
import GreenChallenges from "../../Green-Challenges/GreenChallenges";
import MyChallenges from "../../doChallenges/myChallenges/MyChallenges";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import Link from "next/link";
import { useLocale } from "next-intl";
function SubHeaderWeb() {
  const locale = useLocale();
  const actions = [
    {
      icon: likes,
      title: "Likes",
      href: "/likes",
    },
    {
      icon: message,
      title: "Messages",
      href: "/messages",
    },
    {
      icon: post,
      title: "Posts",
      href: "/posts",
    },
    {
      icon: addNew,
      title: "Add post",
      href: "/add-new",
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const openSlider = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className={styles.navBtns}>
        <div className={styles.next} onClick={openSlider}>
          <Image
            src={toRight}
            alt="prev"
            width={100}
            height={100}
            loading="lazy"
          />
        </div>
      </div>
      <div className={styles.cardsContainer}>
        <div className={styles.diamond}>
          <Suspense
            fallback={
              <div className={styles.loading}>
                <LoadingTree />
              </div>
            }
          >
            <Categories />
          </Suspense>
        </div>
        <div className={styles.greenChallenge}>
          <Suspense
            fallback={
              <div className={styles.loading}>
                <LoadingTree />
              </div>
            }
          >
            <GreenChallenges />
          </Suspense>
        </div>

        <div
          className={`${styles.subcontainer} ${
            isOpen ? styles.openWindow : styles.closeWindow
          }`}
        >
          <div className={styles.challenges}>
            <Suspense
              fallback={
                <div className={styles.loading}>
                  <LoadingTree />
                </div>
              }
            >
              <MyChallenges />
            </Suspense>
          </div>
        </div>
      </div>
      <div className={styles.links}>
        {actions.map((action) => (
          <div key={action.href} className={styles.link}>
            <Link
              href={`/${locale}/${action.href}`}
              className={
                action.href === "/add-new"
                  ? styles.postLink
                  : styles.regularLink
              }
            >
              <Image src={action.icon} alt={action.title} loading="lazy" />
              <span>{action.title}</span>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default SubHeaderWeb;
