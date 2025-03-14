"use client";
import React, { Suspense } from "react";
import styles from "../../SubHeader.module.css";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import Link from "next/link";
import Image from "next/image";
import Categories from "../../categoriesDimond/Categories";
import MyChallenges from "../../doChallenges/myChallenges/MyChallenges";
import GreenChallenges from "../../Green-Challenges/GreenChallenges";
import likes from "@/../public/ZPLATFORM/header/like.svg";
import message from "@/../public/ZPLATFORM/header/message.svg";
import addNew from "@/../public/ZPLATFORM/header/addNew.svg";
import { useLocale } from "next-intl";
import post from "@/../public/ZPLATFORM/header/posts.svg";
function SubHeaderRes() {
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

  return (
    <>
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

      <div className={styles.suggested}>
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
    </>
  );
}

export default SubHeaderRes;
