// b64chunk.js：字符表、一组三个字节编四个字符、一组四个字符解回字节（基线：一律给空）
export const TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function encodeTriple(byteA, byteB, byteC) {
  return [];
}

export function decodeQuad(text) {
  return [];
}

export function padToTriple(pending) {
  return [0, 0, 0];
}
