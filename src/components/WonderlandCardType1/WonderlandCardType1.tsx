"use client";
import React, { useRef, useEffect, useState } from "react";
import SpiralBackground from "./SpiralBackground";
import type { SpiralBackgroundProps } from "./SpiralBackground";

interface WonderlandCardType1Props {
  cardId?: string;
  textArray: string | string[];
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
  hoverBackgroundOpacity?: number;
  textColor?: string;
  textColorHover?: string;
  textColorActive?: string;
  textPaddingTop?: string;
  textPaddingLeft?: string;
  imageSrc: string;
  overlayImageSrc?: string;
  imageAlt?: string;
  overlayImageAlt?: string;
  imageHeightPercentage?: number;
  outlineImageColor?: string;
  onClick?: () => void;
  onHover?: () => void;
  onUnhover?: () => void; // renamed
  onRelease?: () => void;
  spiralProps?: Partial<SpiralBackgroundProps>;
  inscriptionFontWeight?: React.CSSProperties["fontWeight"];
}

const WonderlandCardType1: React.FC<WonderlandCardType1Props> = ({
  cardId = "wonderland-card",
  textArray,
  fontSize,
  letterSpacing = "0.15em",
  manualLetterSpacing,
  minTextSize = 10,
  maxTextSize = 20,
  minCardWidth = 200,
  maxCardWidth = 400,
  componentWidth = "320px",
  aspectRatio = "3/4",
  outlineColor = "#aaa",
  outlineHoverColor = "#333",
  outlineActiveColor = "#fff",
  outlineWidth = "1px",
  outlineWidthHover = "3px",
  outlineWidthActive = "6px",
  borderRadius = "12px",
  borderRadiusHover = "20px",
  borderRadiusActive = "28px",
  backgroundColor = "#fff",
  hoverBackgroundOpacity = 0,
  textColor = "#222",
  textColorHover = "#00a9fe",
  textColorActive = "#8F04A7",
  textPaddingTop = "16px",
  textPaddingLeft = "18px",
  imageSrc,
  overlayImageSrc,
  imageAlt = "",
  overlayImageAlt = "",
  imageHeightPercentage = 65,
  outlineImageColor = "#fff",
  onHover,
  onUnhover,
  onClick,
  onRelease,
  spiralProps = {},
  inscriptionFontWeight = "bold",
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
        transition:
          "outline-color 0.35s, outline-width 0.35s, border-radius 0.36s",
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
      {/* Spiral */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <SpiralBackground isActive={isActive} {...spiralProps} />
      </div>

      {/* Fading background for spiral reveal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: backgroundColor,
          opacity: isHovered ? hoverBackgroundOpacity : 1,
          transition: "opacity 0.5s",
          zIndex: 1,
        }}
      />

      {/* Image Layers */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          height: `${imageHeightPercentage}%`,
          width: "auto",
          aspectRatio: "1/1",
          transform: "translate(-50%, -50%)",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {/* Base image, always visible, with outline */}
        <img
          src={imageSrc}
          alt={imageAlt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter:
              `drop-shadow(4px 0 0 ${outlineImageColor}) ` +
              `drop-shadow(-4px 0 0 ${outlineImageColor}) ` +
              `drop-shadow(0 4px 0 ${outlineImageColor}) ` +
              `drop-shadow(0 -4px 0 ${outlineImageColor})`,
            zIndex: 1,
            borderRadius: currentBorderRadius,
          }}
        />
        {/* Overlay image with outline, fades in on hover */}
        {overlayImageSrc && (
          <img
            src={overlayImageSrc}
            alt={overlayImageAlt}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter:
                `drop-shadow(4px 0 0 ${outlineImageColor}) ` +
                `drop-shadow(-4px 0 0 ${outlineImageColor}) ` +
                `drop-shadow(0 4px 0 ${outlineImageColor}) ` +
                `drop-shadow(0 -4px 0 ${outlineImageColor})`,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s",
              zIndex: 2,
              borderRadius: currentBorderRadius,
            }}
          />
        )}
        {/* Overlay base image (no outline), on top when hovered */}
        {overlayImageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "contain",
              width: "100%",
              height: "100%",
              filter: "none",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s",
              zIndex: 3,
              borderRadius: currentBorderRadius,
            }}
          />
        )}
      </div>

      {/* Text Layer */}
      {isVertical ? (
        <>
          {/* Top left */}
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
              transition: "color 0.3s",
              pointerEvents: "none",
            }}
          >
            {verticalLines.map((line, idx) => (
              <div key={`t-${idx}`}>{line}</div>
            ))}
          </div>
          {/* Bottom right mirrored */}
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
              transition: "color 0.3s",
              pointerEvents: "none",
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
              transition: "color 0.3s",
              pointerEvents: "none",
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
              transition: "color 0.3s",
              pointerEvents: "none",
            }}
          >
            {horizontalLine}
          </div>
        </>
      )}
    </div>
  );
};

export default WonderlandCardType1;
