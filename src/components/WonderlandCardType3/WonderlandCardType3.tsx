"use client";
import React, { useRef, useEffect, useState } from "react";
import { Novatro } from "./Novatro";
import type { NovatroProps } from "./Novatro";

interface WonderlandCardType3Props {
  cardId?: string;
  textArray?: string | string[];
  fontSize?: number;
  letterSpacing?: string;
  manualLetterSpacing?: number;
  minTextSize?: number;
  maxTextSize?: number;
  minCardWidth?: number;
  maxCardWidth?: number;
  componentWidth?: string;
  aspectRatio?: string;
  outlineColor?: string;
  outlineHoverColor?: string;
  outlineActiveColor?: string;
  outlineWidth?: string;
  outlineWidthHover?: string;
  outlineWidthActive?: string;
  borderRadius?: string;
  borderRadiusHover?: string;
  borderRadiusActive?: string;
  backgroundColor?: string;
  textColor?: string;
  textColorHover?: string;
  textColorActive?: string;
  textPaddingTop?: string;
  textPaddingLeft?: string;
  imageSrc: string;
  imageAlt?: string;
  imageHeightPercentage?: number;
  onClick?: () => void;
  onHover?: () => void;
  onUnhover?: () => void;
  onRelease?: () => void;
  novatroProps?: NovatroProps;
  novatroPropsActive?: NovatroProps;
  inscriptionFontWeight?: React.CSSProperties["fontWeight"];
  defaultInscriptionText?: string | string[];
  mirroredInscriptionText?: string | string[];
}

const transitionEffect =
  "background-color 0.5s cubic-bezier(.45,.03,.52,1.01), " +
  "outline-color 0.5s, color 0.5s, border-radius 0.5s, outline-width 0.5s";

function buildOutlineFilter(color: string) {
  return [
    `drop-shadow(4px 0 0 ${color})`,
    `drop-shadow(-4px 0 0 ${color})`,
    `drop-shadow(0 4px 0 ${color})`,
    `drop-shadow(0 -4px 0 ${color})`,
  ].join(" ");
}

const WonderlandCardType3: React.FC<WonderlandCardType3Props> = ({
  cardId = "wonderland-card-type3",
  fontSize,
  letterSpacing = "0.24em",
  manualLetterSpacing,
  minTextSize = 18,
  maxTextSize = 26,
  minCardWidth = 200,
  maxCardWidth = 400,
  componentWidth = "340px",
  aspectRatio = "3/4",
  outlineColor = "#e1e1e1",
  outlineHoverColor = "#fff",
  outlineActiveColor = "#9d80f2",
  outlineWidth = "3px",
  outlineWidthHover = "3px",
  outlineWidthActive = "3px",
  borderRadius = "16px",
  borderRadiusHover = "28px",
  borderRadiusActive = "38px",
  backgroundColor = "#fff",
  textColor = "#ec6718",
  textColorHover = "#0a0a0a",
  textColorActive = "#fff",
  textPaddingTop = "16px",
  textPaddingLeft = "19px",
  imageSrc,
  imageAlt = "",
  imageHeightPercentage = 71,
  onHover,
  onUnhover,
  onClick,
  onRelease,
  novatroProps = {
    color: [0.85, 0.93, 1.0], 
  },
  novatroPropsActive = {
    color: [0.44, 0.33, 0.9],
  },
  inscriptionFontWeight = 900,
  defaultInscriptionText = ["流", "れ"],
  mirroredInscriptionText = "ながれ",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setHovered] = useState(false);
  const [isActive, setActive] = useState(false);
  const [computedFontSize, setFontSize] = useState<number>(maxTextSize);

  useEffect(() => {
    if (fontSize) {
      setFontSize(fontSize);
      return;
    }
    const update = () => {
      if (!cardRef.current) return;
      const width = cardRef.current.offsetWidth;
      const clamped = Math.max(minCardWidth, Math.min(width, maxCardWidth));
      const ratio = (clamped - minCardWidth) / (maxCardWidth - minCardWidth);
      setFontSize(minTextSize + ratio * (maxTextSize - minTextSize));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [fontSize, minTextSize, maxTextSize, minCardWidth, maxCardWidth]);

  const currentOutlineColor =
    isActive ? outlineActiveColor : isHovered ? outlineHoverColor : outlineColor;
  const currentOutlineWidth =
    isActive ? outlineWidthActive : isHovered ? outlineWidthHover : outlineWidth;
  const currentBorderRadius =
    isActive ? borderRadiusActive : isHovered ? borderRadiusHover : borderRadius;
  const currentTextColor =
    isActive ? textColorActive : isHovered ? textColorHover : textColor;
  const currentOutlineImageColor = "transparent";
  const currentNovatroProps = isActive ? novatroPropsActive : novatroProps;

  const verticalSpacing =
    manualLetterSpacing !== undefined
      ? manualLetterSpacing
      : computedFontSize * 0.18;

  // --- LOGIC: display horizontally if string; vertically (one per line) if array ---
  function renderInscription(
    content: string | string[] | undefined,
    vertical: boolean,
    style: React.CSSProperties
  ) {
    if (content === undefined) return null;
    if (typeof content === "string") {
      // display horizontally
      return <div style={style}>{content}</div>;
    }
    // it's an array: each item on vertical line
    return (
      <div style={{ ...style, display: "flex", flexDirection: "column", alignItems: "center", gap: `${verticalSpacing}px` }}>
        {content.map((char, idx) => (
          <div key={idx}>{char}</div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      data-card-id={cardId}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: componentWidth,
        aspectRatio,
        borderRadius: currentBorderRadius,
        outline: `${currentOutlineWidth} solid ${currentOutlineColor}`,
        transition: transitionEffect,
        overflow: "hidden",
        backgroundColor,
        boxSizing: "border-box",
      }}
      onMouseEnter={() => {
        setHovered(true);
        onHover?.();
      }}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
        onUnhover?.();
      }}
      onMouseDown={() => {
        setActive(true);
        onClick?.();
      }}
      onMouseUp={() => {
        setActive(false);
        onRelease?.();
      }}
    >
      {/* Novatro Background */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}>
        <Novatro {...currentNovatroProps} />
      </div>
      {/* Card white background, fades to reveal Novatro on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor,
          opacity: isHovered ? 0 : 1,
          pointerEvents: "none",
          transition: "opacity 0.5s cubic-bezier(.45,.03,.52,1.01)",
          zIndex: 1,
        }}
      />
      {/* Image Layer */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          height: `${imageHeightPercentage}%`,
          width: "auto",
          aspectRatio: "1/1",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: currentBorderRadius,
            background: "none",
            border: "none",
            filter: buildOutlineFilter(currentOutlineImageColor),
            transition: "filter 0.45s cubic-bezier(.45,.03,.52,1.01)",
          }}
          draggable={false}
        />
      </div>
      {/* Kanji inscription */}
      <div
        style={{
          position: "absolute",
          top: textPaddingTop,
          left: textPaddingLeft,
          zIndex: 10,
          fontSize: `${computedFontSize}px`,
          fontWeight: inscriptionFontWeight,
          color: currentTextColor,
          fontFamily: "serif",
          userSelect: "none",
          letterSpacing,
          pointerEvents: "none",
          transition: "color 0.3s",
        }}
      >
        {renderInscription(defaultInscriptionText, true, {})}
      </div>
      {/* Mirrored Hiragana inscription */}
      <div
        style={{
          position: "absolute",
          bottom: textPaddingTop,
          right: textPaddingLeft,
          zIndex: 10,
          fontSize: `${computedFontSize}px`,
          fontWeight: inscriptionFontWeight,
          color: currentTextColor,
          fontFamily: "serif",
          userSelect: "none",
          letterSpacing,
          transform: "rotate(180deg)",
          pointerEvents: "none",
          transition: "color 0.3s",
        }}
      >
        {renderInscription(mirroredInscriptionText, true, {})}
      </div>
    </div>
  );
};

export default WonderlandCardType3;
