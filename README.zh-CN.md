# Zombie Love Story MCP

提供确定性、只读的 MCP 工具和 OpenClaw Skill，用于规划温和、原创的僵尸重逢故事：整理视觉创意、安排五段分镜、检查肖像授权与提示词风险，并查找 Zombie Love 公开资料。

本项目仅处理文字，不会读取或上传照片、生成或提交视频、调用 AI 服务商、连接账户或付款，也不会访问媒体历史。对应的本地项目是视觉原型；页面上展示的价格和能力仅供界面参考，不代表当前可用服务。本工具不宣称任何线上产品能力。

项目身份是 Zombie Love Studio，应保持独立；不得暗示与名称相似的服务或 aizombie.net 存在关联。

## 安装

```bash
npx -y github:gpt-img-2/zombie-love-story-mcp
```

## MCP 工具

- `build_zombie_love_brief`：整理尊重授权与同意边界的重逢故事创意。
- `plan_zombie_reunion_storyboard`：生成定时五段分镜并核对总时长。
- `audit_zombie_story_prompt`：检查授权缺失、复制场景或过度血腥的描述。
- `get_zombie_love_resources`：返回公开参考页面和 Skill 原始文件地址。

## OpenClaw

```bash
openclaw mcp add zombie-love-story \
  --command npx \
  --arg -y \
  --arg github:gpt-img-2/zombie-love-story-mcp \
  --include 'build_zombie_love_brief,plan_zombie_reunion_storyboard,audit_zombie_story_prompt,get_zombie_love_resources'
```

Skill 文件：[zombie-love-story-planner](openclaw/zombie-love-story-planner/SKILL.md)。

## 开发与验证

```bash
pnpm install
pnpm validate
```

公开参考页面：[aizombie.art](https://aizombie.art)。请直接核对当前网站可用性和条款；本仓库不证明在线生成或结账功能。
