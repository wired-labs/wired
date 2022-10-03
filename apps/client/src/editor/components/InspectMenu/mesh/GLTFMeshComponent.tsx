import { GLTFMesh } from "@wired-labs/engine";

import FileInput from "../../../../ui/base/FileInput";
import { updateEntity } from "../../../actions/UpdateEntityAction";
import { useSubscribeValue } from "../../../hooks/useSubscribeValue";
import ComponentMenu from "../ComponentMenu";

interface Props {
  entityId: string;
  mesh: GLTFMesh;
}

export default function GLTFMeshComponent({ entityId, mesh }: Props) {
  const name = useSubscribeValue(mesh.name$);

  return (
    <ComponentMenu title="Model">
      <FileInput
        displayName={name}
        accept=".glb,.gltf"
        onChange={(e) => {
          if (!e.target.files) return;

          const file = e.target.files[0];
          if (!file) return;

          mesh.name = file.name;
          mesh.uri = URL.createObjectURL(file);

          updateEntity(entityId, { mesh: mesh.toJSON() });
        }}
      />
    </ComponentMenu>
  );
}
