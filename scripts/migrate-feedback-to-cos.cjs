// 一次性脚本：把本地 .data/appbox-feedback.json 迁移到腾讯云 COS
// 仅当 COS 对象不存在时上传，避免覆盖线上已有数据
// 用法：node scripts/migrate-feedback-to-cos.cjs
const fs = require("node:fs");
const path = require("node:path");
const COS = require("cos-nodejs-sdk-v5");

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
const Key = "appbox-feedback.json";
const localFile = path.join(__dirname, "../.data/appbox-feedback.json");

if (!config.SecretId || !config.SecretKey || !config.Bucket || !config.Region) {
  console.error("缺少 COS 环境变量，请先配置 .env.local");
  process.exit(1);
}

const cos = new COS(config);

cos.headObject({ Bucket: config.Bucket, Region: config.Region, Key }, (err) => {
  if (!err) {
    console.log("COS 对象已存在，跳过迁移以避免覆盖线上数据");
    return;
  }
  if (err.statusCode !== 404 && err.code !== "NoSuchKey") {
    console.error("检查 COS 对象失败", err);
    process.exit(1);
  }
  const body = fs.readFileSync(localFile, "utf8");
  cos.putObject({ Bucket: config.Bucket, Region: config.Region, Key, Body: body }, (uploadError) => {
    if (uploadError) {
      console.error("上传失败", uploadError);
      process.exit(1);
    }
    console.log("本地数据已迁移到 COS：", config.Bucket, "/", Key);
  });
});
