const Scraper = require("../scraper");
const Cleaner = require("../cleaner");
const htmlFileScraper = new Scraper("../markdown/yangshun/html.md");
const cssFileScraper = new Scraper("../markdown/yangshun/css.md");
const jsFileScraper = new Scraper("../markdown/yangshun/javascript.md");

scrapeYangshun(htmlFileScraper, "./yangshunData/yangshunHtml.json");

function scrapeYangshun(scraper, fileName) {
  // console.log(scraper.showMarkdown);
  // console.log(scraper.showHtml);
  let count = 0;
  const document = scraper.createDOM();
  const bodyChildren = [...document.body.children];
  const questions = [];
  let start = false;
  let question = {
    type: "LONG",
  };
  let explanation = [];
  bodyChildren.forEach((node, ind) => {
    if (node.nodeName === "H3") {
      start = true;
      question["statement"] = Cleaner.html2Markdown(node);
    } else if (node.nodeName === "H6") {
      const expCont = document.createElement("div");
      expCont.append(...explanation);
      question["explanation"] = Cleaner.html2Markdown(expCont);
      questions.push(question);
      count++;
      start = false;
      question = { type: "LONG" };
      explanation = [];
    } else if (start) {
      explanation.push(node);
    }
  });
  Cleaner.saveFile(fileName, JSON.stringify({ questions }));
  console.log("Question scraped: ", count);
}