import React from "react";
import styles from "./EventFilter.module.css";
import { eventFilterProps } from "./eventFilterTypes.data";
import Image from "next/image";
import events from "@/../public/icons/events.svg";
function EventFilter(props: eventFilterProps) {
  const { section, setPage, setSection } = props;

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <Image src={events} alt="events" width={32} height={32} />
          <h3>Events</h3>
        </div>
        <div className={styles.filterSection}>
          <ul>
            <li
              style={
                section === "all"
                  ? { color: "#97B00F", opacity: 1 }
                  : { color: "" }
              }
              onClick={() => {
                setPage(1);
                setSection("all");
              }}
            >
              all
            </li>
            <li
              style={
                section === "social"
                  ? { color: "#97B00F", opacity: 1 }
                  : { color: "" }
              }
              onClick={() => {
                setPage(1);
                setSection("social");
              }}
            >
              social
            </li>
            <li
              style={
                section === "volunteering%26work"
                  ? { color: "#97B00F", opacity: 1 }
                  : { color: "" }
              }
              onClick={() => {
                setPage(1);
                setSection("volunteering%26work");
              }}
            >
              volunteering & work
            </li>
            <li
              style={
                section === "talks%26workshops"
                  ? { color: "#97B00F", opacity: 1 }
                  : { color: "" }
              }
              onClick={() => {
                setPage(1);
                setSection("talks%26workshops");
              }}
            >
              talks & workshops
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default EventFilter;
