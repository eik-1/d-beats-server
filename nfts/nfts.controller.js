// const NFTService = require("./nfts.service.js");

// const createNFT = async (req, res) => {
//   try {
//     const { initialOwner, artistAddress, nftAddress, mintAmount, tokenURI } =
//       req.body;
//     const result = await NFTService.createNFT(
//       initialOwner,
//       artistAddress,
//       nftAddress,
//       // metadata,
//       mintAmount,
//       tokenURI
//       // name,
//       // symbol
//     );
//     res.status(201).json(result.data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getNFTsByCreator = async (req, res) => {
//   try {
//     const { address } = req.params;
//     const nftAddresses = await NFTService.getNFTsByCreator(address);
//     res.status(200).json(nftAddresses);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const listNFT = async (req, res) => {
//   try {
//     const { nftAddress, tokenId, price } = req.body;
//     const result = await NFTService.listNFT(nftAddress, tokenId, price);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const cancelNFTListing = async (req, res) => {
//   try {
//     const { nftAddress, tokenId } = req.params;
//     const result = await NFTService.cancelNFTListing(nftAddress, tokenId);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const buyNFT = async (req, res) => {
//   try {
//     const { nftAddress, tokenId, price } = req.params;
//     const result = await NFTService.buyNFT(nftAddress, tokenId, price);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getNFTPrice = async (req, res) => {
//   try {
//     const { nftAddress, tokenId } = req.params;
//     const result = await NFTService.getNFTPrice(nftAddress, tokenId);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   createNFT,
//   getNFTsByCreator,
//   listNFT,
//   cancelNFTListing,
//   buyNFT,
//   getNFTPrice,
// };
