import puppeteer from "puppeteer-core";
const chromium = require("@sparticuz/chromium");
module.exports = async (req, res) => {
  if (process.env.demo == "yes") return res.status(403).send("The public instance of this API is currently disabled. You can deploy your own instance for free on Vercel here: https://s.vercel.app/deploy.");
  if (!req.query.url) return res.status(400).send("No url query specified.");
  if (!checkUrl(req.query.url)) return res.status(400).send("Invalid url query specified.");
  try {
    const browser = await puppeteer.launch({
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      defaultViewport: chromium.defaultViewport,
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    });
    const page = await browser.newPage();

    await page.goto("https://developers.google.com/web/");

   const file = await page.screenshot({
      path: "/tmp/screenshot.jpg",
      fullPage: true,
    });
    await browser.close();
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, immutable, no-transform, s-maxage=86400, max-age=86400");
    res.status(200).end(file);
  } catch (error) {
    console.error(error);
    res.status(500).send("The server encountered an error. You may have inputted an invalid query.");
  }
};

function checkUrl(string, hostname) {
  var url = "";
  try {
    url = new URL(string);
  } catch (error) {
    return false;
  }
  return true;
}
