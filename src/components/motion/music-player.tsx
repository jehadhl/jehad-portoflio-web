"use client";
import * as React from "react";
import gsap from "gsap";

/** Original animation controllers, restored as editable React source. */
let MUSIC_REACTIVE_EVENT = "hero-music-reactive";
let DEFAULT_REACTIVE_STATE = {
  isActive: false,
  isPlaying: false,
  mode: "detail",
  low: 0,
  lowPulse: 0,
  mid: 0,
  high: 0,
};
function publishAudioState(t = DEFAULT_REACTIVE_STATE) {
  window.dispatchEvent(
    new CustomEvent(MUSIC_REACTIVE_EVENT, {
      detail: {
        ...DEFAULT_REACTIVE_STATE,
        ...t,
      },
    }),
  );
}
function averageFrequencyBand(t, e, i) {
  let r = 0,
    s = 0;
  for (let n = e; n < i; n += 1) {
    r += t[n] ?? 0;
    s += 1;
  }
  return s > 0 ? r / s / 255 : 0;
}
function useAudioReactivity(t, e, i) {
  let r = React.useRef(null),
    s = React.useRef(null),
    n = React.useRef(null),
    a = React.useRef(false),
    o = React.useRef(0),
    l = React.useRef(null),
    h = React.useRef(i?.src ?? null),
    c = React.useRef({
      low: 0,
      lowPulse: 0,
      mid: 0,
      midPulse: 0,
      high: 0,
    });
  React.useEffect(() => {
    publishAudioState({
      ...c.current,
      isActive: e,
      isPlaying: e,
      mode: i?.reactiveMode ?? "detail",
    });
    e || publishAudioState(DEFAULT_REACTIVE_STATE);
  }, [e, i?.reactiveMode]);
  React.useEffect(() => {
    let t = i?.src ?? null;
    if (h.current !== t) {
      if (
        ((h.current = t),
        o.current && (window.cancelAnimationFrame(o.current), (o.current = 0)),
        s.current && n.current)
      )
        try {
          s.current.disconnect(n.current);
        } catch {}
      if (n.current)
        try {
          n.current.disconnect();
        } catch {}
      n.current = null;
      l.current = null;
      a.current = false;
      c.current = {
        low: 0,
        lowPulse: 0,
        mid: 0,
        midPulse: 0,
        high: 0,
      };
      publishAudioState(DEFAULT_REACTIVE_STATE);
    }
  }, [i?.src]);
  React.useEffect(() => {
    let h = t.current;
    if (!h) return;
    let p = false,
      u = () => {
        o.current && (window.cancelAnimationFrame(o.current), (o.current = 0));
        c.current = {
          low: 0,
          lowPulse: 0,
          mid: 0,
          midPulse: 0,
          high: 0,
        };
        publishAudioState(DEFAULT_REACTIVE_STATE);
      },
      f = async () => {
        if (r.current && n.current && l.current) return true;
        let t = window.AudioContext || window.webkitAudioContext;
        if (!t) return false;
        let e = r.current ?? new t();
        r.current = e;
        s.current || (s.current = e.createMediaElementSource(h));
        let i = n.current ?? e.createAnalyser();
        i.fftSize = 256;
        i.smoothingTimeConstant = 0.52;
        n.current = i;
        l.current || (l.current = new Uint8Array(i.frequencyBinCount));
        a.current ||
          (s.current.connect(i), i.connect(e.destination), (a.current = true));
        "suspended" === e.state && (await e.resume());
        return true;
      },
      d = () => {
        o.current = 0;
        let t = n.current,
          e = l.current;
        if (!t || !e) return;
        t.getByteFrequencyData(e);
        let r = averageFrequencyBand(e, 1, 10),
          s = averageFrequencyBand(e, 10, 32),
          a = averageFrequencyBand(e, 32, 64),
          u = c.current,
          f = 0.42,
          m = 0.24,
          g = 0.16;
        u.low;
        u.low;
        let v = u.mid + (s - u.mid) * m,
          y = u.high + (a - u.high) * g,
          b = 7.5 * Math.max(0, Math.max(0, r - u.low) - 0.018),
          x = Math.min(1, Math.max(0.82 * u.lowPulse, b)),
          _ = 5.4 * Math.max(0, Math.max(0, s - u.mid) - 0.035),
          w = Math.min(1, Math.max(0.72 * u.midPulse, _));
        c.current = {
          low: u.low + (r - u.low) * f,
          lowPulse: x,
          mid: v,
          midPulse: w,
          high: y,
        };
        publishAudioState({
          isActive: true,
          isPlaying: true,
          mode: i?.reactiveMode ?? "detail",
          low: u.low + (r - u.low) * f,
          lowPulse: x,
          mid: v,
          midPulse: w,
          high: y,
        });
        p || h.paused || (o.current = window.requestAnimationFrame(d));
      };
    return e
      ? (f()
          .then((t) => {
            t &&
              !p &&
              !h.paused &&
              (o.current || (o.current = window.requestAnimationFrame(d)));
          })
          .catch(() => {
            u();
          }),
        () => {
          p = true;
          u();
        })
      : (u(),
        () => {
          p = true;
          u();
        });
  }, [t, e, i]);
}
function normalizeTracks(t) {
  if (t?.artist && t?.title) return `${t.artist} - ${t.title}`;
  if (t?.src) {
    let e = decodeURIComponent(t.src.split("/").pop() ?? "")
      .replace(/\.[^/.]+$/, "")
      .split(" - ");
    if (e.length >= 3) return `${e[0]} - ${e.slice(2).join(" - ")}`;
    if (e.length >= 2) return `${e[0]} - ${e.slice(1).join(" - ")}`;
  }
  return t?.title ?? "";
}
function MusicPlayer({ track: track }) {
  let e = React.useRef(null),
    i = React.useRef(null),
    r = React.useRef([]),
    s = React.useRef(null),
    n = React.useMemo(
      () =>
        Array.isArray(track?.tracks)
          ? track.tracks.filter((t) => t?.src)
          : track?.src
            ? [track]
            : [],
      [track],
    ),
    [a, l] = React.useState(false),
    [h, c] = React.useState(false),
    [p, u] = React.useState(0),
    [f, d] = React.useState(0),
    m = n[f] ?? null;
  if (
    (useAudioReactivity(e, h, m),
    React.useEffect(() => {
      let t = e.current;
      if (!t) return;
      let i = () => {
          let e = Number.isFinite(t.duration) ? t.duration : 0;
          u(e > 0 ? t.currentTime / e : 0);
        },
        r = () => {
          (u(0), n.length > 1)
            ? d((t) => (t + 1) % n.length)
            : (t.currentTime = 0);
        };
      t.addEventListener("timeupdate", i);
      t.addEventListener("ended", r);
      return () => {
        t.removeEventListener("timeupdate", i);
        t.removeEventListener("ended", r);
      };
    }, [n.length]),
    React.useEffect(() => {
      let t = e.current;
      t && m?.src && (t.load(), u(0));
    }, [m?.src]),
    React.useEffect(() => {
      let t = e.current;
      t &&
        m?.src &&
        h &&
        t
          .play()
          .then(() => {
            c(true);
          })
          .catch(() => {
            c(false);
          });
    }, [m?.src, h]),
    React.useEffect(() => {
      let t = i.current,
        e = r.current.filter(Boolean),
        n = e
          .map((t) => t.querySelector(".hero-music-playlist-line"))
          .filter(Boolean),
        a = e
          .map((t) => t.querySelector(".hero-music-playlist-text"))
          .filter(Boolean);
      if (t && 0 !== e.length) {
        gsap.set(t, {
          autoAlpha: 0,
          pointerEvents: "none",
        });
        gsap.set(e, {
          autoAlpha: 0,
          y: 10,
        });
        gsap.set(n, {
          scaleX: 0,
          transformOrigin: "left center",
        });
        gsap.set(a, {
          autoAlpha: 0,
          y: 8,
        });
        return () => {
          s.current && window.clearTimeout(s.current);
        };
      }
    }, [n.length]),
    !m?.src)
  )
    return null;
  let g = () => {
      let t = i.current,
        e = r.current.filter(Boolean),
        n = e
          .map((t) => t.querySelector(".hero-music-playlist-line"))
          .filter(Boolean),
        a = e
          .map((t) => t.querySelector(".hero-music-playlist-text"))
          .filter(Boolean);
      if (!t || 0 === e.length) return;
      s.current && (window.clearTimeout(s.current), (s.current = null));
      gsap.killTweensOf(t);
      gsap.killTweensOf(e);
      gsap.killTweensOf(n);
      gsap.killTweensOf(a);
      gsap.set(t, {
        pointerEvents: "auto",
      });
      let o = gsap.timeline({
        defaults: {
          overwrite: true,
        },
      });
      o.to(t, {
        autoAlpha: 1,
        duration: 0.18,
        ease: "power2.out",
      });
      o.to(
        e,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.26,
          ease: "power3.out",
          stagger: 0.045,
        },
        0,
      );
      o.to(
        n,
        {
          scaleX: 1,
          duration: 0.28,
          ease: "power2.out",
          stagger: 0.045,
        },
        0.02,
      );
      o.to(
        a,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.24,
          ease: "power3.out",
          stagger: 0.045,
        },
        0.07,
      );
    },
    v = () => {
      let t = i.current,
        e = r.current.filter(Boolean),
        n = e
          .map((t) => t.querySelector(".hero-music-playlist-line"))
          .filter(Boolean),
        a = e
          .map((t) => t.querySelector(".hero-music-playlist-text"))
          .filter(Boolean);
      t &&
        0 !== e.length &&
        (s.current && window.clearTimeout(s.current),
        (s.current = window.setTimeout(() => {
          gsap.killTweensOf(t);
          gsap.killTweensOf(e);
          gsap.killTweensOf(n);
          gsap.killTweensOf(a);
          let i = gsap.timeline({
            defaults: {
              overwrite: true,
            },
            onComplete: () => {
              gsap.set(t, {
                pointerEvents: "none",
              });
            },
          });
          i.to(a, {
            autoAlpha: 0,
            y: 6,
            duration: 0.16,
            ease: "power2.in",
            stagger: {
              each: 0.03,
              from: "end",
            },
          });
          i.to(
            n,
            {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.18,
              ease: "power2.inOut",
              stagger: {
                each: 0.03,
                from: "end",
              },
            },
            0.02,
          );
          i.to(
            e,
            {
              autoAlpha: 0,
              y: 8,
              duration: 0.16,
              ease: "power2.in",
              stagger: {
                each: 0.03,
                from: "end",
              },
            },
            0,
          );
          i.to(t, {
            autoAlpha: 0,
            duration: 0.16,
            ease: "power2.out",
          });
        }, 180)));
    },
    y = async () => {
      let t = e.current;
      if (t) {
        if ((a || l(true), t.paused)) {
          try {
            await t.play();
            c(true);
          } catch {
            c(false);
          }
          return;
        }
        t.pause();
        c(false);
        l(false);
      }
    },
    b = async (t) => {
      t !== f && (d(t), l(true), c(true));
    };
  return (
    <div
      className={`hero-music-player${a ? " is-expanded" : ""}`}
      onMouseEnter={g}
      onMouseLeave={v}
      onFocusCapture={g}
      onBlurCapture={(t) => {
        t.currentTarget.contains(t.relatedTarget) || v();
      }}
    >
      <div className="hero-music-track" aria-hidden="true">
        <div className="hero-music-track-line" />
        <div
          className="hero-music-track-fill"
          style={{
            transform: `scaleX(${Math.min(Math.max(p, 0), 1)})`,
          }}
        />
        <span
          className="hero-music-track-puck"
          style={{
            transform: `translate3d(${100 * Math.min(Math.max(p, 0), 1)}%, 0, 0)`,
          }}
        />
      </div>
      <button
        type="button"
        className={`hero-music-toggle${h ? " is-playing" : ""}`}
        onClick={y}
        aria-label={h ? `Pause ${m.title}` : `Play ${m.title}`}
      >
        <span className="hero-music-toggle-icon" aria-hidden="true" />
      </button>
      <button type="button" className="hero-music-label-button" onClick={y}>
        <span className="hero-music-label">
          {h ? "Press Pause" : "Press Play"}
        </span>
      </button>
      {n.length > 1 ? (
        <div ref={i} className="hero-music-playlist">
          {n.map((t, e) => (
            <button
              key={t.src}
              type="button"
              className="hero-music-playlist-item"
              onClick={() => b(e)}
              ref={(t) => {
                r.current[e] = t;
              }}
            >
              <span className="hero-music-playlist-line" aria-hidden="true" />
              <span className="hero-music-playlist-text">
                {normalizeTracks(t)}
              </span>
            </button>
          ))}
        </div>
      ) : null}
      <audio ref={e} preload="metadata" src={m.src} />
    </div>
  );
}

export {
  MUSIC_REACTIVE_EVENT,
  DEFAULT_REACTIVE_STATE,
  publishAudioState,
  averageFrequencyBand,
  useAudioReactivity,
  normalizeTracks,
  MusicPlayer,
};
