import {
  LensHub__factory,
  PublicationMainFocus,
  PublicationMetadata,
  PublicationMetadataMedia,
  PublicationMetadataVersions,
  useCreatePostTypedDataMutation,
} from "@wired-labs/lens";
import { utils } from "ethers";
import { nanoid } from "nanoid";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSigner, useSignTypedData } from "wagmi";

import { trpc } from "../../../auth/trpc";
import { ContractAddress } from "../../../lib/lens/constants";
import { useLens } from "../../../lib/lens/hooks/useLens";
import { useProfileByHandle } from "../../../lib/lens/hooks/useProfileByHandle";
import { pollUntilIndexed } from "../../../lib/lens/utils/pollUntilIndexed";
import { removeTypename } from "../../../lib/lens/utils/removeTypename";
import Button from "../../../ui/base/Button";
import FileInput from "../../../ui/base/FileInput";
import TextArea from "../../../ui/base/TextArea";
import TextField from "../../../ui/base/TextField";
import { useEditorStore } from "../../store";

function cdnModelURL(projectId: string) {
  return `https://${process.env.S3_BUCKET}.${process.env.S3_CDN_ENDPOINT}/published/${projectId}/model.glb`;
}

function cdnImageURL(projectId: string) {
  return `https://${process.env.S3_BUCKET}.${process.env.S3_CDN_ENDPOINT}/published/${projectId}/image.jpg`;
}

function cdnMetadataURL(projectId: string) {
  return `https://${process.env.S3_BUCKET}.${process.env.S3_CDN_ENDPOINT}/published/${projectId}/metadata.json`;
}

export default function PublishPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const name = useEditorStore((state) => state.name);
  const description = useEditorStore((state) => state.description);

  const { handle } = useLens();
  const profile = useProfileByHandle(handle);

  const { data: imageURL } = trpc.useQuery(["auth.project-image", { id }], {
    enabled: id !== undefined,
  });

  const { mutateAsync: createModelUploadUrl } = trpc.useMutation(
    "auth.published-model-upload"
  );

  const { mutateAsync: createImageUploadUrl } = trpc.useMutation(
    "auth.published-image-upload"
  );

  const { mutateAsync: createMetadataUploadUrl } = trpc.useMutation(
    "auth.published-metadata-upload"
  );

  const [, createPostTypedData] = useCreatePostTypedDataMutation();

  const { signTypedDataAsync } = useSignTypedData();
  const { data: signer } = useSigner();

  const [imageFile, setImageFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  async function handlePublish() {
    if (!signer) throw new Error("No signer");

    setLoading(true);

    const promises: Promise<void>[] = [];

    // Upload model to S3
    promises.push(
      new Promise((resolve, reject) => {
        async function upload() {
          const { engine } = useEditorStore.getState();
          if (!engine) throw new Error("Engine not found");

          // Export scene to glb
          const glb = await engine.export();
          const body = new Blob([glb], { type: "model/gltf-binary" });

          // Upload to S3
          const url = await createModelUploadUrl({ id });
          const response = await fetch(url, {
            method: "PUT",
            body,
            headers: {
              "Content-Type": "model/gltf-binary",
              "x-amz-acl": "public-read",
            },
          });

          if (!response.ok) reject();
          else resolve();
        }

        upload();
      })
    );

    // Upload image to S3
    promises.push(
      new Promise((resolve, reject) => {
        async function upload() {
          if (!imageURL) {
            resolve();
            return;
          }

          // Get image
          const imageResponse = await fetch(imageURL);
          const body = await imageResponse.blob();

          // Upload to S3
          const url = await createImageUploadUrl({ id });
          const response = await fetch(url, {
            method: "PUT",
            body,
            headers: {
              "Content-Type": "image/jpeg",
              "x-amz-acl": "public-read",
            },
          });

          if (!response.ok) reject();
          else resolve();
        }

        upload();
      })
    );

    // Upload metadata to S3
    promises.push(
      new Promise((resolve, reject) => {
        async function upload() {
          const modelURL = cdnModelURL(id);
          const imageURL = cdnImageURL(id);

          const media: PublicationMetadataMedia[] = [
            {
              item: modelURL,
              type: "model/gltf-binary",
              altTag: "model",
            },
          ];

          const metadata: PublicationMetadata = {
            version: PublicationMetadataVersions.two,
            metadata_id: nanoid(),
            description,
            locale: "en-US",
            tags: ["3d", "wired", "space"],
            mainContentFocus: PublicationMainFocus.Image,
            external_url: "https://thewired.space/explore",
            name,
            image: imageURL,
            imageMimeType: "image/jpeg",
            media,
            attributes: [],
          };

          // Upload to S3
          const url = await createMetadataUploadUrl({ id });
          const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(metadata),
            headers: {
              "Content-Type": "application/json",
              "x-amz-acl": "public-read",
            },
          });

          if (!response.ok) reject();
          else resolve();
        }

        upload();
      })
    );

    await Promise.all(promises);

    const contentURI = cdnMetadataURL(id);

    // Create lens publication

    const { data, error } = await createPostTypedData({
      request: {
        profileId: profile.id,
        collectModule: {
          freeCollectModule: {
            followerOnly: false,
          },
        },
        contentURI,
      },
    });

    if (error) throw new Error(error.message);
    if (!data) throw new Error("No typed data returned");

    const typedData = data.createPostTypedData.typedData;

    // Sign typed data
    const domain = removeTypename(typedData.domain);
    const types = removeTypename(typedData.types);
    const value = removeTypename(typedData.value);

    const signature = await signTypedDataAsync({
      domain,
      types,
      value,
    });

    const { v, r, s } = utils.splitSignature(signature);

    // Send transaction
    const contract = LensHub__factory.connect(ContractAddress.LensHub, signer);
    const tx = await contract.postWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      collectModule: typedData.value.collectModule,
      collectModuleInitData: typedData.value.collectModuleInitData,
      referenceModule: typedData.value.referenceModule,
      referenceModuleInitData: typedData.value.referenceModuleInitData,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });

    // Wait for transaction
    await tx.wait();

    // Wait for indexing
    await pollUntilIndexed(tx.hash);

    setLoading(false);
  }

  const image = imageFile ? URL.createObjectURL(imageFile) : imageURL;

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-1">
        <h1 className="flex justify-center text-3xl">Publish Space</h1>
        <p className="flex justify-center text-lg">Mint a new space NFT</p>
      </div>

      <div className="space-y-4">
        <TextField title="Name" outline defaultValue={name} />

        <TextArea
          autoComplete="off"
          title="Description"
          outline
          defaultValue={description}
        />

        <div className="space-y-4">
          <div className="text-lg font-bold">Image</div>

          {image && (
            <div className="relative aspect-card h-full w-full rounded-xl bg-primaryContainer">
              <Image
                src={image}
                fill
                sizes="496px"
                alt="cover picture preview"
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
          )}

          <FileInput
            title="Cover Picture"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImageFile(file);
            }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handlePublish} variant="filled" loading={loading}>
          Submit
        </Button>
      </div>
    </div>
  );
}
