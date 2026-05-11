const puppeteer = require("puppeteer");

/**
 * @description Scrape public LinkedIn profile data.
 * NOTE: LinkedIn has strong anti-scraping. This is a basic implementation 
 * for demonstration/public profiles.
 */
async function scrapeLinkedInProfile(req, res) {
  const { url } = req.body;

  if (!url || !url.includes("linkedin.com/in/")) {
    return res.status(400).json({ message: "Valid LinkedIn Profile URL is required." });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");
    
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract text from the page
    const profileText = await page.evaluate(() => {
      // Remove scripts and styles
      const scripts = document.querySelectorAll('script, style');
      scripts.forEach(s => s.remove());
      return document.body.innerText;
    });

    res.status(200).json({
      message: "Profile data fetched successfully.",
      profileText: profileText.substring(0, 10000), // Limit size
    });

  } catch (error) {
    console.error("LinkedIn Scrape Error:", error);
    res.status(500).json({ message: "Failed to scrape profile. The profile might be private or restricted." });
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = {
  scrapeLinkedInProfile,
};
