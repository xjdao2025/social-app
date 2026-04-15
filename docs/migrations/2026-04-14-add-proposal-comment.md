# 提案评论功能前端实现方案

## 背景

为提案详情页 (`/screens/Proposal/index.tsx`) 增加简单的文字回复功能。仅支持一级评论，显示回复者、时间及回复内容。

## 前端代码变更

### 1. API 类型定义

文件：`src/server/dao/api.d.ts`

#### 1.1 新增评论请求类型

```typescript
interface WebEndpointsProposalCreateProposalCommentReq {
  /** 提案 Id */
  proposalId: string

  /** 评论内容 */
  content: string
}
```

#### 1.2 新增评论 VO 类型

```typescript
interface WebEndpointsProposalProposalCommentVo {
  /** 评论 Id */
  commentId: string

  /** 评论用户名称 */
  userName: string

  /** 评论内容 */
  content: string

  /** 创建时间 {"format":"date-time"} */
  createdAt: string
}
```

#### 1.3 修改提案详情响应类型

在 `WebEndpointsProposalProposalDetailVo` 中新增：

```typescript
comments: APIDao.WebEndpointsProposalProposalCommentVo[]
```

#### 1.4 路径类型与 API Map

文件：`src/server/dao/path-types.ts`、`src/server/dao/apiMap.ts`

新增：

```typescript
'POST /proposal/comment': [APIDao.WebEndpointsProposalCreateProposalCommentReq, boolean]
```

### 2. 提案详情页 UI 改造

文件：`src/screens/Proposal/index.tsx`

#### 2.1 评论列表展示

在投票结果 (`VoteResult`) 下方新增评论区：

- 标题：**评论 ({comments.length})**
- 每条评论展示：
  - 用户名称（加粗）
  - 评论内容
  - 时间（`yyyy/MM/dd HH:mm` 格式）
- 无评论时显示空状态文案（如：暂无评论，快来发表第一条评论吧）

#### 2.2 评论输入框

在页面底部（投票按钮之上，或如果已投票则在页面最底部固定）增加评论输入区域：

- 多行文本输入框（`TextInput` 或原生 `textarea`）
- placeholder: "发表你的评论..."
- 发送按钮（仅在有内容时可用）
- 最大长度 512 字符

#### 2.3 评论提交逻辑

```typescript
const onSubmitComment = async (content: string) => {
  const flag = await server.dao('POST /proposal/comment', {
    proposalId,
    content: content.trim(),
  })
  if (flag) {
    Toast.show('评论成功', 'check', 'center')
    reloadProposalInfo() // 刷新详情以获取最新评论
    setCommentText('')
  }
}
```

## 用户体验

- 评论提交成功后自动清空输入框并刷新评论列表
- 未登录用户不显示评论输入框（当前页面已有登录态判断 `currentAccount?.did`）
- 评论按时间升序排列（由后端保证）

## 依赖

无需新增第三方依赖，使用现有组件：
- `Text` / `View` / `Pressable` 等 RN 基础组件
- `Toast` 用于操作反馈
- `server.dao` 用于接口调用
