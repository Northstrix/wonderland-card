"use client";
import React, { useRef, useEffect, useState } from "react";
import { Tranquiluxe } from "./Tranquiluxe";

interface TranquiluxeConfig {
  color?: [number, number, number];
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

interface WonderlandCardType2Props {
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
  tranquiluxeProps?: TranquiluxeConfig;
  tranquiluxePropsActive?: TranquiluxeConfig;
  inscriptionFontWeight?: React.CSSProperties["fontWeight"];
}

const transitionEffect =
  "background-color 0.5s cubic-bezier(.45,.03,.52,1.01), " +
  "outline-color 0.5s, color 0.5s, border-radius 0.5s, outline-width 0.5s";

const WonderlandCardType2: React.FC<WonderlandCardType2Props> = ({
  cardId = "wonderland-card-type2",
  textArray = ["啟蒙"],
  fontSize,
  letterSpacing = "0.24em",
  manualLetterSpacing,
  minTextSize = 18,
  maxTextSize = 26,
  minCardWidth = 200,
  maxCardWidth = 400,
  componentWidth = "340px",
  aspectRatio = "3/4",
  outlineColor = "#777",
  outlineHoverColor = "#6b140f",
  outlineActiveColor = "#fff",
  outlineWidth = "3px",
  outlineWidthHover = "3px",
  outlineWidthActive = "3px",
  borderRadius = "16px",
  borderRadiusHover = "28px",
  borderRadiusActive = "38px",
  backgroundColor = "#0a0a0a",
  textColor = "#fff",
  textColorHover = "#fff",
  textColorActive = "#0a0a0a",
  textPaddingTop = "17px",
  textPaddingLeft = "19px",
  imageSrc,
  imageAlt = "",
  imageHeightPercentage = 71,
  onHover,
  onUnhover,
  onClick,
  onRelease,
  tranquiluxeProps = {
    color: [1, 0.47, 0.07], // vivid, original reddish-orange (#ff7812)
    speed: 0.7,
  },
  tranquiluxePropsActive = {
    color: [0, 0.6275, 0.8471], // original blue
    speed: 1.2,
  },
  inscriptionFontWeight = 900,
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

  // Only two color schemes: vivid orange (default/hover), blue (active)
  const currentTranquiluxeProps =
    isActive && tranquiluxePropsActive
      ? tranquiluxePropsActive
      : tranquiluxeProps;

  const isVertical = Array.isArray(textArray);
  const verticalLines = isVertical ? textArray : [];
  const horizontalLine = !isVertical ? (textArray as string) : "";
  const verticalSpacing =
    manualLetterSpacing !== undefined
      ? manualLetterSpacing
      : computedFontSize * 0.18;

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
      {/* Tranquiluxe Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Tranquiluxe {...currentTranquiluxeProps} />
      </div>
      {/* Card background: fades out on hover, fully covers when not hovered */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor,
          opacity: isHovered ? 0 : 1,
          pointerEvents: "none",
          transition: "opacity 0.7s cubic-bezier(.45,.03,.52,1.01)",
          zIndex: 1,
        }}
      />
      {/* Image Layer - NO outline, NO shadow */}
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
            filter: "none",
            transition: "filter 0.45s cubic-bezier(.45,.03,.52,1.01)",
          }}
          draggable={false}
        />
      </div>
      {/* Text Layer */}
      {isVertical ? (
        <>
          <div
            style={{
              position: "absolute",
              top: textPaddingTop,
              left: textPaddingLeft,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              fontSize: `${computedFontSize}px`,
              fontWeight: inscriptionFontWeight,
              color: currentTextColor,
              fontFamily: "serif",
              userSelect: "none",
              gap: `${verticalSpacing}px`,
              letterSpacing,
              pointerEvents: "none",
              transition: "color 0.3s",
            }}
          >
            {verticalLines.map((line, idx) => (
              <div key={`t-${idx}`}>{line}</div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: textPaddingTop,
              right: textPaddingLeft,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              fontSize: `${computedFontSize}px`,
              fontWeight: inscriptionFontWeight,
              color: currentTextColor,
              fontFamily: "serif",
              userSelect: "none",
              gap: `${verticalSpacing}px`,
              letterSpacing,
              transform: "rotate(180deg)",
              pointerEvents: "none",
              transition: "color 0.3s",
            }}
          >
            {verticalLines.map((line, idx) => (
              <div key={`b-${idx}`}>{line}</div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: textPaddingTop,
              left: 0,
              right: 0,
              zIndex: 10,
              textAlign: "center",
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
            {horizontalLine}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: textPaddingTop,
              left: 0,
              right: 0,
              zIndex: 10,
              textAlign: "center",
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
            {horizontalLine}
          </div>
        </>
      )}
    </div>
  );
};

export default WonderlandCardType2;
