// 一次性脚本：把本地 .data/appbox-feedback.json 迁移到腾讯云 COS
// 仅当 COS 对象不存在时上传，避免覆盖线上已有数据
// 不依赖 SDK，直接用 Node 内置 crypto + fetch 调用 COS REST API
// 用法：node scripts/migrate-feedback-to-cos.cjs
const fs = require("node:fs");
const path = require("node:path");
const { createHash, createHmac } = require("node:crypto");

const env = {};
for (const line of fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8").split("\n")) {
  const match = line.match(/^([A-Z_]+)\s*=\s*(.*)$/);
  if (match) env[match[1]] = match[2].trim();
}

const config = {
  SecretId: env.COS_SECRET_ID,
  SecretKey: env.COS_SECRET_KEY,
  Bucket: env.COS_BUCKET,
  Region: env.COS_REGION,
};
const objectKey = "appbox-feedback.json";
const localFile = path.join(__dirname, "../.data/appbox-feedback.json");

if (!config.SecretId || !config.SecretKey || !config.Bucket || !config.Region) {
  console.error("缺少 COS 环境变量，请先配置 .env.local");
  process.exit(1);
}

function cosFetch(method, body) {
  const host = `${config.Bucket}.cos.${config.Region}.myqcloud.com`;
  const pathName = `/${objectKey}`;
  const now = Math.floor(Date.now() / 1000);
  const keyTime = `${now - 60};${now + 600}`;
  const signKey = createHmac("sha1", config.SecretKey).update(keyTime).digest("hex");
  const httpString = `${method.toLowerCase()}\n${pathName}\n\nhost=${host}\n`;
  const stringToSign = `sha1\n${keyTime}\n${createHash("sha1").update(httpString).digest("hex")}\n`;
  const signature = createHmac("sha1", signKey).update(stringToSign).digest("hex");
  const authorization = `q-sign-algorithm=sha1&q-ak=${config.SecretId}&q-sign-time=${keyTime}&q-key-time=${keyTime}&q-header-list=host&q-url-param-list=&q-signature=${signature}`;
  return fetch(`https://${host}${pathName}`, {
    method,
    headers: {
      Host: host,
      Authorization: authorization,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body,
  });
}

async function main() {
  const head = await cosFetch("GET");
  if (head.ok) {
    console.log("COS 对象已存在，跳过迁移以避免覆盖线上数据");
    return;
  }
  if (head.status !== 404) {
    console.error("检查 COS 对象失败，HTTP", head.status);
    process.exit(1);
  }
  const body = fs.readFileSync(localFile, "utf8");
  const put = await cosFetch("PUT", body);
  if (!put.ok) {
    console.error("上传失败，HTTP", put.status);
    process.exit(1);
  }
  console.log("本地数据已迁移到 COS：", config.Bucket, "/", objectKey);
}

main();
