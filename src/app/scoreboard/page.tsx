"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Player {
  name: string;
  score: number;
  streak: number;
}

const ScoreboardPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/players');
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div style={{textAlign: 'left'}}>
      <Link href="/game">
        <button >
          Back to play game
        </button>
      </Link>
      </div>
      
      <h1 className="text-4xl font-bold mb-4">Scoreboard</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Player Name</th>
            <th className="border border-gray-300 px-4 py-2">Score</th>
            <th className="border border-gray-300 px-4 py-2">Streak</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{player.name}</td>
              <td className="border border-gray-300 px-4 py-2">{player.score}</td>
              <td className="border border-gray-300 px-4 py-2">{player.streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreboardPage;

