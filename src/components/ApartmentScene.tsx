interface ApartmentSceneProps {
  stress: number;
}

const asset = (name: string) => `/assets/pixel/environment/${name}.png`;

export function ApartmentScene({ stress }: ApartmentSceneProps) {
  const moody = stress >= 60;

  return (
    <div
      className="pixel-border relative h-56 w-full overflow-hidden"
      style={{ backgroundColor: moody ? "#d8c994" : "#f3e3b3" }}
      role="img"
      aria-label="Pixel art apartment room"
    >
      <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ backgroundColor: "#a9835f" }} />

      <img src={asset("rug")} alt="" className="pixel-img absolute bottom-[4%] left-[16%] w-[48%]" />
      <img src={asset("window")} alt="" className="pixel-img absolute left-[6%] top-[6%] w-[20%]" />
      <img src={asset("wall_art")} alt="" className="pixel-img absolute left-[72%] top-[8%] w-[16%]" />
      <img src={asset("cabinet")} alt="" className="pixel-img absolute bottom-[6%] left-[2%] w-[13%]" />
      <img src={asset("bed")} alt="" className="pixel-img absolute bottom-[4%] right-[3%] w-[38%]" />
      <img src={asset("desk")} alt="" className="pixel-img absolute bottom-[7%] left-[22%] w-[26%]" />
      <img src={asset("chair")} alt="" className="pixel-img absolute bottom-[5%] left-[36%] w-[13%]" />
      <img src={asset("lamp")} alt="" className="pixel-img absolute bottom-[32%] left-[26%] w-[9%]" />
      <img src={asset("plant")} alt="" className="pixel-img absolute bottom-[7%] right-[42%] w-[13%]" />
    </div>
  );
}
