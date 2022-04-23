import { a, useSpring, useSprings, useTransition } from "@react-spring/web";
import React, { useEffect, useMemo, useRef, useState } from "react";

import './PlayerLyrics.scss'

function praseLyric(lrcStr) {
  return [...lrcStr.matchAll(/\[(\d+):(\d+\.?\d+)\](.*$)/gm)]
    .map((reg) => ({
      beginTime: parseInt(reg[1]) * 60 + parseFloat(reg[2]),
      content: reg[3]
    }));
}

// function PlayerLyrics

export default function PlayerLyrics({ lrcStr, time }) {
  const [lrc, setLrc] = useState([]);

  useEffect(() => {
    if (!lrcStr) setLrc([{ beginTime: 0, content: 'No lyric found.'}]);
    else {
      console.log(lrcStr);
      const lyrics = praseLyric(lrcStr);
      console.log(lyrics);
      setLrc(lyrics);
    }
  }, [ lrcStr ]);
  
  const nowLyric = useMemo(() => lrc.findIndex((lyric, i) => 
  lyric.beginTime <= time && (i === lrc.length - 1 || lrc[i + 1].beginTime > time)),
  [lrc, time]);
  
  const ref = useRef();

  const springs = useSprings(lrc.length, lrc.map((lyric, i) => (
    Object.assign({
      config: { tension: 190, friction: 30 },
    }, lyric.content === '' ? ( i === nowLyric ? {
      // height: '2.7rem',
    } : {
      height: '0rem',
    }) : (i === nowLyric ? {
      blur: -0.2, color: '#FFF', textShadow: '0 0 1rem #999A', scale: '105%'
    } : {
      blur: 1.3, color: '#FFFC', textShadow: '0 0 1rem #9990', scale: '100%'
    }))
  )));
  
  // const showDot = lrc[nowLyric] && lrc[nowLyric].content === '' && nowLyric !== lrc.length - 1;
  const showDot = false;
  // const showDotHeight = useMemo(() => {
  //   return 186.984375;
  //   return showDot && ref.current ?
  //     ref.current.children[nowLyric + 1].getBoundingClientRect().top : 0
  // }, [showDot]);
  const scrollVal = useMemo(() => {
    if (ref.current && nowLyric !== null && lrc[nowLyric]) {
      const target = lrc[nowLyric].content === '' ? (showDot ? nowLyric :nowLyric - 2) : nowLyric - 1;
      if (!ref.current.children[target])  return 0;
      const childRect = ref.current.children[target].getBoundingClientRect();
      if (showDot) return childRect.top + ref.current.scrollTop
        - 40 - ref.current.getBoundingClientRect().top;
      return childRect.top + childRect.height + ref.current.scrollTop
        - 40 - ref.current.getBoundingClientRect().top;
    } else return 0;
  }, [time, showDot]);

  const { scroll } = useSpring({
    scroll: scrollVal,
    config: { tension: 190, friction: 30 },
  });

  return (
    <a.div className="PlayerLyrics" ref={ref} scrollTop={ scroll }>
      {springs.map(({ blur, scale, ...style }, index) => (
        lrc[index].content === ''
        && <a.div className="dot" key={index} style={style} >233</a.div>
        || <a.div className="lyric" key={index} style={{
          filter: blur.to(v => Math.max(0, v)).to(v => `blur(${v}px)`),
          transform: scale.to(v => `scale(${v})`),
          ...style
        }}>{ lrc[index].content }</a.div>
      ))}
    </a.div>
  )
}