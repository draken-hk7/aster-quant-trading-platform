"use client";

import { useEffect } from "react";
import type { TerminalSnapshot } from "@/lib/types";
import { useTerminalStore } from "@/store/terminal-store";

const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/terminal";

export function useTerminalStream() {
  const setSnapshot = useTerminalStore((state) => state.setSnapshot);
  const setConnected = useTerminalStore((state) => state.setConnected);

  useEffect(() => {
    let active = true;
    let socket: WebSocket | null = null;
    let retry: ReturnType<typeof setTimeout>;

    const connect = () => {
      socket = new WebSocket(wsUrl);
      socket.onopen = () => setConnected(true);
      socket.onmessage = (event) => {
        const payload = JSON.parse(event.data) as TerminalSnapshot;
        if (payload.type === "terminal.snapshot") {
          setSnapshot(payload);
        }
      };
      socket.onclose = () => {
        setConnected(false);
        if (active) retry = setTimeout(connect, 1200);
      };
      socket.onerror = () => socket?.close();
    };

    connect();
    return () => {
      active = false;
      clearTimeout(retry);
      socket?.close();
    };
  }, [setConnected, setSnapshot]);
}

