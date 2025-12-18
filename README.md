# Base Pulse (Built for Base)

Deployed on Base Mainnet.

Base Pulse is a browser-first Base utility that connects through Coinbase Wallet SDK and performs read-only “network pulse” checks on Base Mainnet and Base Sepolia. It is designed to validate tooling compatibility for Base account abstraction–oriented environments while remaining non-destructive by default.

---

## Base ecosystem alignment

Built for Base.

Supported networks:
- Base Mainnet  
  chainId (decimal): 8453  
  Explorer: https://basescan.org  

- Base Sepolia  
  chainId (decimal): 84532  
  Explorer: https://sepolia.basescan.org  

This project explicitly targets Base networks by chainId and uses Base RPC endpoints to fetch onchain state.

---

## What the script does

The app.base-pulse.ts script provides a small in-browser UI that:

1) Connects a wallet using Coinbase Wallet SDK (EIP-1193 provider)
2) Reads and prints the wallet chainId and connected address
3) Runs read-only Base RPC checks via viem:
   - latest block number
   - ETH balance of the connected address
4) Generates a “Pulse Snapshot”:
   - latest block timestamp and number
   - fee estimates (estimateFeesPerGas)
5) Allows checking ETH balance for a custom address
6) Prints Basescan links for quick verification

No transactions are sent. All operations are read-only.

---

## Repository structure

- app.base-pulse.ts  
  Browser-based script that connects to a wallet, toggles Base networks, and provides read-only “pulse” checks.

- contracts/  
  Solidity contracts deployed to Base Sepolia for testnet validation:
  - mapping.sol — minimal contract used to validate deployment and verification flow  
  - structs.sol — lightweight contract used for read-only query validation  

- package.json  
  Dependency manifest including Coinbase SDKs and 2–6 repositories from the Base GitHub organization.

- README.md  
  Technical documentation, Base references, licensing, and testnet deployment records.

---

## Libraries used

- @coinbase/wallet-sdk  
  Wallet connection layer used to obtain an EIP-1193 provider compatible with Coinbase and Base tooling.

- viem  
  RPC client used for Base reads (getBalance, getBlockNumber, getBlock, estimateFeesPerGas).

- Base GitHub repositories  
  Included as dependencies to document linkage to the Base open-source ecosystem and related tooling.

---

## Installation and execution

Install dependencies using Node.js.  
Serve the project with a modern frontend dev server and open the page in a browser.

Expected result:
- Connected address printed with Basescan link
- Active chainId printed (8453 or 84532)
- Read-only state fetched from Base RPC (block, balance)
- Pulse Snapshot printed (block timestamp + fee estimates)

---

## License

MIT License

Copyright (c) 2025 YOUR_NAME

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Author

GitHub: https://github.com/09-jigsaw
Email: 09_jigsaw_sparks@icloud.com 
Public contact: https://x.com/AmandaJohn31872

---

## Testnet Deployment (Base Sepolia)

As part of pre-production validation, one or more contracts may be deployed to the Base Sepolia test network to confirm correct behavior and tooling compatibility.

Network: Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

Contract #1 address:  
0x061C69d31beAAE953D7499eAD6DfdAa5611a1E7A

Deployment and verification:
- https://sepolia.basescan.org/address/0x061C69d31beAAE953D7499eAD6DfdAa5611a1E7A
- https://sepolia.basescan.org/0x061C69d31beAAE953D7499eAD6DfdAa5611a1E7A/0#code  

Contract #2 address:  
0x8926eD59299C88F93842FC9e1B177e37155F96F2

Deployment and verification:
- https://sepolia.basescan.org/address/0x8926eD59299C88F93842FC9e1B177e37155F96F2
- https://sepolia.basescan.org/0x8926eD59299C88F93842FC9e1B177e37155F96F2/0#code  

These testnet deployments provide a controlled environment for validating Base tooling, account abstraction flows, and read-only onchain interactions prior to Base Mainnet usage. 
