# LocalDoc Safe

这是根据《本地隐私文档处理网页产品 PRD v1.2》重新整理的产品原型。

## 当前部署

- 根入口 `index.html` 已切到新的 PRD 原型。
- 新版原型位于 `prd-prototype/index.html`。
- 当前版本用于测试产品定位、上传入口、登录拦截、免费额度、付费弹层、定价页与隐私说明。
- 当前演示不会上传文件，也不会保存用户文件。
- 真实 PDF / Word / PPT 转换能力尚未接入，下载结果为演示文本。

## 为什么先这样部署

GitHub Pages 适合现在快速测试：成本低、更新快、容易分享链接。它不适合直接承载未来收费系统，因为账号、支付、订单回调和权益校验都需要可信后端。

未来收费建议采用：

- 前端：GitHub Pages、Cloudflare Pages 或 Vercel。
- 登录：Supabase Auth、Firebase Auth 或 Clerk。
- 支付：Stripe / Paddle，国内可评估微信或支付宝服务商。
- 权益后端：Supabase Edge Functions、Cloudflare Workers 或 Vercel Functions。
- 埋点：PostHog、Plausible 或自建轻量事件表。

## MVP 开发顺序

1. 产品框架、工具页模板、隐私说明、定价页。
2. PDF 合并、拆分、删除、重排、图片转 PDF。
3. 登录、免费额度、单次付费、月会员权益。
4. PDF 加水印、压缩。
5. PDF 转 Word、永久涂黑等高价值但高风险能力。

涂黑能力上线前必须做安全验收：导出文件中敏感内容不能通过复制、搜索、对象提取或图层恢复。
