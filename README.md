# X Bot

**!!This project is for learning about X-api, authO and firebase. Project base is created from fireship.io's tutorial.!!**
**Link: https://fireship.io/lessons/twitter-bot-oauth2-tutorial/**

## Future

Idea is to fetch data of Bitcoin value in $ and convert the value to some other currencies and post it to X.

## Features

- Automatically posts tweets

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prmika/x-bot.git
   ```
2. Navigate to the project directory:
   ```bash
   cd x-bot
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the functions directory and add your X API credentials:
   ```plaintext
   TWITTER_API_KEY=your_api_key
   TWITTER_API_SECRET_KEY=your_api_secret_key
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
   ```

## Usage

Run the bot with the following command:

```bash
firebase serve
```
