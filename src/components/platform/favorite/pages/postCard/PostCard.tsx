"use client";
import React, {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import styles from "./postCard.module.css";
import Image from "next/image";
import admin from "@/../public/auth/user.png";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { getToken } from "@/Utils/userToken/LocalToken";
import { PostsData, Props } from "./types/postTypes.data";
import { fetchPosts } from "./functions/postFunc.data";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
const PostSlider = lazy(() => import("./POSTSLIDER/PostSlider"));

function PostCard(props: Props) {
  const {
    commentsPage,
    setCommentsPage,
    setDoItModal,
    setCommentModal,
    setPostComments,
    rerender,
    setPostId,
    setPostMedia,
  } = props;

  const router = useRouter();
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [postContent, setPostContent] = useState<PostsData>([]);
  const [isMounted, setIsMounted] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const limit = 5;

  // Fix hydration mismatch by ensuring client-side only operations
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize token to prevent unnecessary recalculations
  const accessToken = useMemo(() => {
    // Only run on client side
    if (typeof window === "undefined") return null;
    const localS = getToken();
    return localS ? localS.accessToken : null;
  }, []);

  // Scroll handlers with useCallback to prevent recreating on each render
  const prevSlide = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  }, []);

  // Fetch posts on subtopic/page change only - but only after component mounts on client
  useEffect(() => {
    // if (!isMounted || !mainTopic) {
    //   if (!mainTopic) setIsLoading(false);
    //   return;
    // }

    fetchPosts(
      page,
      limit,
      setPostContent,
      setErrorMessage,
      accessToken,
      setIsLoading
    );
  }, [page, isLoading, accessToken, isMounted]);

  // IntersectionObserver for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const handlePages = useCallback(() => {
    setPage((prevPage) => (postContent.length < 4 ? 1 : prevPage + 1));
  }, [postContent.length]);

  useEffect(() => {
    if (inView && isMounted) {
      handlePages();
    }
  }, [inView, handlePages, isMounted]);

  // Memoize time formatter to prevent recreation on each render
  const formatTimeDifference = useCallback(
    (targetDate: string): string => {
      if (!isMounted) return ""; // Prevent SSR/CSR mismatch

      const target = new Date(targetDate);
      const now = new Date();
      const differenceInMs = now.getTime() - target.getTime();
      const differenceInSeconds = Math.floor(differenceInMs / 1000);

      if (differenceInSeconds < 60) {
        return `${differenceInSeconds}S`;
      } else if (differenceInSeconds < 3600) {
        const minutes = Math.floor(differenceInSeconds / 60);
        return `${minutes}m`;
      } else if (differenceInSeconds < 86400) {
        const hours = Math.floor(differenceInSeconds / 3600);
        return `${hours}hr`;
      } else {
        const days = Math.floor(differenceInSeconds / 86400);
        return `${days}D`;
      }
    },
    [isMounted]
  );

  // Navigate to profile helper
  const navigateToProfile = useCallback(
    (authorId: string) => {
      router.push(`/${locale}/profile/${authorId}`);
    },
    [router, locale]
  );

  // Navigate to post helper
  const navigateToPost = useCallback(
    (postId: string) => {
      router.push(`/${locale}/feeds/posts/${postId}`);
    },
    [router, locale]
  );

  const renderPostContent = useMemo(() => {
    if (!isMounted) {
      return (
        <div className={styles.noPosts}>
          <LoadingTree />
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className={styles.noPosts}>
          <LoadingTree />
        </div>
      );
    }

    if (errorMessage && isMounted) {
      return (
        <div className={styles.noPosts}>
          <p>Error Loading posts</p>
        </div>
      );
    }

    if (postContent.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>No posts found</p>
        </div>
      );
    }

    return (
      <Suspense
        fallback={
          <div className={styles.noPosts}>
            <LoadingTree />
          </div>
        }
      >
        {postContent.map((post, index) => (
          <div
            key={post.post.id}
            ref={index === postContent.length - 1 ? ref : null}
            className={styles.container}
          >
            <div className={styles.header}>
              <div
                onClick={() => navigateToProfile(post.author.id)}
                style={{ cursor: "pointer", zIndex: 100 }}
                className={styles.userAvatar}
              >
                <Image
                  src={post.author.avatar || admin}
                  alt={`${post.author.username}'s avatar`}
                  width={40}
                  height={40}
                  priority={index < 3}
                />
              </div>
              <div className={styles.details}>
                <div
                  onClick={() => navigateToProfile(post.author.id)}
                  style={{ cursor: "pointer" }}
                  className={styles.userName}
                >
                  <p>
                    {post.author.name || post.author.username} <span>@{post.author.username}</span>
                    {isMounted && (
                      <span>
                        {" "}
                        . {formatTimeDifference(post.post.createdAt)}
                      </span>
                    )}
                  </p>
                </div>
                {post.media.length > 0 && (
                  <div
                    onClick={() => navigateToPost(post.post.id)}
                    style={{ cursor: "pointer" }}
                    className={styles.post}
                  >
                    {post.post.content.length > 50 ? (
                      <p style={{ cursor: "pointer" }}>
                        {post.post.content.slice(0, 40)}{" "}
                        <span style={{ cursor: "pointer" }}>Read More... </span>
                      </p>
                    ) : (
                      <p style={{ cursor: "pointer" }}>{post.post.content}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.media}>
              <div className={styles.postslider}>
                {isMounted && (
                  <PostSlider
                    post={post}
                    media={post.media}
                    content={post.post.content}
                    commentPage={commentsPage}
                    setCommentPage={setCommentsPage}
                    likes={post.likeCount}
                    dislikes={post.dislikeCount}
                    comments={post.commentCount}
                    userReactionType={post.userReactionType}
                    hasDoReaction={post.hasDoReaction}
                    setDoItModal={setDoItModal}
                    setCommentModal={setCommentModal}
                    setPostComments={setPostComments}
                    postId={post.post.id}
                    rerender={rerender}
                    setPostId={setPostId}
                    setPostMedia={setPostMedia}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </Suspense>
    );
  }, [
    setPostMedia,
    isMounted,
    isLoading,
    errorMessage,
    postContent,
    ref,
    navigateToProfile,
    formatTimeDifference,
    navigateToPost,
    commentsPage,
    setCommentsPage,
    setDoItModal,
    setCommentModal,
    setPostComments,
    rerender,
    setPostId,
  ]);

  // Handle server-side rendering vs client-side rendering
  if (typeof window === "undefined") {
    return (
      <div className={styles.noPosts}>
        <LoadingTree />
      </div>
    );
  }

  return (
    <>
      <div className={styles.postContainer}>
        {isMounted && (
          <div className={styles.sliderBtns}>
            <div className={styles.arrow} onClick={prevSlide}>
              <IoIosArrowBack />
            </div>
            <div className={styles.arrow} onClick={nextSlide}>
              <IoIosArrowForward />
            </div>
          </div>
        )}
        <div ref={bodyRef} className={styles.body}>
          {renderPostContent}
        </div>
      </div>
    </>
  );
}

export default React.memo(PostCard);
