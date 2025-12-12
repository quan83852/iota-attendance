# IOTA Attendance dApp

A decentralized attendance dApp built on the IOTA blockchain where users can create events and check-in using Move smart contracts.

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```
If you want deploy your own smart contract. Remove Move.lock in folder contract and run
```bash
# Deploy your contract
npm run iota-deploy
```
Visit http://localhost:3000 to access the Attendance app.

## 📚 Documentation

For detailed instructions, see **[INSTRUCTION_GUIDE.md](./INSTRUCTION_GUIDE.md)**

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Smart Contract](#-smart-contract)
- [Project Structure](#-project-structure)
- [Contract Logic](#-contract-logic)
- [Frontend Integration](#-frontend-integration)
- [Deployment](#-deployment)
- [Security Model](#-security-model)

---

## 🎯 Project Overview

This Attendance dApp enables users to:

- **Create Events** with name
- **Check-in** to events via their wallet
- **Track Participation** with on-chain immutable records

### Tech Stack

- **Blockchain**: IOTA
- **Smart Contract**: Move language
- **Frontend**: Next.js + React
- **UI Library**: TailwindCSS
- **Wallet Integration**: IOTA dApp Kit

---

## 📜 Smart Contract

### Contract Address
**Package ID**: `0xe7a4eb3db0d780f6ca5525b9e0bf12ba64220d05ef7cf13a8afc330b9cbf9bac` (devnet)

Your deployed contract details:

- **File**: `lib/config.ts`
- **Network**: IOTA Testnet/Mainnet

To verify your deployed contract:

```bash
# Check the config file
cat lib/config.ts
```

### Contract Module

- **Module**: `attendance::contract`
- **Location**: `contract/attendance/sources/attendance.move`

---

## 📁 Project Structure

```
attendance/
├── app/                          # Next.js application
│   ├── page.tsx                  # Main attendance page
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── sample.tsx                # Main attendance UI component
│   ├── Wallet-connect.tsx        # Wallet connection button
│   └── Provider.tsx              # IOTA provider wrapper
│
├── hooks/                        # Custom React hooks
│   └── useContract.ts            # attendance contract interactions
│
├── lib/                          # Configuration
│   └── config.ts                 # Network and package configuration
│
├── contract/                     # Move smart contracts
│   └── attendance/
│       ├── Move.toml             # Move package manifest
│       └── sources/
│           └── attendance.move  # attendance smart contract
│
├── scripts/                      # Deployment scripts
│   ├── iota-deploy-wrapper.js   # Contract deployment
│   └── iota-generate-prompt-wrapper.js
│
└── public/                       # Static assets
```

---

## 🔧 Contract Logic

### Core Data Structures

#### 1. **Attendance** Struct
Represents an event session.

```move
public struct Attendance has key {
    id: UID,
    name: vector<u8>,
    count: u64, // Number of check-ins
}

```
#### 2. **Checkin** Struct
```move
public struct Checkin has key {
    id: UID,
    user: address,
}
```
### Key Functions

#### **create_session()** - Initialize Event
```move
public entry fun create_session(name: vector<u8>, ctx: &mut TxContext)
```

#### **check_in()** - User Check-in
```move
public entry fun check_in(session: &mut Attendance, ctx: &mut TxContext)
```
#### **View Functions**
```move
public fun get_count(session: &Attendance): u64
```

## 📚 Learn More

- [IOTA Documentation](https://wiki.iota.org/)
- [IOTA dApp Kit](https://github.com/iotaledger/dapp-kit)
- [Next.js Documentation](https://nextjs.org/docs)

## 📄 License

MIT
