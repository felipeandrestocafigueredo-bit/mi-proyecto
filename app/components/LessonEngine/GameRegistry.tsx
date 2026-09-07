import { getRegisteredGames } from "../../games";

interface GameRegistryProps {
  onSelect?: (gameId: string) => void;
}

export default function GameRegistry({ onSelect }: GameRegistryProps) {
  const games = getRegisteredGames();

  return (
   <div style={{ display: "grid", gap: 12 }}>
     {games.map((gameId) => (
       <button
         key={gameId}
         type="button"
         onClick={() => onSelect?.(gameId)}
         style={{
           padding: "12px 16px",
           borderRadius: 12,
           border: "1px solid #E2E8F0",
           background: "#fff",
           cursor: "pointer",
           fontWeight: 700,
           textAlign: "left",
         }}
       >
         {gameId}
       </button>
     ))}
   </div>
  );
}
