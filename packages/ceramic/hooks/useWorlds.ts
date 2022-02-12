import useSWR from "swr";
import { DIDDataStore } from "@glazed/did-datastore";
import { ceramicRead } from "..";

const model = require("../models/Worlds/model.json");

export function useWorlds(did: string) {
  const ceramic = ceramicRead;

  async function fetcher() {
    if (!did) return;
    const store = new DIDDataStore({ ceramic, model });
    const data: string[] = Object.values(
      (await store.get("worlds", did)) as any
    );
    return data;
  }

  const { data } = useSWR(`worlds-${did}`, fetcher);

  return data;
}
