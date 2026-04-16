# 转账二次确认与重复警告优化方案

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修改后端 `/api/v1/score/user-sore-record-page` 接口，将 `reason` 字段值替换为 participator 的 domain name；前端稻米明细页根据 `type` 与 `reason` 拼装显示文本；重复警告确认后跳过二次确认直接执行转账/打赏。

**Architecture:** 
- 后端 `ScoreRecordQuery.Page` 中把 `UserScoreRecordPageVo.Reason` 的映射从 `record.Reason` 改为 `record.ParticipatorDomainName`，使前端直接拿到 domain name。
- 前端 `PointsRecord/index.tsx` 增加 `type → 中文描述` 的映射函数，将类型名与 `reason`（domain name）拼接后展示。
- 前端 `SendPointsDialog.tsx` 与 `RewardScoresDialog/index.tsx` 中，重复警告的“继续”按钮直接调用实际发送/打赏方法，不再弹出二次确认。

**Tech Stack:** React Native (TypeScript), C# (.NET Core)

---

### Task 1: 后端修改 ScoreRecordQuery 映射

**Files:**
- Modify: `/home/rink/work/github/xjd/xiangjiandao-core/src/Xiangjiandao.Web/Application/Queries/ScoreRecordQuery.cs`

**Step 1: 修改 Reason 映射**

在 `Page` 方法里，把 `UserScoreRecordPageVo` 的 `Reason` 赋值为 `record.ParticipatorDomainName`：

```csharp
.Select(record => new UserScoreRecordPageVo
{
    Id = record.Id,
    ParticipatorId = record.ParticipatorId,
    Score = record.Score,
    Type = record.Type,
    Reason = record.ParticipatorDomainName,
    Remark = record.Remark,
    CreatedAt = record.CreatedAt,
}).ToPagedDataAsync(req.PageNum, req.PageSize, countTotal: true, cancellationToken);
```

**Step 2: 验证修改**
- 检查 `ScoreRecordQuery.cs` 第 25 行是否已改为 `Reason = record.ParticipatorDomainName,`

---

### Task 2: 前端 PointsRecord 拼装显示文本

**Files:**
- Modify: `/home/rink/work/github/xjd/social-app/src/screens/PointsRecord/index.tsx`

**Step 1: 新增类型映射函数**

在组件内部（`PAGE_SIZE` 常量下方或组件上方）增加：

```typescript
function getScoreSourceLabel(type: APIDao.DomainEnumsScoreSourceType) {
  switch (type) {
    case 1:
      return '赞赏'
    case 2:
      return '赠送'
    case 3:
      return '后台发放'
    default:
      return '未知'
  }
}
```

**Step 2: 替换 reason 渲染逻辑**

在 `pointsRecord?.list.map((p, index) => { ... })` 中，把原来的 `{p.reason}` 替换为：

```jsx
{`${getScoreSourceLabel(p.type)} ${p.reason}`}
```

确保即使 `p.reason` 为空也能正常显示。

**Step 3: 运行诊断**
- 命令：`npx tsc --noEmit src/screens/PointsRecord/index.tsx`（或通过 LSP 检查）
- 预期：无类型错误

---

### Task 3: 前端 SendPointsDialog 重复警告后直接发送

**Files:**
- Modify: `/home/rink/work/github/xjd/social-app/src/screens/Profile/Header/SendPointsDialog.tsx`

**Step 1: 修改 onConfirmDuplicate 回调**

找到 `onConfirmDuplicate` 的定义（约第 182 行），从：

```typescript
const onConfirmDuplicate = useCallback(() => {
  confirmPromptControl.open()
}, [confirmPromptControl])
```

改为：

```typescript
const onConfirmDuplicate = useCallback(() => {
  handleSend()
}, [handleSend])
```

**Step 2: 运行诊断**
- 通过 LSP 检查 `SendPointsDialog.tsx`，确认无类型/闭包错误。

---

### Task 4: 前端 RewardScoresDialog 重复警告后直接打赏

**Files:**
- Modify: `/home/rink/work/github/xjd/social-app/src/components/RewardScoresDialog/index.tsx`

**Step 1: 修改 onConfirmDuplicate 回调**

找到 `onConfirmDuplicate` 的定义（约第 150 行），从：

```typescript
const onConfirmDuplicate = () => {
  confirmPromptControl.open()
}
```

改为：

```typescript
const onConfirmDuplicate = () => {
  handleReward()
}
```

**Step 2: 运行诊断**
- 通过 LSP 检查 `RewardScoresDialog/index.tsx`，确认无类型/闭包错误。

---

### Task 5: 提交变更

**Step 1: 检查变更范围**

```bash
git diff --stat
```

预期涉及文件：
- `xiangjiandao-core/src/Xiangjiandao.Web/Application/Queries/ScoreRecordQuery.cs`
- `social-app/src/screens/PointsRecord/index.tsx`
- `social-app/src/screens/Profile/Header/SendPointsDialog.tsx`
- `social-app/src/components/RewardScoresDialog/index.tsx`

**Step 2: 分别提交（可选合并为一个 commit）**

```bash
git add xiangjiandao-core/src/Xiangjiandao.Web/Application/Queries/ScoreRecordQuery.cs
git add social-app/src/screens/PointsRecord/index.tsx
git add social-app/src/screens/Profile/Header/SendPointsDialog.tsx
git add social-app/src/components/RewardScoresDialog/index.tsx
git commit -m "feat: 稻米明细 reason 改为 participator domain name，重复警告跳过二次确认"
```

---

## 附：变更摘要

| 文件 | 变更内容 |
|------|----------|
| `ScoreRecordQuery.cs` | `UserScoreRecordPageVo.Reason = record.ParticipatorDomainName` |
| `PointsRecord/index.tsx` | 新增 `getScoreSourceLabel`，用 `type + reason` 拼装显示 |
| `SendPointsDialog.tsx` | `onConfirmDuplicate` 直接调用 `handleSend` |
| `RewardScoresDialog/index.tsx` | `onConfirmDuplicate` 直接调用 `handleReward` |
