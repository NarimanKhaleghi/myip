// Debug script: capture all console messages and page errors during load
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on("console", (msg) => {
    const type = msg.type();
    if (type === "error" || type === "warning") {
      console.log(`[console.${type}]`, msg.text().slice(0, 1500));
    }
  });
  page.on("pageerror", (err) => {
    console.log("[pageerror]", err.message.slice(0, 2000));
    console.log("[pageerror:stack]", (err.stack || "").slice(0, 3000));
  });
  page.on("requestfailed", (req) => {
    console.log("[requestfailed]", req.url().slice(0, 200), req.failure()?.errorText);
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(3000);

  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 300));
  console.log("[body]", bodyText.replace(/\n/g, " | "));

  await browser.close();
})();
