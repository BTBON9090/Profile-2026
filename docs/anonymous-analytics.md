# 匿名计数与留言存储

统计仅保存上海时区的日期、固定页面路径或产品 ID，以及累计次数。它不生成访客 ID，不写 cookie / localStorage，不保存 IP、User-Agent、来源页面、搜索词或查询参数。基础设施自身的访问日志需在部署平台另行确认和配置。

## 统计口径

- `page_view`：白名单页面的打开次数；刷新、重新进入会再次计数。不是独立人数。
- `download`：安装包或 Skill 下载链接的点击次数。不能证明下载完成、安装或实际使用。
- `product_open`：在线工具页面加载、合成史莱姆打开，或外部产品入口点击。不是用户数，也不是完成使用任务数。
- Aura、LaunchPad、驾驶游戏等安装后的离线使用无法由网站得知；Skill 安装后的调用亦无法得知。当前没有在这些产品里增加遥测。

## 存储

开发环境默认写入忽略提交的 `.data/anonymous-analytics.json`。生产环境需要设置服务端环境变量：

```
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-write-token
ANALYTICS_READ_TOKEN=your-private-random-read-token
```

使用 Redis HINCRBY 原子累加，每日键保留 400 天。未配置生产存储时 `/api/analytics` 返回 503，不会把临时文件当成持久数据。没有创建第三方账号或数据库，也没有部署这些配置。

读取最近 7 天：`GET /api/analytics?days=7`（最多 31 天）。生产需 `Authorization: Bearer <ANALYTICS_READ_TOKEN>`，开发环境可直接读取。请勿把任何 Token 放在 `NEXT_PUBLIC_` 环境变量或前端代码中。

客户端白名单和无标识设计限制了统计精度；它不去重访客，不做跨设备识别，也无法彻底排除机器人或恶意刷量。

Redis REST 请求格式依据 [Upstash 官方文档](https://upstash.com/docs/redis/features/restapi)。

## 留言的实际能力

留言区调用 `/api/feedback`，支持留言、回复、点赞和本人撤回。配置 `COS_SECRET_ID`、`COS_SECRET_KEY`、`COS_BUCKET`、`COS_REGION` 后，数据保存在腾讯云 COS 的 `appbox-feedback.json` 对象；否则回退到 `.data/appbox-feedback.json`。

本地开发配置是否存在不能证明线上配置已经完成。生产部署需使用持久存储；临时磁盘在重新部署时可能丢失。现有 COS 整文件更新只有进程内写队列，多实例同时写入仍可能覆盖，需要在扩大并发前迁移至事务数据库。

留言的昵称、文本、日期属于用户主动提交的内容。随机撤回凭证保存在浏览器本地，用于本人操作，不作为匿名统计标识；API 不再公开该凭证。昵称与内容本身是公开的，请勿填写敏感资料。
