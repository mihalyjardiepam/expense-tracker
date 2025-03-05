import { useCallback, useState } from "react";
import { generateRandomColor } from "~/lib/generate-random-color";

const ColorGenTester = () => {
  const [randomColor, setRandomColor] = useState(() => generateRandomColor());

  const generateColor = useCallback(() => {
    setRandomColor(generateRandomColor());
  }, [setRandomColor]);

  return (
    <button
      onClick={generateColor}
      style={{
        backgroundColor: randomColor,
        width: 200,
        height: 200,
        border: "none",
        transition: "all .2s ease-in-out",
      }}
    >
      Generate Color ({randomColor})
    </button>
  );
};

export default ColorGenTester;
