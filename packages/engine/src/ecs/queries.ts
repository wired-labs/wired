import { Not, defineQuery } from "bitecs";

import { Child, SceneObject } from "./components";
import {
  Animation,
  AnimationChannel,
  AnimationSampler,
  AttributeColor,
  AttributeNormal,
  AttributePosition,
  AttributeSkinIndex,
  AttributeSkinWeight,
  AttributeTangent,
  AttributeUV,
  AttributeUV2,
  ColorTexture,
  EmissiveTexture,
  Material,
  MetallicRoughnessTexture,
  MorphTarget,
  Node,
  NodeMesh,
  NodeParent,
  NodeSkin,
  NormalTexture,
  OcclusionTexture,
  Primitive,
  PrimitiveIndices,
  PrimitiveMaterial,
  Skin,
  SkinJoint,
} from "./glTF-components";

export const nodeQuery = defineQuery([Node]);
export const nodeWithMeshQuery = defineQuery([Node, NodeMesh]);
export const nodeWithSkinQuery = defineQuery([Node, NodeSkin]);
export const nodeWithMeshAndSkinQuery = defineQuery([Node, NodeMesh, NodeSkin]);
export const nodeWithParentQuery = defineQuery([Node, NodeParent]);
export const nodeWithoutParentQuery = defineQuery([Node, Not(NodeParent)]);

export const skinQuery = defineQuery([Skin]);
export const jointQuery = defineQuery([SkinJoint]);

export const primitiveQuery = defineQuery([Primitive]);
export const primitiveWithMaterialQuery = defineQuery([Primitive, PrimitiveMaterial]);
export const primitiveWithIndicesQuery = defineQuery([Primitive, PrimitiveIndices]);
export const primitiveWithPositionQuery = defineQuery([Primitive, AttributePosition]);
export const primitiveWithNormalQuery = defineQuery([Primitive, AttributeNormal]);
export const primitiveWithTangentQuery = defineQuery([Primitive, AttributeTangent]);
export const primitiveWithColorQuery = defineQuery([Primitive, AttributeColor]);
export const primitiveWithUVQuery = defineQuery([Primitive, AttributeUV]);
export const primitiveWithUV2Query = defineQuery([Primitive, AttributeUV2]);
export const primitiveWithSkinWeightQuery = defineQuery([Primitive, AttributeSkinWeight]);
export const primitiveWithSkinIndexQuery = defineQuery([Primitive, AttributeSkinIndex]);

export const morphTargetQuery = defineQuery([MorphTarget]);

export const materialQuery = defineQuery([Material]);
export const materialWithColorTextureQuery = defineQuery([Material, ColorTexture]);
export const materialWithEmissiveTextureQuery = defineQuery([Material, EmissiveTexture]);
export const materialWithMetallicRoughnessTextureQuery = defineQuery([
  Material,
  MetallicRoughnessTexture,
]);
export const materialWithNormalTextureQuery = defineQuery([Material, NormalTexture]);
export const materialWithOcclusionTextureQuery = defineQuery([Material, OcclusionTexture]);

export const animationQuery = defineQuery([Animation]);
export const animationChannelQuery = defineQuery([AnimationChannel]);
export const animationSamplerQuery = defineQuery([AnimationSampler]);

export const sceneObjectQuery = defineQuery([SceneObject]);
export const childObjectsQuery = defineQuery([SceneObject, Child]);
export const rootObjectsQuery = defineQuery([SceneObject, Not(Child)]);
