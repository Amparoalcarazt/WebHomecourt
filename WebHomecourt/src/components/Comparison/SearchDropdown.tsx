import { useState, useRef, useEffect } from "react";
import type { Player } from "./Player";

interface SearchableDropdownProps {
  players: Player[];
  player: Player | null;
  color: string;
  onPlayerChange: (id: number | null) => void;
}
 
export default function SearchDropdown({ players, player, color, onPlayerChange }: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
 
  const filtered = players.filter((p) =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase())
  );
 
  const selectedLabel = player
    ? `${player.first_name} ${player.last_name}`
    : "Select player";
 
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
 
  function handleSelect(id: number | null) {
    onPlayerChange(id);
    setOpen(false);
    setSearch("");
  }
 
  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full rounded-xl p-2 font-medium shadow border-2 border-${color} bg-white text-left flex items-center justify-between`}
      >
        <span> {selectedLabel} </span>
        <svg
          className="w-4 h-4"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
 
      {/* dropdown abierto */}
      {open && (
        <div className="absolute z-10 w-full rounded-xl border border-gray-300 bg-white shadow-lg">
          {/* barra de busqueda */}
          <div className="p-2 border-gray-100">
            <div className="rounded-lg border border-gray-300 px-3 py-1">
              <input
                ref={inputRef}
                type="text"
                className="w-full text-sm outline-none placeholder-gray-400 bg-transparent"
                placeholder="Search a player"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" onClick={() => setSearch("")}></button>
              )}
            </div>
          </div>
 
          {/* jugadores */}
          <ul className="max-h-50 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No players found</li>
            ) : (
              filtered.map((p) => {
                const isSelected = player?.team_player_id === p.team_player_id;
                return (
                  <li key={p.team_player_id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(p.team_player_id)}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 ${
                        isSelected ? `font-medium text-${color} bg-gray-300` : ""
                      }`}
                    >
                      {p.first_name} {p.last_name}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}