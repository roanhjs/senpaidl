import { chromium } from "playwright";

export async function senpaidl({ urlRaw }) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.route("**/*", (route) => {
    const url = route.request().url();
    const bloqueables = [
      "ads",
      "doubleclick",
      "googlesyndication",
      "tracking",
      "analytics",
    ];

    // Excluir dominios o rutas específicas que no quieres bloquear
    const dominiosPermitidos = [
      // "disquscdn.com", // Aquí puedes añadir cualquier otro dominio que no quieras bloquear
      "m440.in",
    ];

    // Verificar si la URL contiene palabras bloqueables y no está en los dominios permitidos
    if (
      bloqueables.some((p) => url.includes(p)) &&
      !dominiosPermitidos.some((dominio) => url.includes(dominio))
    ) {
      // console.log("🛑 Bloqueado:", url);
      return route.abort();
    }

    route.continue();
  });

  // 🟢 Luego: cargar la página
  await page.goto(urlRaw, {
    timeout: 60000,
    waitUntil: "domcontentloaded",
  });

  // Esperar a que aparezca el botón de modo ALL
  await page.waitForSelector("a#modeALL");
  const modeAll = await page.$("a#modeALL");
  await modeAll.click();

  // Esperar que se cargue el div con las imágenes
  await page.waitForSelector("div#all");
  const allDiv = await page.$("div#all");

  // Obtenemos todas las imágenes dentro de ese div
  const imgHandles = await allDiv.$$("img");

  let imgs = [];
  // Recorremos cada <img> y obtenemos su URL
  for (const img of imgHandles) {
    const src =
      (await img.getAttribute("data-src")) || (await img.getAttribute("src"));
    // console.log("🖼️ Imagen encontrada:", src);
    imgs.push(src);
  }

  await browser.close();
  return imgs;
}
