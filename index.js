const express = require('express')
const app = express()
const puppeteer = require('puppeteer');
const cors = require('cors')

app.use(cors())
app.use(express.static('static'))


app.get('/image', async (req, res) => {
  

  let browser;
  let screenshot = '';
  try {
    
      browser = await getBrowser({
          ignoreHTTPSErrors: true,
      });

      const page = await browser.newPage();


      page.on('console', msg => console.log('PAGE LOG:', msg.text()));
      page.on('pageerror', erro => console.log('PAGE ERROR:', erro.message));
      
      await page.goto('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA#10.9/40.7389/-73.9103');

      await page.waitFor(12000);


      screenshot = await page.screenshot();
    } catch (e) {
      console.log(e, '...error');
    } finally {
      browser && browser.disconnect();
      
      res.end(screenshot, 'binary');
      return;
  }
});


const getBrowser = (args) => puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io?token=YOUR_TOKEN', ...args });

app.listen(8080, () => console.log('Listening on PORT: 8080'));


