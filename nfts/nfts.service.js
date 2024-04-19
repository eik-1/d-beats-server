// class NFTService {
//   async createNFT(
//     initialOwner,
//     artistAddress,
//     nftAddress,
//     mintAmount,
//     tokenURI
//   ) {
//     try {
//       const tx = await factoryContract.createNFT(
//         initialOwner,
//         artistAddress,
//         nftAddress,
//         mintAmount,
//         tokenURI
//       );
//       await tx.wait();
//       return { message: "NFT created successfully", data: tx };
//     } catch (error) {
//       throw new Error(`Error creating NFT: ${error.message}`);
//     }
//   }

//   async getNFTsByCreator(address) {
//     try {
//       const nftAddresses = await factoryContract.getNFTsByCreator(address);
//       return nftAddresses;
//     } catch (error) {
//       throw new Error(`Error getting NFTs by creator: ${error.message}`);
//     }
//   }

//   async listNFT(nftAddress, tokenId, price) {
//     try {
//       const tx = await marketplaceContract.listItem(
//         nftAddress,
//         tokenId,
//         price,
//         {
//           value: price,
//         }
//       );
//       await tx.wait();
//       return { message: "NFT listed successfully" };
//     } catch (error) {
//       throw new Error(`Error listing NFT: ${error.message}`);
//     }
//   }

//   async cancelNFTListing(nftAddress, tokenId) {
//     try {
//       const tx = await marketplaceContract.cancelListing(nftAddress, tokenId);
//       await tx.wait();
//       return { message: "NFT listing canceled successfully" };
//     } catch (error) {
//       throw new Error(`Error canceling NFT listing: ${error.message}`);
//     }
//   }

//   async buyNFT(nftAddress, tokenId, price) {
//     try {
//       const tx = await marketplaceContract.buyItem(nftAddress, tokenId, {
//         value: price,
//       });
//       await tx.wait();
//       return { message: "NFT purchased successfully" };
//     } catch (error) {
//       throw new Error(`Error buying NFT: ${error.message}`);
//     }
//   }

//   async getNFTPrice(nftAddress, tokenId) {
//     try {
//       const price = await marketplaceContract.getPrice(nftAddress, tokenId);
//       return { price };
//     } catch (error) {
//       throw new Error(`Error getting NFT price: ${error.message}`);
//     }
//   }
// }

// module.exports = new NFTService();
