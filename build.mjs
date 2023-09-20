import fs from "fs";
import { minify } from "minify";
import { Packer } from "roadroller";
import { zip, COMPRESSION_LEVEL } from "zip-a-folder";

(async () => {
  console.log("Remove previous entry files...");
  fs.rmSync("./entry", { recursive: true, force: true });
  fs.rmSync("./entry.xdc", { force: true });

  console.log("Get project files content...");

  let indexHTML = fs.readFileSync("./index.html", "utf8");

  let styleCSS = fs.readFileSync("./style.css", "utf8");

  let indexJS = fs
    .readFileSync("./index.js", "utf8")
    .replaceAll("const ", "let ")
    .replaceAll("undefined", "void 0");

  console.log("Minify JS...");
  const minifiedJS = await minify.js(indexJS);

  console.log("Minify CSS...");
  const minifiedCSS = await minify.css(styleCSS);

  console.log("Minify HTML...");

  const toBase64Url = (fileName) =>
    `data:image/png;base64,${fs.readFileSync(fileName, {
      encoding: "base64",
    })}`;

  indexHTML = indexHTML
    .replace(
      '<script src="./index.js"></script>',
      `<script>${minifiedJS}</script>`
    )
    .replace(
      '<link href="./style.css" rel="stylesheet" />',
      `<style>${minifiedCSS}</style>`
    )
    .replace("./favicon.png", toBase64Url("./favicon.png"))
    .replaceAll("ground.png", toBase64Url("./ground.png"))
    .replaceAll("front.svg", "f.svg")
    .replaceAll("back.svg", "b.svg")
    .replaceAll("sprites.png", toBase64Url("./sprites.png"))
    .replaceAll("tower.png", toBase64Url("./tower.png"))

    .replaceAll("tower-container", "t-c")
    .replaceAll("destroying-floor", "d-f")
    .replaceAll("tower-floor", "t-f")
    .replaceAll("floor-value", "f-v")

    .replaceAll("--scrollX", "--sx")
    .replaceAll("--initialX", "--ix")
    .replaceAll("--initialY", "--iy")
    .replaceAll("--from", "--f")
    .replaceAll("--to", "--t")
    .replaceAll("--rotate", "--r")
    .replaceAll("--scale", "--s")
    .replaceAll("--shadow", "--sh");

  const ids = [...indexHTML.matchAll(/id="([^"]*?)"/g)];

  ids.forEach((id, i) => {
    if (id.length > 5) {
      indexHTML = indexHTML.replaceAll(id[1], "_" + i);
    }
  });

  const minifiedHTML = await minify.html(indexHTML);

  console.log("Pack project...");
  const inputToPack = [
    {
      data: minifiedHTML,
      type: "text",
      action: "write",
    },
  ];

  const packer = new Packer(inputToPack);
  await packer.optimize();

  const packedCode = packer.makeDecoder();

  console.log("Write Webxdc files...");

  fs.mkdirSync("./entry");
  fs.cpSync("./front.svg", "./entry/f.svg");
  fs.cpSync("./back.svg", "./entry/b.svg");

  fs.writeFileSync(
    "./entry/index.html",
    `<script>${packedCode.firstLine + packedCode.secondLine}</script>`,
    { encoding: "utf8" }
  );

  console.log("Zip entry folder...");
  await zip("./entry", "./entry.xdc", { compression: COMPRESSION_LEVEL.high });

  console.log("Get entry size...");
  const { size } = fs.statSync("./entry.xdc");

  console.log("Entry size: " + size + " bytes");

  const WEBXDC_LIMIT_SIZE = 655360;

  if (size > WEBXDC_LIMIT_SIZE) {
    console.error("❌ File is " + (size - WEBXDC_LIMIT_SIZE) + "bytes too big!");
  } else {
    const percent = Math.round(((size * 100) / WEBXDC_LIMIT_SIZE) * 100) / 100;
    console.log("✅ All good! (" + percent + "% of total budget)");
  }

  console.log("");
  console.log("Webxdc generated");
})();
