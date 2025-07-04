"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ProductCard from "./Card/ProductCard";
import styles from "./ProductSection.module.css";
import ProductsFilter from "./filterComponent/ProductsFilter";
import { Products, ProductsCategory } from "./types/productsTypes.data";
import { fetchProducts } from "./functions/productsService";
import { getToken } from "@/Utils/userToken/LocalToken";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import Image from "next/image";
import toRight from "@/../public/ZPLATFORM/A-iconsAndBtns/ToRights.svg";
import AddNewProduct from "./modal/AddNewProduct";
import MessageModal from "./modal/MessageModal";

function ProductSection(props: { slug: string }) {
  const { slug } = props;
  const [section, setSection] = useState<ProductsCategory>(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [sendMessage, setSendMessage] = useState(false);
  const [sellerId, setSellerId] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [products, setProducts] = useState<Products[]>([]);

  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  // Constants
  const LIMIT = 5;
  const bodyRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch events data
  const loadProducts = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      try {
        setIsLoading(true);
        const data = await fetchProducts({
          page: pageNum,
          limit: LIMIT,
          accessToken,
          topicId: section,
          slug: slug,
        });

        // Check if we've reached the end of available events
        if (data.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setProducts((prev) => {
          if (replace) {
            return data;
          }
          return [...prev, ...data];
        });
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setErrorMessage("An Error Occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [section, LIMIT, accessToken, slug]
  );

  // Initial load and section change handler
  useEffect(() => {
    setPage(1);
    loadProducts(1, true);
  }, [section, loadProducts]);

  // Scroll event handler for infinite scrolling and scroll button state
  const handleScroll = useCallback(() => {
    if (!bodyRef.current || !hasMore || isLoading) return;

    const container = bodyRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // Update scroll button states
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);

    // Load more when user has scrolled to 80% of the content
    if (scrollLeft + clientWidth >= scrollWidth * 0.8) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isLoading]);

  // Load more events when page changes
  useEffect(() => {
    if (page > 1) {
      loadProducts(page, false);
    }
  }, [page, loadProducts]);

  // Add scroll event listener
  useEffect(() => {
    const currentRef = bodyRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);

      // Initial scroll state check
      const scrollWidth = currentRef.scrollWidth;
      const clientWidth = currentRef.clientWidth;
      setCanScrollRight(scrollWidth > clientWidth);

      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  // Client-side only effects
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Manual scroll handlers for arrow buttons
  const handleManualScroll = (direction: "left" | "right") => {
    if (!bodyRef.current) return;

    const container = bodyRef.current;
    // const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width

    container.scrollBy({
      left: direction === "left" ? -300 : +300,
      behavior: "smooth",
    });
  };

  // Render loading state
  const renderLoading = () => {
    return (
      <div className={styles.noPosts}>
        <LoadingTree />
      </div>
    );
  };

  // Render content based on state
  const renderContent = () => {
    if (isLoading && products.length === 0) {
      return renderLoading();
    }

    if (errorMessage && products.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>No events found</p>
        </div>
      );
    }
    return (
      <>
        <Suspense fallback={renderLoading()}>
          {isMounted &&
            products.map((product, index) => (
              <div key={product.id || index} className={styles.postContainer}>
                <ProductCard
                  limit={LIMIT}
                  products={products}
                  product={product}
                  index={index}
                  page={page}
                  setPage={setPage}
                  setSendMessage={setSendMessage}
                  setSellerId={setSellerId}
                  setSellerType={setSellerType}
                />
              </div>
            ))}
        </Suspense>
      </>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <ProductsFilter
          section={section}
          setPage={setPage}
          setSection={setSection}
          setAddNew={setAddNew}
        />
        {products.length > 0 && (
          <div className={styles.sliderBtns}>
            <div
              className={`${styles.arrow} ${
                !canScrollLeft ? styles.disabled : ""
              }`}
              onClick={() => handleManualScroll("left")}
            >
              <Image
                src={toRight}
                alt="left arrow"
                width={100}
                height={100}
                style={{ transform: "rotateY(180deg)" }}
              />
            </div>
            <div
              className={`${styles.arrow} ${
                !canScrollRight ? styles.disabled : ""
              }`}
              onClick={() => handleManualScroll("right")}
            >
              <Image src={toRight} alt="right arrow" width={100} height={100} />
            </div>
          </div>
        )}

        <div ref={bodyRef} className={styles.posts}>
          {renderContent()}
        </div>
      </div>
      {addNew && <AddNewProduct setAddNew={setAddNew} userType="page" />}
      {sendMessage && (
        <MessageModal
          sellerId={sellerId}
          sellerType={sellerType}
          setMessage={setSendMessage}
        />
      )}
    </>
  );
}

export default ProductSection;
