import WonderlandCardType2 from "../components/WonderlandCardType2/WonderlandCardType2";

const WonderlandCardType2Demo = () => {
  return (
      <WonderlandCardType2
        cardId="demo2"
        componentWidth="480px"
        aspectRatio="3/4"
        minTextSize={16}
        maxTextSize={28}
        manualLetterSpacing={1}
        imageSrc="/second-card-image.png"
        imageHeightPercentage={81}
        borderRadius="12px"
        borderRadiusHover="24px"
        borderRadiusActive="6px"
        inscriptionFontWeight={500}
        tranquiluxeProps={{
          color: [1, 0.47, 0.07], // original vivid orange (#ff7812)
          speed: 0.7,
        }}
        tranquiluxePropsActive={{
          color: [0.27, 0.78, 1], // light blue #45c7ff
          speed: 1.2,
        }}
        backgroundColor="#0a0a0a"
        textColor="#fff"
        textColorHover="#0a0a0a"
        textColorActive="#fff"
        onClick={() => console.log("clicked type2")}
        onHover={() => console.log("hovered type2")}
        onRelease={() => console.log("released type2")}
        onUnhover={() => console.log("unhover type2")}
      />
  );
};

export default WonderlandCardType2Demo;
