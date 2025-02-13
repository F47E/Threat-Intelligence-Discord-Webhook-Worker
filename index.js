// index.js

const RSS_FEEDS = [
    'https://www.cisa.gov/uscert/ncas/alerts.xml',
    'https://threatpost.com/feed/',
    'https://www.securityweek.com/rss'
];
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/your_webhook_id/your_webhook_token';
const THRESHOLD_MINUTES = 30; // Only posts items from the last 30 minutes

addEventListener('scheduled', event => {
    event.waitUntil(handleScheduled());
});

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleScheduled() {
    try {
        for (const feed of RSS_FEEDS) {
            const rssResponse = await fetch(feed);
            const xmlText = await rssResponse.text();
            const items = parseRSS(xmlText);
            
            const now = Date.now();
            const threshold = THRESHOLD_MINUTES * 60 * 1000;

            for (const item of items) {
                const pubTime = new Date(item.pubDate).getTime();
                if (now - pubTime < threshold) {
                    // Check if URL was already processed
                    const processed = await PROCESSED_URLS.get(item.link);
                    if (!processed) {
                        await sendDiscordMessage(item);
                        // Store URL with expiration of 30 days
                        await PROCESSED_URLS.put(item.link, 'true', { expirationTtl: 2592000 });
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error in scheduled task:', err);
    }
}

function parseRSS(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const items = [];
    const itemNodes = xmlDoc.querySelectorAll("item");

    itemNodes.forEach(itemNode => {
        items.push({
            title: itemNode.querySelector("title")?.textContent || '',
            link: itemNode.querySelector("link")?.textContent || '',
            pubDate: itemNode.querySelector("pubDate")?.textContent || '',
            description: itemNode.querySelector("description")?.textContent || ''
        });
    });

    return items;
}

async function sendDiscordMessage(item) {
    const payload = {
        username: "Threat Intelligence Bot",
        embeds: [{
            title: item.title,
            url: item.link,
            description: item.description,
            timestamp: new Date(item.pubDate).toISOString()
        }]
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        console.error("Failed to send message to Discord:", await response.text());
    }
}

async function handleRequest(request) {
    return new Response('Threat Intelligence Worker is active.', { status: 200 });
}