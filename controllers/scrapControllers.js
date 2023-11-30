const puppeteer = require('puppeteer');
const fs = require('fs');

const scrapeProductInformation = async (req, res) => {
  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage();

  try {
    // Navigate to the first page of the provided webpage
    await page.goto('https://books.toscrape.com/catalogue/category/books/young-adult_21/index.html');

    let products = [];

    // Function to extract product information from the current page
    const scrapeCurrentPage = async () => {
      return page.evaluate(() => {
        const productsOnPage = [];

        // Iterate through each product on the page
        document.querySelectorAll('li.col-xs-6').forEach((productElement) => {
          const product = {};

          // Extract product information
          product.name = productElement.querySelector('h3 a').textContent.trim();
          product.description = productElement.querySelector('p').textContent.trim();
          product.price = productElement.querySelector('div p.price_color').textContent.trim();
          product.imageURL = productElement.querySelector('img').src.trim();

          // Add the product to the array
          productsOnPage.push(product);
        });

        return productsOnPage;
      });
    };

    // Function to navigate to the next page
    const goToNextPage = async () => {
      const nextPageButton = await page.$('li.next a');
      if (nextPageButton) {
        await nextPageButton.click();
        await page.waitForNavigation(); // Wait for the page to fully load
        await scrapeAndNavigate(); // Continue scraping the next page
      }
    };

    // Recursive function to scrape and navigate through pages
    const scrapeAndNavigate = async () => {
      const productsOnPage = await scrapeCurrentPage();
      products = products.concat(productsOnPage);

      await goToNextPage(); // Try to navigate to the next page
    };

    // Start scraping from the first page
    await scrapeAndNavigate();

    // Close the browser
    await browser.close();

    // Store the extracted information in a JSON file
    fs.writeFileSync('product_information.json', JSON.stringify(products, null, 2));
    console.log('Scraping completed. Product information has been stored in product_information.json');
    // sending json response with products length along with products
    res.status(200).json({length:products.length, success: true, data: products });
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = scrapeProductInformation;
