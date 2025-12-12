# Attendance

Complete guide for deploying and customizing your IOTA dApp.

## 📍 Contract Address

**Network**: Devnet
**Package ID**: `0xe7a4eb3db0d780f6ca5525b9e0bf12ba64220d05ef7cf13a8afc330b9cbf9bac`
**Explorer**: [View on Explorer](https://explorer.devnet.iota.org/object/0xe7a4eb3db0d780f6ca5525b9e0bf12ba64220d05ef7cf13a8afc330b9cbf9bac)

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📝 Next Steps

### 1. Deploy Your Move Contract

**Option A: Automated Deployment (Recommended)**

```bash
npm run iota-deploy
```

This script will:
- ✅ Check if IOTA CLI is installed
- ✅ Set up testnet environment
- ✅ Create an account if needed
- ✅ Request gas from faucet
- ✅ Build your Move contract
- ✅ Publish the contract
- ✅ **Automatically update `lib/config.ts` with the package ID**
- ✅ **Automatically extract module name and methods from Move contract**
- ✅ **Automatically update `hooks/useContract.ts` with contract structure**

**Option B: Manual Deployment**

```bash
cd contract/<your-project-name>
iota move build
iota client publish --gas-budget 100000000 <your-project-name>
```

Then manually copy the package ID and update `lib/config.ts`:

```typescript
export const TESTNET_PACKAGE_ID = "0xYOUR_PACKAGE_ID"
```

### 2. Customize Your Contract (Auto-Updated!)

**✅ After running `npm run iota-deploy`, the following are automatically updated:**
- `CONTRACT_MODULE` - Extracted from your Move contract
- `CONTRACT_METHODS` - Extracted from your Move contract functions
- `getObjectFields()` - Auto-generated based on your Move struct
- `ContractData` interface - Auto-generated based on your Move struct

**You only need to customize:**
- **UI Component**: `components/sample.tsx` - Customize the look and feel
- **Additional Logic**: `hooks/useContract.ts` - Add any custom methods or logic

**💡 Pro Tip**: Generate an AI prompt with current contract details:
```bash
npm run generate-prompt
```
This creates a ready-to-use prompt in `prompts/` folder with your current Package ID, Module, and Methods. Just paste it to ChatGPT/Cursor/Gemini!

### 3. Customize the UI

Edit `components/sample.tsx` to match your dApp's design.

## 📁 Project Structure

```
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout with providers
│   └── page.tsx      # Main page
├── components/       # React components
│   ├── Provider.tsx  # IOTA providers wrapper
│   ├── sample.tsx    # Main dApp integration
│   └── Wallet-connect.tsx  # Wallet button
├── hooks/            # Custom hooks
│   └── useContract.ts  # Contract logic
├── lib/              # Configuration
│   └── config.ts     # Network & package IDs
└── contract/         # Move contracts
    └── <project-name>/  # Your Move contract
```

## 🔧 Advanced Configuration

### Network Configuration

Edit `lib/config.ts` to configure different networks:

```typescript
export const TESTNET_PACKAGE_ID = "0x..."
export const DEVNET_PACKAGE_ID = "0x..."
export const MAINNET_PACKAGE_ID = "0x..."
```

### Contract Integration

The main integration logic is in `hooks/useContract.ts`. This file is automatically updated when you run `npm run iota-deploy`, but you can add custom logic as needed.

### UI Customization

The main UI component is `components/sample.tsx`. Use the `generate-prompt` script to get AI assistance with customization:

```bash
npm run generate-prompt
```

Then copy the generated prompt from `prompts/` folder and paste it to your AI assistant.

## 🐛 Troubleshooting

### Contract Not Deploying

- Ensure IOTA CLI is installed: `iota --version`
- Check you have gas: `iota client gas`
- Verify network environment: `iota client active-env`

### Integration Issues

- Check `lib/config.ts` has the correct package ID
- Verify `hooks/useContract.ts` has correct module and method names
- Check browser console for detailed error messages

## 📚 Additional Resources

- [IOTA Documentation](https://wiki.iota.org/)
- [IOTA dApp Kit](https://github.com/iotaledger/dapp-kit)
- [Next.js Documentation](https://nextjs.org/docs)
- [Move Language Documentation](https://move-language.github.io/move/)

