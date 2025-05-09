// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import styles from "./Chalenges.module.css";
// import doIt from "@/../public/ZPLATFORM/challenges/doIt.svg";

import Image from "next/image";

import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import { Props } from "./types/ChallengeTypes.data";

function Challenges(props: Props) {
  const {
    challenges,
    setAddNew,
    setChallengeId,
    setDoItModal,
    setSection,
  } = props;

  return (
    <>
      <div className={styles.container}>
        {/*  */}
        {challenges.map((challenge) => (
          <div key={challenge.id} className={styles.challenge}>
            <div className={styles.challengeDetails}>
              <div className={styles.challengeImage}>
                <Image src={noAvatar} alt="image1" />
              </div>
              <div className={styles.challengeText}>
                <div className={styles.challengeIcon}>
                  <p>{challenge.topic.name}</p>
                </div>
                <h3 className={styles.challengeTitle}>{challenge.title}</h3>
                <p className={styles.challengeDescription}>
                  {challenge.description}
                </p>
              </div>
            </div>
            <div className={styles.challengeActions}>
              <button
                onClick={() => {
                  setDoItModal(true);
                  setSection("green-challenges");
                  setChallengeId(challenge.id);
                }}
                className={styles.challengeButton}
              >
                Do it
              </button>
              <button
                onClick={() => {
                  setChallengeId(challenge.id);
                  setAddNew(true);
                }}
                className={styles.challengeButton}
              >
                Done
              </button>
            </div>
          </div>
        ))}
        {/*  */}
      </div>
    </>
  );
}

export default Challenges;
