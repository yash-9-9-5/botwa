# BotWA - JavaScript Version

This is the JavaScript compiled version of the BotWA project. It contains the compiled JavaScript files ready for execution without TypeScript compilation.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on the example below:
```
OWNER=your_number
isSelf=false
```

3. Run the bot:
```bash
npm start
```

## Configuration

- `OWNER`: WhatsApp number of the bot owner (without country code)
- `isSelf`: If set to true, the bot will only respond to the owner

## Note

This version was generated from the TypeScript source. For development, please refer to the main branch with TypeScript source files.