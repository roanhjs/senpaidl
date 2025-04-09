import e from "express";
import pdfkit from "pdfkit";
import { senpaidl } from "./main.js";
import { convertWebpToJpg } from "./lib/convertWebpToJpg.js";

const app = e();

app.get("/api", async (req, res) => {
  res.setHeader("Content-Type", "application/pdf");
  const { urlRaw } = req.query;
  const arrayLinks = await senpaidl({ urlRaw });

  const doc = new pdfkit({ size: "A4" });
  doc.pipe(res);

  for (const url of arrayLinks) {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const bufferToJpg = await convertWebpToJpg(buffer);

    doc.image(bufferToJpg, {
      fit: [500, 800],
      align: "center",
      valign: "center",
      margins: 0,
    });
    doc.addPage();
  }

  doc.end();
});

app.get("/status", (req, res) => {
  res.send("ok");
});

app.listen(3000, console.log("http://localhost:3000"));
