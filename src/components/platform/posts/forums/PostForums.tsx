/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, lazy, Suspense } from "react";
import axios from "axios";
import styles from "./PostForum.module.css";

import { useForm } from "react-hook-form";
import { MdOutlineFilterList } from "react-icons/md";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { getToken } from "@/Utils/userToken/LocalToken";
const ForumCard = lazy(() => import("./ForumsCard/ForumCard"));

type ParentType = {
  name: string;
  id: string;
};
type Topic = {
  id: string;
  name: string;
  parentId: string;
  parent: ParentType;
}[];
function PostForums() {
  const localeS = getToken();
  const accessToken = localeS ? localeS.accessToken : null;

  const [openTopics, setOpenTopics] = React.useState(false);
  const topicsRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        topicsRef.current &&
        !topicsRef.current.contains(event.target as Node)
      ) {
        setOpenTopics(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);
  console.log(errors);

  const [posts, setPosts] = React.useState<any[]>([]);
  const [section, setSection] = React.useState<
    "doubt" | "need" | "dream" | "all"
  >("all");
  const [topics, setTopics] = React.useState<Topic>();
  const [mainTopicId, setMainTopicId] = React.useState<string | "all">("all");
  const limit = "5";
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [prevPage, setPrevPage] = React.useState(page);
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/forum?limit=${limit}&${
          section === "all" ? "" : `section=${section}`
        }&${
          mainTopicId === "all" ? "" : `mainTopicId=${new Number(mainTopicId)}`
        }&page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setPosts((prev) => {
          // If page changed, append data
          if (prevPage !== page && page !== 1) {
            return [...prev, ...res.data];
          }
          // If section or mainTopicId changed, replace data
          return res.data;
        });

        setPrevPage(page); // Store the previous page for comparison
      })
      .catch((err) => {
        setErrorMessage("An Error Occurred");
        setIsLoading(false);
        console.log(err);
      });
  }, [section, mainTopicId, page]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/topics`)
      .then((res) => setTopics(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h3>Forums</h3>
          </div>
          <div className={styles.filterSection}>
            <ul>
              <li
                style={section === "all" ? { color: "#97B00F" } : { color: "" }}
                onClick={() => {
                  setPage(1);
                  setSection("all");
                }}
              >
                all
              </li>
              <li
                style={
                  section === "doubt" ? { color: "#97B00F" } : { color: "" }
                }
                onClick={() => {
                  setPage(1);
                  setSection("doubt");
                }}
              >
                doubt
              </li>
              <li
                style={
                  section === "dream" ? { color: "#97B00F" } : { color: "" }
                }
                onClick={() => {
                  setPage(1);
                  setSection("dream");
                }}
              >
                dream
              </li>
              <li
                style={
                  section === "need" ? { color: "#97B00F" } : { color: "" }
                }
                onClick={() => {
                  setPage(1);
                  setSection("need");
                }}
              >
                need
              </li>
            </ul>
          </div>
          <div className={styles.filterTopics}>
            <div
              onClick={() => setOpenTopics(!openTopics)}
              className={styles.topicsBtn}
            >
              <p>
                <span>
                  <MdOutlineFilterList />
                </span>{" "}
                filter
              </p>
            </div>
            {openTopics && (
              <div ref={topicsRef} className={styles.topicsList}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className={styles.filter}>
                    <input
                      {...register("filter")}
                      onClick={() => {
                        setMainTopicId("all");
                        handleSubmit(onSubmit);
                        setOpenTopics(false);
                      }}
                      type="radio"
                      value="all"
                      id="all"
                      checked={mainTopicId === "all"}
                    />
                    <label htmlFor="all">All</label>
                  </div>
                  {topics &&
                    topics?.map((topic) => (
                      <div key={topic.id} className={styles.filter}>
                        <input
                          {...register("filter")}
                          onClick={() => {
                            setMainTopicId(topic.id);
                            handleSubmit(onSubmit);
                            setOpenTopics(false);
                          }}
                          type="radio"
                          value={topic.id}
                          id={topic.id}
                          checked={mainTopicId === topic.id}
                        />
                        <label htmlFor={topic.id}>{topic.name}</label>
                      </div>
                    ))}
                </form>
              </div>
            )}
          </div>
        </div>
        <div className={styles.body}>
          {isLoading ? (
            <div className={styles.noPosts}>
              <LoadingTree />
            </div>
          ) : errorMessage === "" ? (
            posts.length === 0 ? (
              <div className={styles.noPosts}>
                <p>No posts found</p>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className={styles.noPosts}>
                    <LoadingTree />
                  </div>
                }
              >
                <ForumCard
                  section={section}
                  posts={posts}
                  page={page}
                  setPage={setPage}
                />
              </Suspense>
            )
          ) : (
            <div className={styles.noPosts}>
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PostForums;
