import { RequestMessage } from "@wired-protocol/types";
import { Engine } from "lattice-engine/core";
import { create } from "zustand";

import { ChatMessage, EcsEvent } from "./types";
import { toHex } from "./utils/toHex";

export interface IClientStore {
  addChatMessage: (message: ChatMessage) => void;
  cleanupConnection: () => void;
  getDisplayName: (playerId: number) => string;
  sendWebRTC: (message: ArrayBuffer) => void;
  sendWebSockets: (message: RequestMessage) => void;
  setAvatar: (avatar: string) => void;
  setHandle: (handle: string) => void;
  setName: (name: string) => void;
  setPlayerId: (playerId: number | null) => void;
  names: Map<number, string>;
  avatar: string;
  avatars: Map<number, string>;
  chatMessages: ChatMessage[];
  defaultAvatar: string;
  engine: Engine | null;
  events: EcsEvent[];
  falling: Map<number, boolean>;
  handle: string;
  handles: Map<number, string>;
  lastLocationUpdates: Map<number, number>;
  locations: Map<number, number[]>;
  name: string;
  playerId: number | null;
  skybox: string;
  worldUri: string;
}

export const useClientStore = create<IClientStore>((set, get) => ({
  addChatMessage: (message: ChatMessage) => {
    const chatMessages = get().chatMessages;
    chatMessages.push(message);
    if (chatMessages.length > 100) chatMessages.shift();
    set({ chatMessages: [...chatMessages] });
  },
  avatar: "",
  avatars: new Map(),
  chatMessages: [],
  cleanupConnection: () => {},
  defaultAvatar: "",
  engine: null,
  events: [],
  falling: new Map(),
  getDisplayName: (playerId: number) => {
    const handle = get().handles.get(playerId);
    if (handle) return handle;

    const name = get().names.get(playerId);
    if (name) return name;

    return `Guest ${toHex(playerId)}`;
  },
  handle: "",
  handles: new Map(),
  lastLocationUpdates: new Map(),
  locations: new Map(),
  name: "",
  names: new Map(),
  playerId: null,
  sendWebRTC: () => {},
  sendWebSockets: () => {},
  setAvatar(avatar: string) {
    set({ avatar });

    // Update avatars map
    const playerId = get().playerId;
    if (playerId === null) return;
    get().avatars.set(playerId, avatar);
  },
  setHandle(handle: string) {
    set({ handle });

    // Update handles map
    const playerId = get().playerId;
    if (playerId === null) return;
    get().handles.set(playerId, handle);
  },
  setName(name: string) {
    set({ name });

    // Update names map
    const playerId = get().playerId;
    if (playerId !== null) {
      get().names.set(playerId, name);
    }
  },
  setPlayerId(playerId: number | null) {
    const oldPlayerId = get().playerId;

    if (oldPlayerId === playerId) return;

    if (oldPlayerId !== null) {
      get().avatars.delete(oldPlayerId);
      get().handles.delete(oldPlayerId);
      get().names.delete(oldPlayerId);
    }

    if (playerId !== null) {
      get().avatars.set(playerId, get().avatar);
      get().handles.set(playerId, get().handle);
      get().names.set(playerId, get().name);
    }

    set({ playerId });
  },
  skybox: "",
  worldUri: "",
}));
