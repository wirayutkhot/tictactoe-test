'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import styles from '../../styles/GamePage.module.css';
import Link from 'next/link';

const initialBoard = ['', '', '', '', '', '', '', '', ''];

export default function GamePage() {
  const { user, isLoading } = useUser();
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (user && !isLoading) {
      const fetchPlayer = async () => {
        try {
          const response = await fetch('/api/players');

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          const player = data.find((p) => p.name === user.name);

          if (player) {
            setScore(player.score);
            setStreak(player.streak);
          } else {
            await saveScore(0, 0); // สร้างผู้เล่นใหม่หากยังไม่มีในระบบ
          }
        } catch (error) {
          console.error("Error fetching player data:", error);
        }
      };
      fetchPlayer();
    }
  }, [user, isLoading]);

  const handleWin = async () => {
    const newScore = score + 1;
    const newStreak = streak + 1;

    if (newStreak === 3) {
      await saveScore(newScore + 1, 0); // เซฟคะแนนพิเศษ
    } else {
      await saveScore(newScore, newStreak);
    }

    alert(`${user.name} ชนะ +1 คะแนน`);
    resetGame();
  };

  const handleLoss = async () => {
    await saveScore(score - 1, 0); // เซฟคะแนนเมื่อแพ้
    alert(`Bot ชนะ -1 คะแนน`);
    resetGame();
  };

  const saveScore = async (newScore, newStreak) => {
    setScore(newScore);
    setStreak(newStreak);

    await fetch('/api/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: user.name, score: newScore, streak: newStreak }),
    });
  };

  const handlePlayerMove = (index) => {
    if (board[index] !== '' || !isPlayerTurn) return;

    const newBoard = board.slice();
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    // เช็คผลหลังจากผู้เล่นเดิน
    if (checkWinner(newBoard)) return;

    setTimeout(() => {
      botMove(newBoard);
    }, 500);
  };

  const botMove = (newBoard) => {
    let emptyIndices = newBoard.map((val, idx) => (val === '' ? idx : null)).filter((val) => val !== null);
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);
    setIsPlayerTurn(true);

    // เช็คผลหลังจากบอทเดิน
    checkWinner(newBoard);
  };

  const checkWinner = (newBoard) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        if (newBoard[a] === 'X') {
          handleWin();
        } else {
          handleLoss();
        }
        return true; // คืนค่า true เมื่อมีผู้ชนะ
      }
    }

    // เช็คว่าเกมเสมอหรือไม่
    if (newBoard.every((val) => val !== '')) {
      alert('เสมอ!');
      resetGame();
      return true; // คืนค่า true เมื่อเสมอ
    }

    return false; // คืนค่า false เมื่อยังไม่มีผู้ชนะ
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsPlayerTurn(true);
  };

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">Please log in to play</h1>
        <a href="/api/auth/login" className="text-white bg-blue-500 px-4 py-2 rounded">
          Log in
        </a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className="text-10xl font-bold mb-4" style={{ fontSize: '5rem' }}>Tic-Tac-Toe</h1>

      <div className="mt-6">
        {isPlayerTurn ? (
          <p className="text-lg text-green-600">Your turn!</p>
        ) : (
          <p className="text-lg text-red-600">Bot's turn...</p>
        )}
      </div>

      <div className={styles.board}>
        {board.map((cell, idx) => (
          <div
            key={idx} className={styles.cell}
            onClick={() => handlePlayerMove(idx)}
          >
            {cell === 'X' ? <span className={styles.x}>{cell}</span> : null}
            {cell === 'O' ? <span className={styles.o}>{cell}</span> : null}
          </div>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="mt-6 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
      >
        Reset Game
      </button>

      <p className="text-xl text-gray-600">Player: {user?.name}</p>
      <p className="text-xl text-gray-600">Score: {score}</p>
      <p className="text-xl text-gray-600">Streak: {streak}</p>
      <Link href="/scoreboard" className="mt-6 px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-700">
        View Scoreboard
      </Link>

      <a href="/api/auth/logout" className="text-white bg-red-500 px-4 py-2 rounded mt-4">
        Log out
      </a>
    </div>
  );
}
