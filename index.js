import express from "express";
import "dotenv/config";
import cors from "cors";
import routes from "./src/routes.js";
import { ethers } from "ethers";
import factoryAbi from "./src/abi/factoryAbi.json" assert { type: "json" };
import marketplaceAbi from "./src/abi/marketplaceAbi.json" assert { type: "json" };

const app = express();
app.use(cors());
app.use(express.json());
app.use("api/", routes);
app.use("/", routes);

const factoryAddress = "0x242309090561301ff7A27a1d675f2c0dA06845FD";
const marketplaceAddress = "0x4690C5d846Abb49d0b6B2a04D4aa3B16e4aFC287";

const provider = new ethers.providers.WebSocketProvider(
  `wss://arb-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_ARB_SEPOLIA_KEY}`
);

// Use ES module syntax for exporting
export const factoryContract = new ethers.Contract(
  factoryAddress,
  factoryAbi,
  provider
);

export const marketplaceContract = new ethers.Contract(
  marketplaceAddress,
  marketplaceAbi,
  provider
);

const PORT = process.env.REACT_APP_PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to D-Beat backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
