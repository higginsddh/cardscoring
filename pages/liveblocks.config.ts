import { LiveList, LiveObject, createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCK_KEY,
});

export type Score = {
  id: string;
  value: number;
};

type Storage = {
  teams: LiveList<{
    id: string;
    name: string;
    scores: Array<Score>;
  }>;
};

export const { RoomProvider, useOthers, useMutation, useStorage } =
  createRoomContext<{}, Storage>(client);
