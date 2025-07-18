import WonderlandCardType4 from "../components/WonderlandCardType4/WonderlandCardType4";

// Demo for the 4th card: shows overlayImageSrc on hover, overlayImageSrcActive on click
const WonderlandCardType4Demo = () => {
  return (
    <WonderlandCardType4
      cardId="demo4"
      componentWidth="480px"
      aspectRatio="3/4"
      minTextSize={18}
      maxTextSize={28}
      manualLetterSpacing={1}
      imageSrc="/fourth-card-image.png"
      overlayImageSrc="/fourth-card-img2.png"
      overlayImageSrcActive="/fourth-card-img3.png"
      onClick={() => console.log("clicked type4")}
      onHover={() => console.log("hovered type4")}
      onRelease={() => console.log("released type4")}
      onUnhover={() => console.log("unhover type4")}
    />
  );
};

export default WonderlandCardType4Demo;
