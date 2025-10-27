"use client";
import Country from "@/lib/Country";
import { useEffect, useState } from "react";
import { createNoise2D } from "simplex-noise";

const width = 1750;
const height = 800;
const scale = 0.05;

export default function Home() {
  const randomName = (): string => {
    const syllables = [
      "ka",
      "lo",
      "na",
      "ri",
      "ta",
      "me",
      "zu",
      "fi",
      "sha",
      "po",
    ];
    const len = 2 + Math.floor(Math.random() * 2);
    return syllables
      .sort(() => 0.5 - Math.random())
      .slice(0, len)
      .join("")
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const [countries, setCountries] = useState<Array<Country>>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  useEffect(() => {
    const noise = createNoise2D();
    const cols = 200;
    const rows = 100;
    const threshold = 0.35;
    let ID = 0;

    const generatedCountries: Array<Country> = [];
    const grid = Array.from({ length: rows }, (_, y) =>
      Array.from({ length: cols }, (_, x) => noise(x * scale, y * scale))
    );

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    const floodFill = (x: number, y: number, cells: Cells) => {
      const stack: Array<[number, number]> = [[x, y]];
      visited[y]![x] = true;

      while (stack.length) {
        const [cx, cy]: Cell = stack.pop()!;
        cells.push([cx, cy] as Cell);
        const offsets: Cells = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ];
        offsets.forEach(([dx, dy]) => {
          const nx = cx + dx;
          const ny = cy + dy;
          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < cols &&
            ny < rows &&
            !visited[ny]![nx] &&
            grid[ny]![nx]! > threshold
          ) {
            visited[ny]![nx] = true;
            stack.push([nx, ny]);
          }
        });
      }
    };

    for (let y = 0; y < rows; ++y) {
      for (let x = 0; x < cols; ++x) {
        if (!visited[y]?.[x] && grid[y]![x]! > threshold) {
          const cells: Cells = [];
          floodFill(x, y, cells);
          if (cells.length > 10) {
            generatedCountries.push(new Country(ID, randomName(), cells));
            ++ID;
          }
        }
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountries(generatedCountries);
  }, []);

  const cellSize = width / 200;

  return (
    <div className="flex flex-col min-h-screen items-center justify-center font-sans bg-black">
      {selectedCountry && (
        <header className="absolute w-1/2 top-6 flex flex-col gap-x-36 rounded-xl bg-gray-800 p-4 text-center shadow-lg">
          <div className="flex *:inline-block *:mx-12 *:flex-2/5">
            <div>
              <h2 className="text-xl font-bold *:text-sm *:text-gray-400">
                {selectedCountry.name}
              </h2>
              <p>
                Population:{" "}
                {selectedCountry.population < 10 ** 6
                  ? `${(selectedCountry.population / 1000).toFixed(2)}k`
                  : `${(selectedCountry.population / 10 ** 6).toFixed(2)} Mio`}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold *:text-sm *:text-gray-400">
                Economy
              </h2>
              <p>BIP / Capita: {selectedCountry.BIPpC}</p>
              <p>
                BIP:{" "}
                {selectedCountry.BIP < 10 ** 6
                  ? `${(selectedCountry.BIP / 1000).toFixed(2)}k`
                  : selectedCountry.BIP < 10 ** 9
                  ? `${(selectedCountry.BIP / 10 ** 6).toFixed(2)} Mio`
                  : `${(selectedCountry.BIP / 10 ** 9).toFixed(2)} Bio`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCountry(null)}
            className="rounded bg-gray-600 px-3 py-1 text-sm hover:bg-gray-700"
          >
            Close
          </button>
        </header>
      )}
      <main className="flex h-full w-screen flex-col items-center justify-between pb-4 pt-8 px-16 bg-black">
        <svg
          width={width}
          height={height}
          style={{ background: "#cfe8ff", border: "1px solid #888" }}
        >
          {countries.map((c) =>
            c.cells.map(([x, y], i) => (
              <rect
                key={`${c.id}-${i}`}
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize}
                height={cellSize}
                fill={selectedCountry?.id === c.id ? "#ffcc00" : c.color}
                stroke={selectedCountry?.id === c.id ? "#000" : "#333"}
                strokeWidth={0.1}
                onClick={() => setSelectedCountry(c)}
                style={{ cursor: "pointer" }}
              />
            ))
          )}
        </svg>
      </main>
    </div>
  );
}
