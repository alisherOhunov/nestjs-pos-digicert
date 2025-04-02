
export const SigningDocumentStatus = {
  SUCCESS: '901',
  INVALID_PARAMETER: '902',
  INTERNAL_SERVER_ERROR: '903',
  FILE_SERVER_ACCESS_ERROR: '904',
  INVALID_SIGNING_PAGE: '905',
  INVALID_QR_VALUE: '906',
  QR_TRANSACTION_ERROR: '907',
  FILE_LOCKED: '908',
  ROAMING_OPERATION_FAILED: '800',
  USER_NOT_FOUND: '805',
  CERTIFICATE_REVOKED: '808',
  CERTIFICATE_NOT_FOUND: '809',
  ORGANIZATION_NOT_FOUND: '810',
  CERTIFICATE_EXPIRED: '811',
  INVALID_BULK_SESSION: '703',
  USER_BLOCKED: '802',
};

 
export const SigningDocumentMessages: Record<string, string> = {
  [SigningDocumentStatus.SUCCESS]: 'Operation completed successfully',
  [SigningDocumentStatus.INVALID_PARAMETER]: 'Invalid parameters provided',
  [SigningDocumentStatus.INTERNAL_SERVER_ERROR]:
    'Internal server error occurred',
  [SigningDocumentStatus.FILE_SERVER_ACCESS_ERROR]:
    'Unable to access file server',
  [SigningDocumentStatus.INVALID_SIGNING_PAGE]:
    'Invalid signing page specified',
  [SigningDocumentStatus.INVALID_QR_VALUE]: 'Invalid QR code value',
  [SigningDocumentStatus.QR_TRANSACTION_ERROR]:
    'Error processing QR transaction',
  [SigningDocumentStatus.FILE_LOCKED]: 'File is currently locked',
  [SigningDocumentStatus.ROAMING_OPERATION_FAILED]: 'Roaming operation failed',
  [SigningDocumentStatus.USER_NOT_FOUND]: 'User not found in the system',
  [SigningDocumentStatus.CERTIFICATE_REVOKED]: 'Certificate has been revoked',
  [SigningDocumentStatus.CERTIFICATE_NOT_FOUND]: 'Certificate not found',
  [SigningDocumentStatus.ORGANIZATION_NOT_FOUND]:
    'Organization ID does not exist',
  [SigningDocumentStatus.CERTIFICATE_EXPIRED]: 'Certificate has expired',
  [SigningDocumentStatus.INVALID_BULK_SESSION]: 'Invalid bulk ID session',
  [SigningDocumentStatus.USER_BLOCKED]: 'User is blocked',
};

export interface BaseResponse {
  statusCode: string;
  statusMessage: string;
}

export interface VerifyRoamingCertResponse extends BaseResponse {
  certificate: string;
}

export interface SignRoamingPdfConfigDResponse extends BaseResponse {
  requestId: string;
  spUrl: string;
}

export interface RequestBulkIdResponse extends BaseResponse {
  bulkId: string;
  spUrl: string;
}

export interface SignRoamingPdfConfigDBulkResponse extends BaseResponse {
  requestId: string;
}

export interface SignRoamingPdfConfigDInput {
  source: string;
  dest: string;
  signerXyPage: string;
  signerImagePath?: string;
  qrValueOnline?: string;
  qrValueOffline?: string;
  qrPosition?: string;
  qrSize?: number;
  qrBgSizeX?: number;
  qrBgSizeY?: number;
  signerFontSize?: number;
  signerTextRow?: number;
  dtsFlag?: number;
  remark?: string;
  successUrl: string;
  cancelUrl: string;
  pCode?: string;
  userId?: string;
  orgId?: string;
  fileServerId?: string;
}

export interface SignRoamingPdfConfigDBulkInput {
  source: string;
  dest: string;
  signerXyPage: string;
  signerImagePath?: string;
  qrValueSegment1?: string;
  qrValueSegment2?: string;
  qrPosition?: string;
  qrSize?: number;
  qrBgSizeX?: number;
  qrBgSizeY?: number;
  signerFontSize?: number;
  signerTextRow?: number;
  dtsFlag: number;
  remark?: string;
  bulkId: string;
  fileServerId?: string;
}

export interface RequestBulkInput {
  code: string;
  successUrl: string;
  cancelUrl: string;
  userId?: string;
  orgId?: string;
}


export interface VerifyCertInput {
  pCode?: string;
  userId?: string;
  orgId?: string;
}

export interface ValidationParameters {
  userId?: string;
  orgId?: string;
  fileServerId?: string;
}

export interface ErrorWithMessage {
  message: string;
}

