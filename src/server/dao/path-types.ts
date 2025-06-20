/**
 * ! 文件由脚本生成，不要直接修改
 */
/** */
export type APITypeTuple = {
  'POST /user-medal/page': [
    APIDao.WebEndPointsUserMedalUserMedalPageReq,
    APIDao.NetCorePalExtensionsDtoPagedDataOfUserMedalPageVo,
  ]
  'POST /user/reset-password': [
    APIDao.WebEndPointsUserResetPasswordReq,
    boolean,
  ]
  'POST /user/delete': [APIDao.WebEndPointsUserUserDeleteReq, boolean]
  'POST /user/login-user-detail': [null, APIDao.WebEndPointsUserUserDetailVo]
  'POST /user/edit-profile': [
    APIDao.WebEndPointsUserUserEditProfileReq,
    boolean,
  ]
  'POST /user/login': [
    APIDao.WebEndPointsUserUserLoginReq,
    APIDao.WebEndPointsUserLoginTokenVo,
  ]
  'POST /user/modify-email-address': [
    APIDao.WebEndPointsUserUserModifyEmailAddressReq,
    boolean,
  ]
  'POST /user/modify-phone': [
    APIDao.WebEndPointsUserUserModifyPhoneReq,
    boolean,
  ]
  'POST /user/pre-register': [APIDao.WebEndPointsUserPreRegisterReq, string]
  'POST /user/register': [
    APIDao.WebEndPointsUserRegisterReq,
    APIDao.WebEndPointsUserRegisterTokenVo,
  ]
  'POST /sms/send': [APIDao.WebEndPointsSmsSendSmsRequest, boolean]
  'POST /sms/verify': [APIDao.WebEndPointsSmsVerifySmsRequest, boolean]
  'POST /score/reward': [APIDao.WebEndPointsScoreRewardScoreReq, boolean]
  'POST /score/send': [APIDao.WebEndPointsScoreSendScoreReq, boolean]
  'POST /score/user-sore-record-page': [
    APIDao.WebEndPointsScoreUserScoreRecordPageReq,
    APIDao.NetCorePalExtensionsDtoPagedDataOfUserScoreRecordPageVo,
  ]
  'POST /proposal/create': [
    APIDao.WebEndPointsProposalCreateProposalReq,
    string,
  ]
  'POST /proposal/delete-my-proposal': [
    APIDao.WebEndPointsProposalDeleteMyProposalReq,
    boolean,
  ]
  'POST /proposal/my-proposal-choice': [
    APIDao.WebEndPointsProposalMyProposalChoiceReq,
    APIDao.WebEndPointsProposalMyProposalChoiceVo,
  ]
  'POST /proposal/my-proposal-list': [
    APIDao.WebEndPointsProposalMyProposalReq,
    Array<APIDao.WebEndPointsProposalMyProposalVo>,
  ]
  'POST /proposal/detail': [
    APIDao.WebEndPointsProposalProposalDetailReq,
    APIDao.WebEndPointsProposalProposalDetailVo,
  ]
  'POST /proposal/page': [
    APIDao.WebEndPointsProposalProposalPageReq,
    APIDao.NetCorePalExtensionsDtoPagedDataOfProposalPageVo,
  ]
  'POST /proposal/vote': [APIDao.WebEndPointsProposalVoteProposalReq, boolean]
  'POST /node/list': [null, Array<APIDao.WebEndPointsNodeNodeListVo>]
  'POST /global-config/foundation-info': [
    null,
    APIDao.WebEndPointsGlobalConfigFoundationInfoVo,
  ]
  'GET /file/download': [
    {fileId: string; fileType: APIDao.DomainEnumsFileType},
    Blob,
  ]
  'POST /file/upload': [
    APIDao.WebEndPointsFileFileUploadForm,
    APIDao.WebApplicationVoFileUploadSuccessVo,
  ]
  'POST /email/send': [APIDao.WebEndPointsEmailSendEmailRequest, boolean]
  'POST /banner/list': [null, Array<APIDao.WebApplicationVoBannerVo>]
}
