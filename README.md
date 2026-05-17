# novel-writer

一个用于 AI agent 编写中文长篇小说的 [Anthropic Agent Skill](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)。它本质上是一份提示词规范，约束 agent 在编写、修改、扩展中文小说时严格维护「全局大纲、人物设定、文风、卷大纲、章节正文」五者之间的双向一致性，强制每章字数落在 3000-5000 之间，并在每章完成后启动上下文隔离的子 agent 进行 Review。

## 它做什么

- **强制目录结构**：根目录的 `全局大纲.md`、`文风.md`、`人物设定/` 文件夹、`第N卷卷名/` 卷目录、卷下的 `卷大纲.md` 与各章节文件
- **文风管理**：`文风.md` 不存在时禁止写正文，必须先向用户询问文风信息并创建；写作前必须重读
- **维护一致性**：用户对话中提到的剧情若与现有大纲/人物设定冲突，agent 必须停止写作并询问用户是否修改
- **新增卷的强制流程**：先与用户讨论卷大纲 → 创建卷目录 → 写卷大纲 → 同步全局大纲 → 才能开始写章节
- **章节-大纲双向同步**：写章节时严格遵循卷大纲；用户修改正文后，agent 必须反向修改卷大纲（必要时连带人物设定与全局大纲）
- **字数检查**：每章写完用 `wc -m` 统计，少于 3000 扩写、超过 5000 精简或拆章
- **章节 Review**：每章完成后必须启动上下文隔离的子 agent 进行字数、内容、文风、AI 风格四项检查，不通过需修改后重新 Review

完整规范见 [SKILL.md](./SKILL.md)。

## 如何使用

### Claude Code（项目级）

把整个目录复制为项目下的 `.claude/skills/novel-writer/`：

```bash
mkdir -p /your/novel/project/.claude/skills
cp -r /path/to/this/repo /your/novel/project/.claude/skills/novel-writer
```

之后在该项目中启动 Claude Code，agent 会在涉及"写小说、写章节、维护大纲"等任务时自动加载此 skill。

### Claude Code（用户级）

放到用户级 skills 目录，所有项目共享：

```bash
mkdir -p ~/.claude/skills
cp -r /path/to/this/repo ~/.claude/skills/novel-writer
```

### Claude API / claude.ai

把目录打包为 zip 上传：
- API：通过 `/v1/skills` 端点上传
- claude.ai：在 Settings → Features 中上传

## 期望的小说项目结构

```
小说项目/
├── 全局大纲.md
├── 文风.md
├── 人物设定/
│   ├── 主角名.md
│   └── 配角名.md
├── 第1卷卷名/
│   ├── 卷大纲.md
│   ├── 第1章章节标题.md
│   └── 第2章章节标题.md
├── 第2卷卷名/
│   ├── 卷大纲.md
│   └── ...
└── ...
```

## License

MIT
