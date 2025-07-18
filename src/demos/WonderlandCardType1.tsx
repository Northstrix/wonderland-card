import WonderlandCardType1 from "../components/WonderlandCardType1/WonderlandCardType1";

const WonderlandCardType1Demo = () => {
  return (
    <WonderlandCardType1
      cardId="demo"
      componentWidth="480px"
      aspectRatio="3/4"
      textArray={["生", "存"]}
      minTextSize={18}
      maxTextSize={26}
      manualLetterSpacing={0}
      imageSrc="/first-card-image.png"
      overlayImageSrc="/first-card-img2.png"
      imageHeightPercentage={84}
      borderRadius="12px"
      borderRadiusHover="24px"
      borderRadiusActive="36px"
      backgroundColor="#fff"
      hoverBackgroundOpacity={0}
      onClick={() => console.log("clicked type1")}
      onHover={() => console.log("hovered type1")}
      onRelease={() => console.log("released type1")}
      onUnhover={() => console.log("unhover type1")}
      inscriptionFontWeight={800}
      spiralProps={{
        // All these are defaults, you may omit or override any property:
        overlayColor: "rgba(255,255,255,1)",
        overlayOpacity: 0.02,
        spiralDensity: 8,
        distortionFactor: 0.9,
        animationSpeed: 0.5,
        spiralLayers: 3,
        tendrilCount: 3,
        particleCount: 600,
        particleColor: "rgba(255,255,255,0.17)",
        backgroundColorDefault: "rgba(0,0,0,0.052)",
        backgroundColorActive: "rgba(21,1,25,1)",
      }}
    />
  );
};

export default WonderlandCardType1Demo;
