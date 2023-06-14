import { Node } from "@gltf-transform/core";
import { NodeExtras } from "@unavi/engine";
import { SPAWN_TITLE } from "@unavi/gltf-extensions";
import { nanoid } from "nanoid";
import { useState } from "react";

import Button from "../../../ui/Button";
import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownMenuItemProps,
  DropdownTrigger,
} from "../../../ui/DropdownMenu";
import { useStudio } from "../Studio";

export const COMPONENT_TYPE = {
  Audio: "Audio",
  Avatar: "Avatar",
  Mesh: "Mesh",
  Physics: "Physics",
  Script: "Script",
  SpawnPoint: "Spawn Point",
} as const;

export type ComponentType = (typeof COMPONENT_TYPE)[keyof typeof COMPONENT_TYPE];

interface Props {
  availableComponents: ComponentType[];
  node: Node;
  extras?: NodeExtras;
}

export default function AddComponentButton({ availableComponents, node, extras }: Props) {
  const { engine, mode } = useStudio();

  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full justify-center">
      <DropdownMenu
        open={open}
        onOpenChange={(value) => {
          if (value && mode === "play") return;
          setOpen(value);
        }}
      >
        <DropdownTrigger asChild>
          <Button disabled={mode === "play"} className="rounded-xl px-8">
            Add Component
          </Button>
        </DropdownTrigger>

        <DropdownContent>
          <div className="py-2">
            {availableComponents.includes(COMPONENT_TYPE.Audio) && (
              <ComponentButton
                onClick={() => {
                  if (!engine) return;

                  const audioData = engine.scene.extensions.audio.createAudioData();

                  const audioSource = engine.scene.extensions.audio.createAudioSource();
                  audioSource.setAudio(audioData);
                  audioSource.setAutoPlay(true);
                  audioSource.setLoop(true);
                  audioSource.setGain(0.75);

                  const audioEmitter = engine.scene.extensions.audio.createAudioEmitter();
                  audioEmitter.addSource(audioSource);

                  node.setExtension(audioEmitter.extensionName, audioEmitter);
                }}
              >
                {COMPONENT_TYPE.Audio}
              </ComponentButton>
            )}

            {availableComponents.includes(COMPONENT_TYPE.Avatar) && (
              <ComponentButton
                onClick={() => {
                  if (!engine) return;

                  const avatar = engine.scene.extensions.avatar.createAvatar();
                  avatar.setURI("");

                  node.setExtension(avatar.extensionName, avatar);
                }}
              >
                {COMPONENT_TYPE.Avatar}
              </ComponentButton>
            )}

            {availableComponents.includes(COMPONENT_TYPE.Mesh) && (
              <ComponentButton
                onClick={() => {
                  if (!engine) return;

                  const { object: mesh } = engine.scene.mesh.create({
                    extras: {
                      customMesh: {
                        depth: 1,
                        height: 1,
                        type: "Box",
                        width: 1,
                      },
                    },
                  });

                  mesh.setName(node.getName());
                  node.setMesh(mesh);
                }}
              >
                {COMPONENT_TYPE.Mesh}
              </ComponentButton>
            )}

            {availableComponents.includes(COMPONENT_TYPE.Physics) && (
              <ComponentButton
                onClick={() => {
                  if (!engine) return;

                  const collider = engine.scene.extensions.collider.createCollider();
                  collider.setType("trimesh");

                  node.setExtension(collider.extensionName, collider);
                }}
              >
                {COMPONENT_TYPE.Physics}
              </ComponentButton>
            )}

            {availableComponents.includes(COMPONENT_TYPE.Script) && (
              <ComponentButton
                onClick={() => {
                  if (!engine || !extras) return;

                  const newExtras = { ...extras };
                  if (!newExtras.scripts) newExtras.scripts = [];

                  newExtras.scripts.push({ id: nanoid(), name: "New Script" });

                  node.setExtras(newExtras);
                }}
              >
                {COMPONENT_TYPE.Script}
              </ComponentButton>
            )}

            {availableComponents.includes(COMPONENT_TYPE.SpawnPoint) && (
              <ComponentButton
                onClick={() => {
                  if (!engine) return;

                  const spawnPoint = engine.scene.extensions.spawn.createSpawnPoint();
                  spawnPoint.setTitle(SPAWN_TITLE.Default);

                  node.setExtension(spawnPoint.extensionName, spawnPoint);
                }}
              >
                {COMPONENT_TYPE.SpawnPoint}
              </ComponentButton>
            )}
          </div>
        </DropdownContent>
      </DropdownMenu>
    </div>
  );
}

function ComponentButton({ children, ...props }: DropdownMenuItemProps) {
  return (
    <DropdownItem
      className="w-full cursor-default px-10 text-left outline-none focus:bg-neutral-200 active:opacity-80"
      {...props}
    >
      {children}
    </DropdownItem>
  );
}
