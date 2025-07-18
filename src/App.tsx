import WonderlandCardType1Demo from "../src/demos/WonderlandCardType1";
import WonderlandCardType2Demo from "../src/demos/WonderlandCardType2";
import WonderlandCardType3Demo from "../src/demos/WonderlandCardType3";
import WonderlandCardType4Demo from "../src/demos/WonderlandCardType4";
import "./App.css";

// Helper to parse [label](link) markdown as React
function parseMarkdownEntry(entry: string) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const elements = [];
  let key = 0;
  while ((match = regex.exec(entry)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        <span key={key++} style={{ color: "#f8f8fb" }}>
          {entry.slice(lastIndex, match.index)}
        </span>
      );
    }
    elements.push(
      <a
        key={key++}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="credit-link"
      >
        {match[1]}
      </a>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < entry.length) {
    elements.push(
      <span key={key++} style={{ color: "#f8f8fb" }}>
        {entry.slice(lastIndex)}
      </span>
    );
  }
  return elements;
}

const promptFields = [
  {
    label: "Prompt for first image",
    value: "Young Italian woman with olive skin, dark wavy hair, and blue eyes, sitting half-profile on a lush apple bush with roses and blueberries. The bush is dense and leafy, supported by a thin cartoon mushroom stem—no mushroom head—with a rounded patch of soil at the base. Serious, jokerish expression, gazing upward. One arm raised, hand open and fingers curled as if holding a ball, but empty; above the palm floats a bright cartoon flame. Other hand in pants pocket. Both legs visible. Blue and white chessboard-pattern pants, crisp white Victorian-inspired shirt, bold leather coat, dark hat with white rose, black boots. 1950s American cartoon style, pop art accents, hard edges, bright colors, solid white background.",
  },
  {
    label: "Prompt for second image",
    value: "A single, rounded, lush bush with a tall, visible stem stands against a solid white background, surrounded by ample empty space. The bush is fully engulfed in lively, exaggerated flames that burst and swirl from within every layer of the foliage, rendered in a bold 1950s American cartoon style mixed with pop-art. Among the dense leaves, clusters of roses and stylized flowers inspired by Russian folk embroidery patterns bloom alongside vivid blueberries. The design is clean, colorful, playful, and outline-free, capturing a vibrant retro charm while emphasizing the miraculous energy of the burning bush.",
  },
  {
    label: "Prompt for third image",
    value: "Illustrate an elegant, naturally proportioned Japanese koi fish in a beautifully flowing, sinuous pose, conveying movement and grace. Adorn the fish’s body with vivid, ornate Russian floral patterns in rich, saturated colors, carefully integrated to enhance its natural form. Place the koi on a crisp, solid white background. Render the artwork in the bold lines, playful curves, and vibrant palette characteristic of 1950s American cartoons, with a touch of pop art flair for a smooth, stylish, and visually striking composition.",
  },
  {
    label: "Prompt for fourth image",
    value: "A single, stylized cavalier knight stands against a solid white background, surrounded by ample empty space. The knight wears dark armor that features a chessboard-like pattern integrated into the design. He wears a hat that complements his stylized appearance. In one hand, he grips a Japanese katana with confidence. His other hand is slightly closed, palm facing upward and open, with a small, swirling tornado hovering just above the palm—the pose and gesture echo the dynamic, focused style of an airbender conjuring elemental energy. The illustration is rendered in a bold, clean, and colorful 1950s American cartoon style with pop-art influences, emphasizing the dramatic fusion of medieval, fantasy, and elemental themes.",
  },
];

const creditsMarkdown = `
[pure css png outline](https://codepen.io/schatt3npakt/pen/poLPMZK) by [bitheart](https://codepen.io/schatt3npakt)

[UZUMAKI](https://codepen.io/Alansdead/pen/zxGyOmx) by [Jules](https://codepen.io/Alansdead)

[Tranquiluxe](https://uvcanvas.com/docs/components/tranquiluxe) by [UVCanvas](https://uvcanvas.com/)

[Novatrix](https://uvcanvas.com/docs/components/novatrix) by [UVCanvas](https://uvcanvas.com/)

[Pure CSS - Rainbow Background](https://codepen.io/sylvaingarnot/pen/OJqoXaR) by [sylvain garnot](https://codepen.io/sylvaingarnot)
`;

const creditEntries = creditsMarkdown
  .split(/\n\s*\n/)
  .map((e) => e.trim())
  .filter(Boolean);

function App() {
  return (
    <div className="app-outer">
      <header>
        <h1 className="responsive-title" style={{ color: "#4abca5" }}>{"<Wonderland Card />"}</h1>
        <h2 className="responsive-description">Cards react on hover and click differently.</h2>
      </header>


      <div className="card-container">
        <WonderlandCardType1Demo />
        <WonderlandCardType2Demo />
        <WonderlandCardType3Demo />
        <WonderlandCardType4Demo />
      </div>

      <section className="credit-section">
        <div className="credits-title">Credit</div>
        {creditEntries.map((entry, idx) => (
          <div className="credit-entry" key={idx}>{parseMarkdownEntry(entry)}</div>
        ))}
      </section>
      <div style={{height: '24px'}} />
      <div className="generated-images-note">
        Images are generated using{" "}
        <a
          href="https://pollinations.ai/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pollinations
        </a>
      </div>

      <section className="prompt-fields-area">
        {promptFields.map((field, i) => (
          <div className="prompt-container" key={i}>
            <div className="prompt-label">{field.label}</div>
            <div className="prompt-text">{field.value}</div>
          </div>
        ))}
      </section>

      <div className="generated-images-note">
        <div>
          Made by{" "}
          <a
            href="https://maxim-bortnikov.netlify.app/"
            className="made-by-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Maxim Bortnikov
          </a>
        </div>
        <div style={{height: '6px'}} />
        <a
          href="https://github.com/Northstrix/wonderland-card"
          className="github-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repository
        </a>
      </div>
    </div>
  );
}

export default App;
