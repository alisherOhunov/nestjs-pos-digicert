import type { Client } from 'soap';
import { createClient } from 'soap';

import { PosDigicertDigitalSigningError } from '../errors/pos-digicert-digital-signing.error';
import type {
  ErrorWithMessage,
  RequestBulkIdResponse,
  RequestBulkInput,
  SignRoamingPdfConfigDBulkInput,
  SignRoamingPdfConfigDBulkResponse,
  SignRoamingPdfConfigDInput,
  SignRoamingPdfConfigDResponse,
  ValidationParameters,
  VerifyCertInput,
  VerifyRoamingCertResponse,
} from '../interfaces/pos-digicert-digital-signing.interface';
import {
  SigningDocumentMessages,
  SigningDocumentStatus,
} from '../interfaces/pos-digicert-digital-signing.interface';
import { PosDigicertDigitalSigningValidationError } from '../errors/pos-digicert-digital-signing-validation.error';
import { PosDigicertOptions } from 'lib/interfaces/pos-digicert-options.interface';

export class PosDigicertDigitalSigning {
  private readonly url: string;
  private readonly projectCode: string;
  private readonly organizationId: string | undefined;
  private readonly fileServerId: string | undefined;
  private readonly userId: string | undefined;
  private client: Client | null = null;

  constructor(config: PosDigicertOptions) {
    this.url = config.url;
    this.projectCode = config.projectCode;
    this.organizationId = config.organizationId;
    this.fileServerId = config.fileServerId;
    this.userId = config.userId;
  }

  async verifyRoamingCert(input: VerifyCertInput) {
    await this.ensureClientInitialized();

    this.validateRequiredParameters({
      userId: input.userId,
      orgId: input.orgId
    });

    try {
      const result = await this.executeSOAPRequest<VerifyRoamingCertResponse>(
        'verifyRoamingCert',
        {
          pCode: this.projectCode,
          ...this.buildVerificationParams(input)
        },
      );

      this.validateResponse(result.statusCode, 'Certificate verification');

      return {
        ...result,
        statusMessage: SigningDocumentMessages[result.statusCode],
      };
    } catch (error) {
      this.handleError('Certificate verification', error);
    }
  }

  async signRoamingPdfConfigD(input: SignRoamingPdfConfigDInput) {
    await this.ensureClientInitialized();
    this.validateRequiredParameters({
      userId: input.userId,
      orgId: input.orgId,
      fileServerId: input.fileServerId
    });

    try {
      const result =
        await this.executeSOAPRequest<SignRoamingPdfConfigDResponse>(
          'signRoamingPdfConfigD',
          {
            pCode: this.projectCode,
            ...input,
            ...this.buildVerificationParams(input),
          },
        );

      console.log('Result', result);
      return {
        ...result,
        statusMessage: SigningDocumentMessages[result.statusCode],
      };
    } catch (error) {
      this.handleError('PDF signing (Individual)', error);
    }
  }

  async requestBulkId(input: RequestBulkInput) {
    await this.ensureClientInitialized();

    this.validateRequiredParameters({
      userId: input.userId,
      orgId: input.orgId
    });

    try {
      const result = await this.executeSOAPRequest<RequestBulkIdResponse>(
        'requestBulkId',
        {
          ...input,
          ...this.buildVerificationParams(input),
          pCode: this.projectCode,
        },
      );

      this.validateResponse(result.statusCode, 'Bulk ID request');

      return {
        ...result,
        statusMessage: SigningDocumentMessages[result.statusCode],
      };
    } catch (error) {
      this.handleError('Bulk ID request', error);
    }
  }

  async signRoamingPdfConfigDBulk(input: SignRoamingPdfConfigDBulkInput) {
    await this.ensureClientInitialized();

    this.validateRequiredParameters({
      fileServerId: input.fileServerId
    });

    try {
      const result =
        await this.executeSOAPRequest<SignRoamingPdfConfigDBulkResponse>(
          'signRoamingPdfConfigDBulk',
          {
            ...input,
            ...this.buildVerificationParams(input)
          },
        );

      this.validateResponse(result.statusCode, 'Bulk PDF signing');

      return {
        ...result,
        statusMessage: SigningDocumentMessages[result.statusCode],
      };
    } catch (error) {
      this.handleError('Bulk PDF signing', error);
    }
  }

  private async ensureClientInitialized(): Promise<void> {
    if (!this.client) {
      this.client = await this.initClient();
      // Force use to https url because wsdl definition returns http url
      this.client.setEndpoint(this.url);
    }
  }

  private async initClient(): Promise<Client> {
    return new Promise((resolve, reject) => {
      createClient(this.url, (err, client) => {
        if (err) {
          reject(
            new PosDigicertDigitalSigningError(
              `Failed to initialize SOAP client: ${err.message}`,
            ),
          );
          return;
        }
        resolve(client);
      });
    });
  }

  private async executeSOAPRequest<T>(
    method: string,
    args: unknown,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        reject(new PosDigicertDigitalSigningError('SOAP client not initialized'));
        return;
      }

      console.log('Args', args);  
      this.client[method](args, (err: unknown, result: T) => {
        if (err) {
          reject(
            new PosDigicertDigitalSigningError(
              `SOAP request failed: ${this.getErrorMessage(err)}`,
            ),
          );
          return;
        }
        resolve(result);
      });
    });
  }

  private validateRequiredParameters(input: Partial<ValidationParameters>): void {
    const requiredParamChecks = [];

    if ('userId' in input) {
      requiredParamChecks.push({
        value: input.userId || this.userId,
        name: 'User ID'
      });
    }

    if ('orgId' in input) {
      requiredParamChecks.push({
        value: input.orgId || this.organizationId,
        name: 'Organization ID'
      });
    }

    if ('fileServerId' in input) {
      requiredParamChecks.push({
        value: input.fileServerId || this.fileServerId,
        name: 'File Server ID'
      });
    }

    const missingParams = requiredParamChecks
      .filter(param => !param.value)
      .map(param => param.name);

    
    if (missingParams.length > 0) {
      const errorMessage = `ERROR: The following parameters must be provided either in configuration or input: ${missingParams.join(', ')}`;
      throw new PosDigicertDigitalSigningValidationError(errorMessage);
    }
  }

  private buildVerificationParams(input: Partial<ValidationParameters>) {
    const params: Record<string, string | undefined> = {};

      params.userId = input.userId ?? this.userId;
      params.orgId = input.orgId ?? this.organizationId;
      params.fileServerId = input.fileServerId ?? this.fileServerId;
    console.log(params);
    return params;
  }

  private validateResponse(statusCode: string, operation: string) {
    if (statusCode !== SigningDocumentStatus.SUCCESS) {
      throw new PosDigicertDigitalSigningError(
        `${operation} failed: ${SigningDocumentMessages[statusCode]} (Code: ${statusCode})`,
      );
    }
  }

  private handleError(operation: string, error: unknown) {
    if (error instanceof PosDigicertDigitalSigningError) {
      throw error;
    }
    throw new PosDigicertDigitalSigningError(
      `${operation} Processing Error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  private isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    );
  }
  
  private toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (this.isErrorWithMessage(maybeError)) {
      return maybeError;
    }
  
    try {
      return new Error(JSON.stringify(maybeError));
    } catch {
      return new Error(String(maybeError));
    }
  }
  
  private getErrorMessage(error: unknown): string {
    return this.toErrorWithMessage(error).message;
  }
}