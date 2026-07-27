"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const GRAVITY = 0.55;
const JUMP_STRENGTH = -9.5;
const INITIAL_OBSTACLE_SPEED = 3;
const GROUND_Y = 150;

interface Obstacle {
  id: number;
  x: number;
  width: number;
  height: number;
  passed: boolean;
}

export const useOfflineGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Físicas usando refs para evitar re-renders
  const playerY = useRef(GROUND_Y);
  const playerVelocity = useRef(0);
  const obstacles = useRef<Obstacle[]>([]);
  const requestRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const speedMultiplier = useRef(1);
  const obstacleIdCounter = useRef(0);

  // Estados visuales (sincronizados para el renderizado)
  const [renderPlayerY, setRenderPlayerY] = useState(GROUND_Y);
  const [renderObstacles, setRenderObstacles] = useState<Obstacle[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("can-offline-high-score");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const jump = useCallback(() => {
    if (!isPlaying && !isGameOver) {
      setIsPlaying(true);
      return;
    }
    if (isGameOver) {
      setIsGameOver(false);
      setIsPlaying(true);
      playerY.current = GROUND_Y;
      playerVelocity.current = 0;
      obstacles.current = [];
      scoreRef.current = 0;
      speedMultiplier.current = 1;
      setScore(0);
      return;
    }
    // Salta solo si está en el suelo (o muy cerca)
    if (playerY.current >= GROUND_Y - 1) {
      playerVelocity.current = JUMP_STRENGTH;
    }
  }, [isPlaying, isGameOver]);

  const updatePhysics = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    // Gravedad
    playerVelocity.current += GRAVITY;
    playerY.current += playerVelocity.current;

    // Suelo
    if (playerY.current >= GROUND_Y) {
      playerY.current = GROUND_Y;
      playerVelocity.current = 0;
    }

    const currentSpeed = INITIAL_OBSTACLE_SPEED * speedMultiplier.current;
    
    // Generar obstáculos (Conos deportivos)
    if (obstacles.current.length === 0 || obstacles.current[obstacles.current.length - 1].x < 220) {
      // Aleatoriedad ligeramente ajustada según la velocidad para que no se separen demasiado
      const spawnChance = Math.min(0.02 * speedMultiplier.current, 0.05);
      if (Math.random() < spawnChance) {
        obstacleIdCounter.current += 1;
        obstacles.current.push({
          id: obstacleIdCounter.current,
          x: 500, // Fuera de la pantalla (ancho del contenedor ~400)
          width: 24,
          height: 30 + Math.random() * 25, // Conos de diferentes alturas
          passed: false,
        });
      }
    }

    let collision = false;
    
    obstacles.current.forEach((obs) => {
      obs.x -= currentSpeed;
      
      // Hitbox del jugador (el balón) aprox 24x24
      const playerRect = { x: 50, y: playerY.current - 24, width: 20, height: 20 };
      const obsRect = { x: obs.x, y: GROUND_Y - obs.height, width: obs.width, height: obs.height };

      // Detección AABB
      if (
        playerRect.x < obsRect.x + obsRect.width &&
        playerRect.x + playerRect.width > obsRect.x &&
        playerRect.y < obsRect.y + obsRect.height &&
        playerRect.y + playerRect.height > obsRect.y
      ) {
        collision = true;
      }

      // Puntuación
      if (!obs.passed && obs.x + obs.width < playerRect.x) {
        obs.passed = true;
        scoreRef.current += 10;
        
        // Aumentar dificultad gradualmente con cada obstáculo superado
        speedMultiplier.current += 0.03;
      }
    });

    if (collision) {
      setIsGameOver(true);
      setIsPlaying(false);
      setScore(scoreRef.current);
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current);
        localStorage.setItem("can-offline-high-score", scoreRef.current.toString());
      }
    } else {
      // Limpiar obstáculos que ya pasaron
      obstacles.current = obstacles.current.filter((obs) => obs.x > -50);
      
      // Actualizar estado react
      setRenderPlayerY(playerY.current);
      setRenderObstacles([...obstacles.current]);
      setScore(scoreRef.current);
    }

    requestRef.current = requestAnimationFrame(updatePhysics);
  }, [isPlaying, isGameOver, highScore]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updatePhysics]);

  return {
    isPlaying,
    isGameOver,
    score,
    highScore,
    playerY: renderPlayerY,
    obstacles: renderObstacles,
    jump,
  };
};
