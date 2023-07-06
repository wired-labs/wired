import { EditorMessage } from "@unavi/protocol";
import {
  RequestMessage,
  WorldPlayerJoin,
  WorldPlayerLeave,
} from "@wired-protocol/types";

export type ValidSendMessage = RequestMessage | EditorMessage;

export type PlayerMessage = {
  type: "player";
  id: number;
  timestamp: number;
  text: string;
  playerId: number;
};

export type SystemMessage = {
  type: "system";
  id: number;
  timestamp: number;
  text: string;
};

export type ChatMessage = PlayerMessage | SystemMessage;

export type EcsEvent = WorldPlayerJoin | WorldPlayerLeave | EditorMessage;
