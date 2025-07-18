import React, { useRef, useEffect, useState } from "react";
import RainbowBackground from "./RainbowBackground";

export interface WonderlandCardType4Props {
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
  overlayImageSrc?: string;
  overlayImageSrcActive?: string;
  imageAlt?: string;
  overlayImageAlt?: string;
  imageHeightPercentage?: number;
  outlineImageColor?: string;
  onClick?: () => void;
  onHover?: () => void;
  onUnhover?: () => void;
  onRelease?: () => void;
  rainbowBarCount?: number;
  rainbowAnimationTime?: number;
  inscriptionFontWeight?: React.CSSProperties["fontWeight"];
  defaultInscriptionText?: string | string[];
  mirroredInscriptionText?: string | string[];
}

const WonderlandCardType4: React.FC<WonderlandCardType4Props> = ({
  cardId = "wonderland-card-type4",
  textArray,
  fontSize,
  letterSpacing = "0.17em",
  manualLetterSpacing,
  minTextSize = 16,
  maxTextSize = 26,
  minCardWidth = 200,
  maxCardWidth = 400,
  componentWidth = "340px",
  aspectRatio = "3/4",
  outlineColor = "#aaa",
  outlineHoverColor = "#8F04A7",
  outlineActiveColor = "#00aeee",
  outlineWidth = "2px",
  outlineWidthHover = "6px",
  outlineWidthActive = "4px",
  borderRadius = "12px",
  borderRadiusHover = "32px",
  borderRadiusActive = "24px",
  backgroundColor = "#fff",
  textColor = "#1F232E",
  textColorHover = "#8F04A7",
  textColorActive = "#2196F3",
  textPaddingTop = "16px",
  textPaddingLeft = "22px",
  imageSrc,
  overlayImageSrc,
  overlayImageSrcActive,
  imageAlt = "",
  overlayImageAlt = "",
  imageHeightPercentage = 92,
  outlineImageColor = "#transparent",
  onHover,
  onUnhover,
  onClick,
  onRelease,
  rainbowBarCount = 25,
  rainbowAnimationTime = 45,
  inscriptionFontWeight = 900,
  defaultInscriptionText = ["武", "士", "道"],
  mirroredInscriptionText = ["さ", "む", "ら", "い"],
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

  const currentOutlineColor = isActive
    ? outlineActiveColor
    : isHovered
    ? outlineHoverColor
    : outlineColor;
  const currentOutlineWidth = isActive
    ? outlineWidthActive
    : isHovered
    ? outlineWidthHover
    : outlineWidth;
  const currentBorderRadius = isActive
    ? borderRadiusActive
    : isHovered
    ? borderRadiusHover
    : borderRadius;
  const currentTextColor = isActive
    ? textColorActive
    : isHovered
    ? textColorHover
    : textColor;

  const verticalSpacing =
    manualLetterSpacing !== undefined
      ? manualLetterSpacing
      : computedFontSize * 0.18;

  function renderInscription(
    content: string | string[] | undefined,
    style: React.CSSProperties
  ) {
    if (content === undefined) return null;
    if (typeof content === "string") return <div style={style}>{content}</div>;
    return (
      <div
        style={{
          ...style,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: `${verticalSpacing}px`,
        }}
      >
        {content.map((char, idx) => (
          <div key={idx}>{char}</div>
        ))}
      </div>
    );
  }
  function buildOutlineFilter(color: string) {
    return [
      `drop-shadow(4px 0 0 ${color})`,
      `drop-shadow(-4px 0 0 ${color})`,
      `drop-shadow(0 4px 0 ${color})`,
      `drop-shadow(0 -4px 0 ${color})`,
    ].join(" ");
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
        transition:
          "outline-color 0.35s, outline-width 0.35s, border-radius 0.36s",
        overflow: "hidden",
        backgroundColor,
        boxSizing: "border-box",
      }}
      onMouseEnter={() => { setHovered(true); onHover?.(); }}
      onMouseLeave={() => { setHovered(false); setActive(false); onUnhover?.(); }}
      onMouseDown={() => { setActive(true); onClick?.(); }}
      onMouseUp={() => { setActive(false); onRelease?.(); }}
    >
      {/* Rainbow background (appears only on hover/click, perfectly clipped) */}
      <RainbowBackground
        visible={isHovered || isActive}
        borderRadius={currentBorderRadius}
        barCount={rainbowBarCount}
        animationTime={rainbowAnimationTime}
      />

      {/* Card content, image, text etc */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: backgroundColor,
          opacity: isHovered || isActive ? 0 : 1,
          transition: "opacity 0.45s cubic-bezier(.45,.03,.52,1.01)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
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
            filter: buildOutlineFilter(outlineImageColor),
            zIndex: 1,
          }}
          draggable={false}
        />
        {overlayImageSrcActive && isActive && (
          <img
            src={overlayImageSrcActive}
            alt={overlayImageAlt}
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "contain",
              width: "100%",
              height: "100%",
              filter: buildOutlineFilter(outlineImageColor),
              opacity: 1,
              transition: "opacity 0.2s",
              zIndex: 4,
              borderRadius: currentBorderRadius,
            }}
            draggable={false}
          />
        )}
        {overlayImageSrc && isHovered && !isActive && (
          <img
            src={overlayImageSrc}
            alt={overlayImageAlt}
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "contain",
              width: "100%",
              height: "100%",
              filter: buildOutlineFilter(outlineImageColor),
              opacity: 1,
              transition: "opacity 0.3s",
              zIndex: 3,
              borderRadius: currentBorderRadius,
            }}
            draggable={false}
          />
        )}
      </div>
      {/* Top left inscription */}
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
          transition: "color 0.3s",
          pointerEvents: "none",
        }}
      >
        {renderInscription(textArray ?? defaultInscriptionText, {})}
      </div>
      {/* Bottom right (mirrored) */}
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
          transition: "color 0.3s",
          pointerEvents: "none",
        }}
      >
        {renderInscription(textArray ?? mirroredInscriptionText, {})}
      </div>
    </div>
  );
};

export default WonderlandCardType4;