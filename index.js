const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
var WeaveDB = require("weavedb-sdk-node");
const axios = require("axios");
require("dotenv").config();

// Using express and cors
const app = express();
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.options("", cors(corsConfig));
app.use(cors(corsConfig));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const nftAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
    ],
    name: "BatchMetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "initialOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "artistAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_newTokenURI",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_mintAmount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "_uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

//importing the abi
const factoryAbi = require("./abi/factoryAbi.json");
const marketplaceAbi = require("./abi/marketplaceAbi.json");
const factoryAddress = "0x036E9Ba2FF01F2C6452B8fcd11c26B67534F73B4";
// const marketplaceAddress = "0x4690C5d846Abb49d0b6B2a04D4aa3B16e4aFC287";
const marketplaceAddress = "0x306F0d6247760e23A91acD6E088bE593D1D0Bf9C";
const wallet = {
  getAddressString: () => process.env.ADMIN_ADDRESS.toLowerCase(),
  getPrivateKey: () => Buffer.from(process.env.ADMIN_PRIVATE_KEY, "hex"),
};
global.owner = process.env.ADMIN_ADDRESS;

// Initialize WeaveDB
let db;
async function init() {
  db = new WeaveDB({ contractTxId: process.env.CONTRACT_TX_ID });
  await db.initializeWithoutWallet();
  db.setDefaultWallet(wallet, "evm");
}
init();

// Alchemy Providers
const wssProvider = new ethers.providers.WebSocketProvider(
  `wss://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_ARB_SEPOLIA_KEY}`
);
const provider = new ethers.providers.WebSocketProvider(
  `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_ARB_SEPOLIA_KEY}`
);

// Function to fetch the image URL and music file URL from the token URI
async function fetchImageAndMusicURLs(tokenURI, retries = 0) {
  try {
    const httpTokenURI = tokenURI.replace(
      "ipfs://",
      "https://cloudflare-ipfs.com/ipfs/"
    );
    const metadataResponse = await axios.get(httpTokenURI);
    const metadata = metadataResponse.data;
    const imageURL = `https://cloudflare-ipfs.com/ipfs/${metadata.image.replace(
      "ipfs://",
      ""
    )}`;
    const musicFileURL = `${metadata.animation_url.replace(
      "https://ipfs.io/",
      "https://cloudflare-ipfs.com/"
    )}`;
    return { imageURL, musicFileURL };
  } catch (error) {
    throw error;
  }
}

/*---------------------------ENDPOINTS--------------------------------*/
app.get("/", (req, res) => {
  res.send("Welcome to D-Beat backend!");
});

// endpoint to fetch all nfts minted
app.get("/allNfts", async (req, res) => {
  try {
    const result = await db.get("nfts");
    const formattedData = await Promise.all(
      result.map(async (item) => {
        const contract = new ethers.Contract(item.nftAddress, nftAbi, provider);
        const name = await contract.name();
        const tokenURI = await contract.tokenURI(item.tokenId);
        const owner = await contract.ownerOf(item.tokenId);

        // Fetch the image URL and music file URL from the token URI
        const { imageURL, musicFileURL } = await fetchImageAndMusicURLs(
          tokenURI
        );

        return {
          nftAddress: item.nftAddress,
          tokenId: item.tokenId,
          price: item.price,
          name: name,
          imageURL: imageURL,
          musicFileURL: musicFileURL, // Include the music file URL in the response
          owner: owner,
        };
      })
    );

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// endpoint to fetch all nfts listed on marketplace
app.get("/listed", async (req, res) => {
  try {
    const result = await db.get("listed");
    const formattedData = await Promise.all(
      result.map(async (item) => {
        const contract = new ethers.Contract(item.nftAddress, nftAbi, provider);
        const name = await contract.name();
        const tokenURI = await contract.tokenURI(item.tokenId);
        const owner = await contract.ownerOf(item.tokenId);

        // Fetch the image URL and music file URL from the token URI
        const { imageURL, musicFileURL } = await fetchImageAndMusicURLs(
          tokenURI
        );

        return {
          nftAddress: item.nftAddress,
          tokenId: item.tokenId,
          price: item.price,
          name: name,
          imageURL: imageURL,
          musicFileURL: musicFileURL, // Include the music file URL in the response
          owner: owner,
        };
      })
    );

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// endpoint to fetch all nfts cancelled
app.get("/cancelled", async (req, res) => {
  const result = await db.get("cancelled");
  res.status(200).json(result);
});

// endpoint to fetch all nfts bought
app.get("/bought", async (req, res) => {
  const result = await db.get("bought");
  res.status(200).json(result);
});

//factory listener
async function factoryListener() {
  const Fcontract = new ethers.Contract(
    factoryAddress,
    factoryAbi,
    wssProvider
  );

  Fcontract.on(
    "NewNFT",
    async (
      nftAddress,
      _initialOwner,
      _artistAddress,
      _newTokenURI,
      _mintAmount,
      name,
      symbol,
      event
    ) => {
      let Data = {
        nftAddress: nftAddress,
        initialOwner: _initialOwner,
        artistAddress: _artistAddress,
        newTokenURI: _newTokenURI,
        mintAmount: parseInt(_mintAmount),
        name: name,
        symbol: symbol,
        // data: event,
      };
      console.log(JSON.stringify(Data, null, 8));
      try {
        const tx = await db.add(Data, "nfts");
        console.log("tx", tx);
        const result = await db.get("nfts");
        console.log("result", result);
      } catch (error) {
        console.log("error", error);
      }
    }
  );
}

factoryListener();

//marketplace listener
async function marketplaceListener() {
  const Mcontract = new ethers.Contract(
    marketplaceAddress,
    marketplaceAbi,
    wssProvider
  );
  //Listen to items listed event
  Mcontract.on("ItemListed", async (nftAddress, tokenId, price, event) => {
    let Data = {
      nftAddress: nftAddress,
      tokenId: parseInt(tokenId),
      price: parseInt(price),
      //  data: event,
    };
    // we need to store this info in the database when to event is triggered
    console.log(JSON.stringify(Data, null, 8));
    try {
      const tx = await db.add(Data, "listed");
      console.log("tx", tx);
      const result = await db.get("listed");
      console.log("result", result);
    } catch (error) {
      console.log("error", error);
    }
  });

  //Listen to items canceled event
  Mcontract.on("ItemCanceled", async (nftAddress, tokenId, event) => {
    let Data = {
      nftAddress: nftAddress,
      tokenId: parseInt(tokenId),
      //  data: event,
    };
    // we need to store this info in the database when to event is triggered
    console.log(JSON.stringify(Data, null, 8));
    try {
      const tx = await db.add(Data, "cancelled");
      console.log("tx", tx);
      const result = await db.get("cancelled");
      console.log("result", result);
    } catch (error) {
      console.log("error", error);
    }
  });

  //Listen to items bought event
  Mcontract.on(
    "ItemBought",
    async (nftAddress, tokenId, buyer, price, event) => {
      let Data = {
        nftAddress: nftAddress,
        tokenId: parseInt(tokenId),
        buyer: buyer,
        price: parseInt(price),
        //  data: event,
      };
      // we need to store this info in the database when to event is triggered
      console.log(JSON.stringify(Data, null, 8));
      try {
        const tx = await db.add(Data, "bought");
        console.log("tx", tx);
        const result = await db.get("bought");
        console.log("result", result);
      } catch (error) {
        console.log("error", error);
      }
    }
  );
}

marketplaceListener();

// const factoryContract = new ethers.Contract(
//   factoryAddress,
//   factoryAbi,
//   provider
// );

// const marketplaceContract = new ethers.Contract(
//   marketplaceAddress,
//   marketplaceAbi,
//   provider
// );

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
