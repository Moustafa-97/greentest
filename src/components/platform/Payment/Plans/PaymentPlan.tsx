"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "./functions/subscriptionFunc.data";
import styles from "./payment-plan.module.scss";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/../public/ZPLATFORM/A-Header/FootLogo.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { CurrentTier } from "./types/subscriptionTypes.data";
const PaymentPlan = () => {
  const token = getToken();
  const accessToken = token ? token.accessToken : "";

  const router = useRouter();
  const { data: tiers, isLoading, error } = useQuery({
    queryKey: ["subscriptionTiers"],
    queryFn: subscriptionService.getSubscriptionTiers,
  });

  const [currentPlan, setCurrentPlan] = useState<CurrentTier>();

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/subscriptions/my-subscription`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => setCurrentPlan(response.data));
  }, [accessToken]);

  if (isLoading)
    return (
      <div className="text-center py-10">Loading subscription plans...</div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading subscription plans
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Help us to make sustainable culture</h1>
      </div>
      <div className={styles.allPlansContainer}>
        {tiers?.map((tier, index) => (
          <div
            key={tier.id}
            className={`${styles.planContainer} ${
              index === 2 ? styles.three : styles.other
            }`}
          >
            <div className={styles.planIcon}>
              <Image src={logo} alt="logo" loading="lazy" />
              <h2 className={styles.planName}>{tier.name}</h2>
              <p className={styles.planPrice}>
                {tier.price === 0 ? "Free" : `$${tier.price}`}
                <span>{tier.price === 0 ? "" : "/month"}</span>
              </p>
            </div>
            <button
              onClick={() => {
                router.push(`payment/${tier.id}`);
              }}
              className={styles.planButton}
            >
              {currentPlan?.tier.id === tier.id
                ? "Current Plan"
                : `Select ${tier.name}`}
            </button>
            <div className={styles.line}></div>
            <ul className={styles.planFeatures}>
              <p>Features</p>
              {tier.benefits.map((benefit, index) => (
                <li key={index} className={styles.planFeature}>
                  <span className={styles.check}>
                    <FaCheckCircle />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPlan;
