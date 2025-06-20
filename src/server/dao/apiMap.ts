/**
 * ! 文件由脚本生成，不要直接修改
 */
import defineAPI from './defineAPI'

const apiMap = {
  /** 用户勋章 */
  'POST /user-medal/page': defineAPI<
    APIDao.WebEndPointsUserMedalUserMedalPageReq,
    APIDao.NetCorePalExtensionsDtoPagedDataOfUserMedalPageVo
  >('/user-medal/page', 'POST'),
  /** 重置用户密码 */
  'POST /user/reset-password': defineAPI<
    APIDao.WebEndPointsUserResetPasswordReq,
    boolean
  >('/user/reset-password', 'POST'),
  /** 删除用户 */
  'POST /user/delete': defineAPI<APIDao.WebEndPointsUserUserDeleteReq, boolean>(
    '/user/delete',
    'POST',
  ),
  /** C端-获取当前登录用户的详细信息 */
  'POST /user/login-user-detail': defineAPI<
    null,
    APIDao.WebEndPointsUserUserDetailVo
  >('/user/login-user-detail', 'POST'),
  /** 编辑个人资料 */
  'POST /user/edit-profile': defineAPI<
    APIDao.WebEndPointsUserUserEditProfileReq,
    boolean
  >('/user/edit-profile', 'POST'),
  /** 用户登录 */
  'POST /user/login': defineAPI<
    APIDao.WebEndPointsUserUserLoginReq,
    APIDao.WebEndPointsUserLoginTokenVo
  >('/user/login', 'POST'),
  /** 修改邮箱地址 */
  'POST /user/modify-email-address': defineAPI<
    APIDao.WebEndPointsUserUserModifyEmailAddressReq,
    boolean
  >('/user/modify-email-address', 'POST'),
  /** 修改手机号 */
  'POST /user/modify-phone': defineAPI<
    APIDao.WebEndPointsUserUserModifyPhoneReq,
    boolean
  >('/user/modify-phone', 'POST'),
  /** 用户预注册, 返回一个用户 Id, 使用该 id 完成后续注册流程 */
  'POST /user/pre-register': defineAPI<
    APIDao.WebEndPointsUserPreRegisterReq,
    string
  >('/user/pre-register', 'POST'),
  /** 用户注册 */
  'POST /user/register': defineAPI<
    APIDao.WebEndPointsUserRegisterReq,
    APIDao.WebEndPointsUserRegisterTokenVo
  >('/user/register', 'POST'),
  /** 创建banner */
  'POST /sms/send': defineAPI<APIDao.WebEndPointsSmsSendSmsRequest, boolean>(
    '/sms/send',
    'POST',
  ),
  /** 创建banner */
  'POST /sms/verify': defineAPI<
    APIDao.WebEndPointsSmsVerifySmsRequest,
    boolean
  >('/sms/verify', 'POST'),
  /** 打赏积分 */
  'POST /score/reward': defineAPI<
    APIDao.WebEndPointsScoreRewardScoreReq,
    boolean
  >('/score/reward', 'POST'),
  /** 发送积分 */
  'POST /score/send': defineAPI<APIDao.WebEndPointsScoreSendScoreReq, boolean>(
    '/score/send',
    'POST',
  ),
  /** 用户积分明细 */
  'POST /score/user-sore-record-page': defineAPI<
    APIDao.WebEndPointsScoreUserScoreRecordPageReq,
    APIDao.NetCorePalExtensionsDtoPagedDataOfUserScoreRecordPageVo
  >('/score/user-sore-record-page', 'POST'),
  /** 创建提案 */
  'POST /proposal/create': defineAPI<
    APIDao.WebEndPointsProposalCreateProposalReq,
    string
  >('/proposal/create', 'POST'),
  /** 删除我的提案 */
  'POST /proposal/delete-my-proposal': defineAPI<
    APIDao.WebEndPointsProposalDeleteMyProposalReq,
    boolean
  >('/proposal/delete-my-proposal', 'POST'),
  /** 我的投票选择 */
  'POST /proposal/my-proposal-choice': defineAPI<
    APIDao.WebEndPointsProposalMyProposalChoiceReq,
    APIDao.WebEndPointsProposalMyProposalChoiceVo
  >('/proposal/my-proposal-choice', 'POST'),
  /** 我的提案列表 */
  'POST /proposal/my-proposal-list': defineAPI<
    APIDao.WebEndPointsProposalMyProposalReq,
    Array<APIDao.WebEndPointsProposalMyProposalVo>
  >('/proposal/my-proposal-list', 'POST'),
  /** 提案详情 */
  'POST /proposal/detail': defineAPI<
    APIDao.WebEndPointsProposalProposalDetailReq,
    APIDao.WebEndPointsProposalProposalDetailVo
  >('/proposal/detail', 'POST'),
  /** 提案列表 */
  'POST /proposal/page': defineAPI<
    APIDao.WebEndPointsProposalProposalPageReq,
    APIDao.NetCorePalExtensionsDtoPagedDataOfProposalPageVo
  >('/proposal/page', 'POST'),
  /** 投票提案 */
  'POST /proposal/vote': defineAPI<
    APIDao.WebEndPointsProposalVoteProposalReq,
    boolean
  >('/proposal/vote', 'POST'),
  /** 节点列表 */
  'POST /node/list': defineAPI<null, Array<APIDao.WebEndPointsNodeNodeListVo>>(
    '/node/list',
    'POST',
  ),
  /** 基金会信息查询 */
  'POST /global-config/foundation-info': defineAPI<
    null,
    APIDao.WebEndPointsGlobalConfigFoundationInfoVo
  >('/global-config/foundation-info', 'POST'),
  /** 下载文件 */
  'GET /file/download': defineAPI<
    {fileId: string; fileType: APIDao.DomainEnumsFileType},
    Blob
  >('/file/download', 'GET'),
  /** 上传文件 */
  'POST /file/upload': defineAPI<
    APIDao.WebEndPointsFileFileUploadForm,
    APIDao.WebApplicationVoFileUploadSuccessVo
  >('/file/upload', 'POST', {divider: {formData: ['file', 'fileType']}}),
  /** 发送邮件 */
  'POST /email/send': defineAPI<
    APIDao.WebEndPointsEmailSendEmailRequest,
    boolean
  >('/email/send', 'POST'),
  /** 查询banner列表 */
  'POST /banner/list': defineAPI<null, Array<APIDao.WebApplicationVoBannerVo>>(
    '/banner/list',
    'POST',
  ),
}
export default apiMap
export type APIMap = typeof apiMap
export type APIPaths = keyof APIMap
