import React from "react";
import { ethers } from "ethers";
import * as IPFS from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { Configuration } from "../configuration";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NFTFormValues } from "../types";
import { CurrencyService, MarketService } from "../services";
import { CapsuleService } from "../services/capsule.service";

export default function Create() {
  const ipfsClient = IPFS.create(Configuration.getIpfsClientOptions());
  const router = useRouter();

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<string | undefined> => {
    const { files } = e.target;

    if (!files || files.length === 0) {
      return;
    }

    const [first] = files;

    if (first.type.match(/image\/*/) === null) {
      return;
    }

    try {
      const CID = await ipfsClient.add(first, {
        progress: (prog) =>
          console.log(`Received progress for file upload: ${prog}`),
      });
      const url = Configuration.getIpfsFileUrl(CID.path);
      console.log("File updloaded to IPFS", url);
      return url;
    } catch (error) {
      console.log("ERROR uploading file to IPFS", { error });
    }
  };

  const createAndPublishItem = async (values: NFTFormValues) => {
    try {
      const data = JSON.stringify(values);
      const added = await ipfsClient.add(data);
      const url = Configuration.getIpfsFileUrl(added.path);
      const price = CurrencyService.fromEtherToWei(values.price);
      await publishItem(url, price);
    } catch (error) {
      console.log(`ERROR creating item`, { values, error });
    }
  };

  const publishItem = async (url: string, price: ethers.BigNumber) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const capsuleService = new CapsuleService(signer);
    const marketService = new MarketService(signer);

    let tokenId: number;
    try {
      tokenId = await capsuleService.createCapsule(url);
    } catch (error) {
      console.log("ERROR creating capsule for sale", { error, url });
    }

    try {
     await marketService.createMarketItem(tokenId, price);
    } catch (error) {
      console.log("ERROR creating item in the market", { tokenId, error });
    }

    router.push("/");
  };

  const formik = useFormik({
    initialValues: {
      name: undefined,
      description: undefined,
      image: undefined,
      price: undefined,
      attributes: [],
    },
    validationSchema: Yup.object().shape({
      image: Yup.string().required(),
      name: Yup.string().required().min(3),
      description: Yup.string().required().min(3),
      attributes: Yup.array().required(),
    }),
    onSubmit: createAndPublishItem,
  });

  return (
    <div className="flex justify-center">
      <form
        onSubmit={formik.handleSubmit}
        className="w-1/2 flex flex-col pb-12"
      >
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Asset name"
          className="mt-8 border rounded p-4"
          onChange={formik.handleChange}
        />

        <textarea
          id="description"
          name="description"
          placeholder="Asset description"
          className="mt-2 border rounded p-4"
          onChange={formik.handleChange}
        />

        <input
          id="price"
          name="price"
          type="number"
          placeholder="Asset price in ETH"
          className="mt-2 border rounded p-4"
          onChange={formik.handleChange}
        />

        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          multiple={false}
          className="my-4"
          onChange={async (e) => {
            const url = await handleFileUpload(e);
            formik.setFieldValue("image", url);
          }}
        />

        {formik.values.image && (
          <img src={formik.values.image} width="350" className="rounded mt-4" />
        )}

        <button
          type="submit"
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
          disabled={!formik.isValid}
        >
          Create Capsule
        </button>
      </form>
    </div>
  );
}
