"use client";

import { useEffect, useState } from "react";

export function LocationClock({
  prefix,
  locations,
}: {
  prefix: string;
  locations: { label: string; timeZone: string }[];
}) {
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: locations[index].timeZone,
        }).format(new Date()),
      );
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [index, locations]);
  useEffect(() => {
    const timer = setInterval(
      () => setIndex((value) => (value + 1) % locations.length),
      6500,
    );
    return () => clearInterval(timer);
  }, [locations.length]);
  return (
    <div className="location-clock">
      <span>{prefix}:</span>
      <span>{locations[index].label}</span>
      <time>{time || "—:—"}</time>
    </div>
  );
}
