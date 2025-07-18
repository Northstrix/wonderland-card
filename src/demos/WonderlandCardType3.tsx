import WonderlandCardType3 from "../components/WonderlandCardType3/WonderlandCardType3";

const WonderlandCardType3Demo = () => {
  return (
      <WonderlandCardType3
        cardId="demo3"
        componentWidth="480px"
        aspectRatio="3/4"
        minTextSize={16}
        maxTextSize={28}
        manualLetterSpacing={1}
        imageSrc="/third-card-image.png"
        imageHeightPercentage={78}
        borderRadius="12px"
        borderRadiusHover="8px"
        borderRadiusActive="20px"
        inscriptionFontWeight={900}
        backgroundColor="#fff"
        onClick={() => console.log("clicked type3")}
        onHover={() => console.log("hovered type3")}
        onRelease={() => console.log("released type3")}
        onUnhover={() => console.log("unhover type3")}
      />
  );
};

export default WonderlandCardType3Demo;
