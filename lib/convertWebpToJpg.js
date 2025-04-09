import sharp from "sharp";

export async function convertWebpToJpg(buffer) {
  const convertWebpToJpg = sharp(buffer).toFormat("jpeg");
  const toBuffer = await convertWebpToJpg.toBuffer();
  return toBuffer;
}
