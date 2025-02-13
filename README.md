# Threat Intelligence Discord Webhook Worker

A versatile RSS to Discord notification system that can be deployed on various platforms to monitor and forward threat intelligence feeds to Discord channels. This project works in many environments—from serverless to traditional servers—making it perfect for company or personal use.

## Features

- Fetches RSS feeds from defined endpoints.
- Filters items based on a configurable time threshold.
- Posts new items to a specified Discord webhook.
- Avoids duplicate posts by caching processed URLs.
- Runs on serverless platforms, traditional servers, containerized environments, and more.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/) for Cloudflare Workers

## Deployment Options

### 1. Cloudflare Workers
- Serverless deployment with built-in scheduling.
- Free tier includes 100,000 requests per day.
- Setup using Wrangler CLI:
```sh
wrangler deploy
```

### 2. Node.js Server
- Run on any VPS or local machine.
- Install dependencies: `npm install node-cron node-fetch xml2js`
- Use PM2 for process management:
```sh
npm install pm2 -g
pm2 start index.js
```

### 3. Docker Container
- Containerize the application for portability.
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]
```
```sh
docker build -t threat-intel-bot .
docker run -d threat-intel-bot
```

### 4. AWS Lambda
- Run serverless on AWS.
- Use EventBridge (formerly CloudWatch Events) for scheduling.
- Configure with AWS SAM or Serverless Framework.

### 5. Additional Options
- **Google Cloud Functions:** Deploy with Cloud Scheduler.
- **Microsoft Azure Functions:** Use Timer Triggers for scheduling.
- **DigitalOcean App Platform:** Containerize or deploy using their native node support.

## Setup Instructions

1. **Clone the Repository**

   ```sh
   git clone https://github.com/F47E/Threat-Intelligence-Discord-Webhook-Worker.git
   cd Threat-Intelligence-Discord-Webhook-Worker
   ```

2. **Configuration**
   - Copy `.env.example` to `.env`
   - Add your Discord webhook URL.
   - Configure RSS feed URLs in `config.js` (if applicable).

3. **Installation**
   ```sh
   npm install
   ```

4. **Running Locally**
   ```sh
   npm run dev
   ```

5. **Environment Variables**
   ```
   DISCORD_WEBHOOK_URL=your_webhook_url
   THRESHOLD_MINUTES=30
   ```

## Included RSS Feeds

- **US-CERT Alerts:** [https://www.cisa.gov/uscert/ncas/alerts.xml](https://www.cisa.gov/uscert/ncas/alerts.xml)
- **Threatpost:** [https://threatpost.com/feed/](https://threatpost.com/feed/)
- **SecurityWeek:** [https://www.securityweek.com/rss](https://www.securityweek.com/rss)

## KV Storage Options

- Cloudflare KV (for Workers)
- Redis
- SQLite
- Local file storage
- MongoDB

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License