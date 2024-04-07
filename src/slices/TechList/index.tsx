"use client"

import React, { useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MdCircle } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heading from "@/components/Heading";
import Bounded from "@/components/Bounded";

/**
 * Props for `TechList`.
 */
export type TechListProps = SliceComponentProps<Content.TechListSlice>;

gsap.registerPlugin(ScrollTrigger)

/**
 * Component for "TechList" Slices.
 */
const TechList = ({ slice }: TechListProps): JSX.Element => {
  const component = useRef(null)

  useEffect(() => {
    let ctx = gsap.context(() => {

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 4
        }
      })

      tl.fromTo('.tech-row', {
        x: ( idx ) => {
          return idx % 2 === 0 ? gsap.utils.random(600, 400) : gsap.utils.random(-600, -400)
        }
      }, {
        x: ( idx ) => {
          return idx % 2 === 0 ? gsap.utils.random(-600, -400) : gsap.utils.random(600, 400)
        },
        ease: 'power1.inOut'
      })

    }, component)

    return () => ctx.revert()
  }, [])

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <Bounded as='div'>
        <Heading size="xl" className="mb-8">{slice.primary.heading}</Heading>
      </Bounded>
      {slice.items.map(({ tech_color, tech_name }, idx) => {
        return (
          <div
            key={idx}
            className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700"
            aria-label={tech_name || undefined}
          >
            {Array.from({ length: 15 }, (_, idx) => (
              <React.Fragment key={idx}>
                <span
                  className="texh-item text-8xl font-extrabold uppercase tracking-tighter"
                  style={{
                    color: idx === 7 && tech_color ? tech_color : "inherit",
                  }}
                >
                  {tech_name}
                </span>
                <span className="text-3xl">
                  <MdCircle />
                </span>
              </React.Fragment>
            ))}
          </div>
        );
      })}
    </section>
  );
};

export default TechList;
