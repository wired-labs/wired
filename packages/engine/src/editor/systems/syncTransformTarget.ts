import { TransformControls } from "lattice-engine/transform";
import { Mut, Query } from "thyseus";

import { useSceneStore } from "../sceneStore";

let lastTransformTarget: bigint | undefined;

export function syncTransformTarget(
  transformControls: Query<Mut<TransformControls>>
) {
  for (const controls of transformControls) {
    const targetId = controls.targetId;

    const { sceneTreeId, selectedId, rootId, items } = useSceneStore.getState();

    const uiId = selectedId ?? 0n;

    if (targetId !== lastTransformTarget) {
      // Set UI from transform controls
      lastTransformTarget = targetId;

      const usedId = sceneTreeId ?? rootId;
      if (!usedId) continue;

      // Continue up tree until we reach a child of usedId
      let newTargetId = targetId;

      while (newTargetId !== usedId) {
        const parentId: bigint | undefined = items.get(newTargetId)?.parentId;
        if (!parentId) break;

        if (parentId === usedId) {
          // We've reached a child of usedId
          break;
        }

        newTargetId = parentId;
      }

      // If locked, do not select it
      if (items.get(newTargetId)?.locked) {
        newTargetId = 0n;
      }

      setTransformTarget(controls, newTargetId);
    } else if (targetId !== uiId) {
      // Set transform controls from UI
      lastTransformTarget = uiId;
      setTransformTarget(controls, uiId);
    }
  }
}

function setTransformTarget(controls: TransformControls, targetId: bigint) {
  const { items } = useSceneStore.getState();

  controls.targetId = targetId;

  const selectedId = targetId === 0n ? undefined : targetId;
  useSceneStore.setState({ selectedId });

  // Disable transform controls if target is locked
  const locked = items.get(targetId)?.locked;
  controls.enabled = !locked;
}
