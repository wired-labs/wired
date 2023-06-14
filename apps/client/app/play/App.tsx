"use client";

import { WorldMetadata } from "@wired-protocol/types";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useState } from "react";

import { env } from "@/src/env.mjs";
import { useHotkeys } from "@/src/play/hooks/useHotkeys";

import { SpaceUriId } from "./types";

const LatticeClient = dynamic(() => import("@unavi/react-client").then((m) => m.LatticeClient), {
  ssr: false,
});

interface Props {
  id: SpaceUriId;
  metadata: WorldMetadata;
  uri: string;
}

export default function App({ id, metadata, uri }: Props) {
  const [scriptsReady, setScriptsReady] = useState(false);

  useHotkeys();

  const host =
    process.env.NODE_ENV === "development"
      ? "localhost:4000"
      : metadata.info?.host || env.NEXT_PUBLIC_DEFAULT_HOST;

  return (
    <>
      <Script src="/scripts/draco_wasm_wrapper_gltf.js" onReady={() => setScriptsReady(true)} />

      <div className="fixed h-screen w-screen">
        {scriptsReady && (
          <LatticeClient
            uri={uri}
            host={host}
            animations="/models"
            defaultAvatar="/models/Robot.vrm"
            skybox="/images/Skybox.jpg"
            baseHomeServer={env.NEXT_PUBLIC_DEPLOYED_URL}
          />
        )}
      </div>
    </>
  );
}
