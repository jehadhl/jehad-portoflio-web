"use client";
import * as React from "react";
import gsap from "gsap";

/** Original animation controllers, restored as editable React source. */
function formatLocationTime(t) {
  let e = new Intl.DateTimeFormat("en-GB", {
      timeZone: t,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date()),
    i = e.find((t) => "hour" === t.type)?.value ?? "",
    r = e.find((t) => "minute" === t.type)?.value ?? "";
  return `${i}:${r}`;
}
function getLocationAt(t, e) {
  let i = e[t] ?? e[0];
  return {
    label: i.label,
    time: formatLocationTime(i.timeZone),
  };
}
function pickDifferentLocation(t, e) {
  if (e <= 1) return t;
  let i = t;
  for (; i === t;) i = Math.floor(Math.random() * e);
  return i;
}
function LocationClock({ locations: locations, prefix: prefix }) {
  let i = React.useRef(null),
    r = React.useRef(null),
    s = (locations ?? []).map((t) => `${t.label}:${t.timeZone}`).join("|");
  React.useEffect(() => {
    let e;
    if (!locations?.length) return;
    let s = i.current?.children ?? [],
      n = r.current?.children ?? [];
    if (s.length < 2 || n.length < 2) return;
    let a = 0,
      o = 0,
      l = 0.9,
      h = 3.1,
      c = (t, e) => {
        s[t].textContent = e.label;
        n[t].textContent = e.time;
      },
      p = (t, e) => {
        gsap.set([s[t], n[t]], {
          yPercent: e,
        });
      };
    c(0, getLocationAt(0, locations));
    c(1, getLocationAt(1, locations));
    p(0, 0);
    p(1, 100);
    let u = () => {
      let i = +(0 === a),
        r = a,
        f = pickDifferentLocation(o, locations.length);
      c(i, getLocationAt(f, locations));
      p(i, 100);
      (e = gsap.timeline({
        delay: h,
        onComplete: () => {
          p(r, 100);
          a = i;
          o = f;
          u();
        },
      })).to(
        [s[r], n[r]],
        {
          yPercent: -100,
          duration: l,
          ease: "expo.inOut",
        },
        0,
      );
      e.to(
        [s[i], n[i]],
        {
          yPercent: 0,
          duration: l,
          ease: "expo.inOut",
        },
        0,
      );
    };
    u();
    return () => {
      e?.kill();
      gsap.killTweensOf([...s, ...n]);
    };
  }, [s]);
  return (
    <React.Fragment>
      <p className="hero-meta hero-meta-date">
        {prefix}
        {":"}{" "}
        <span className="hero-meta-slide">
          <span ref={i} className="hero-meta-slide-track">
            <span />
            <span />
          </span>
        </span>
      </p>
      <p className="hero-meta hero-meta-date">
        <span className="hero-meta-slide">
          <span ref={r} className="hero-meta-slide-track">
            <span />
            <span />
          </span>
        </span>
      </p>
    </React.Fragment>
  );
}

export {
  formatLocationTime,
  getLocationAt,
  pickDifferentLocation,
  LocationClock,
};
