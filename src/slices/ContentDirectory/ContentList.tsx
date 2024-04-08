"use client";

import { Content, asImageSrc, isFilled } from "@prismicio/client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { gsap } from "gsap";

type ContentListProps = {
  items: Content.BlogPostDocument[] | Content.ProjectDocument[];
  contentType: Content.ContentDirectorySlice["primary"]["content_type"];
  fallbackItemImage: Content.ContentDirectorySlice["primary"]["fallback_item_image"];
  viewMoreText: Content.ContentDirectorySlice["primary"]["view_more_text"];
};

const ContentList = ({
  items,
  contentType,
  fallbackItemImage,
  viewMoreText = "Read More",
}: ContentListProps) => {
  const component = useRef(null);
  const revealRef = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0})

  const [currentItem, setCurrentItem] = useState<null | number>(null);

  const urlPrefixes = contentType === "Blog" ? "/ blog" : "/project";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = {x: e.clientX, y: e.clientY + window.scrollY }

      // Calculate speed and direction
      const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2))

      let ctx = gsap.context(() => {
        if(currentItem !== null){
          const maxY = window.scrollY + window.innerHeight - 350
          const maxX = window.innerWidth - 250

          gsap.to(revealRef.current, {
            x: gsap.utils.clamp(0, maxX, mousePos.x - 110),
            y: gsap.utils.clamp(0, maxY, mousePos.y - 160),
            rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1),
            ease: 'back.out(2)',
            duration: 1.3
          })
        }
        lastMousePos.current = mousePos
        return () => ctx.revert()
      }, component)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [currentItem])


  const contentImages = items.map((item, idx) => {
    const image = isFilled.image(item.data.hover_image)
      ? item.data.hover_image
      : fallbackItemImage;

    return asImageSrc(image, {
      fit: "crop",
      w: 220,
      h: 320,
      exp: -1,
    });
  });

  const onMouseEnter = (idx: number) => {
    setCurrentItem(idx);
  };

  const onMouseLeave = () => {
    setCurrentItem(null);
  };

  return (
    <div ref={component}>
      <ul className="grid border-b border-b-slate-100">
        {items.map((el, idx) => {
          return (
            <>
              {isFilled.keyText(el.data.title) && (
                <li
                  key={idx}
                  className="list-item opacity-0f"
                  onMouseEnter={() => onMouseEnter(idx)}
                  onMouseLeave={onMouseLeave}
                >
                  <Link
                    href={urlPrefixes + "/" + el.uid}
                    className="flex flex-col justify-between border-t border-t-slate-100 py-10 text-slate-200 md:flex-row"
                    aria-label={el.data.title}
                  >
                    <div className="flex flex-col">
                      <span className="text-3xl font-bold">
                        {el.data.title}
                      </span>
                      <div className="flex gap-3 text-yellow-400 text-lg font-bold">
                        {el.tags.map((tag, idx) => {
                          return <span key={idx}>{tag}</span>;
                        })}
                      </div>
                    </div>
                    <span className="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">
                      {viewMoreText} <MdArrowOutward />
                    </span>
                  </Link>
                </li>
              )}
            </>
          );
        })}
      </ul>

      {/* Hover Element */}
      <div
        ref={revealRef}
        className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10
      h-[320px] w-[220px] rounded-lg bg-over bg-center opacity-0f transition-[background] duration-300"
        style={{
          backgroundImage:
            currentItem !== null ? `url(${contentImages[currentItem]})` : "",
        }}
      ></div>
    </div>
  );
};

export default ContentList;
