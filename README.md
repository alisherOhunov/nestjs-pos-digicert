# Pos Digicert Document Signing

## Table of Contents

1. [Installation](#installation)
2. [POS Digicert Digital Signing Service](#pos-digicert-digital-signing-service)
   - [Configuration](#configuration)
   - [Methods](#methods)
     - [verifyRoamingCert](#verifyroamingcert)
     - [signRoamingPdfConfigD](#signroamingpdfconfigd)
     - [requestBulkId](#requestbulkid)
     - [signRoamingPdfConfigDBulk](#signroamingpdfconfigdbulk)
   - [Status Codes](#status-codes)
   - [Error Handling](#error-handling)
3. [SFTP Service](#sftp-service)
   - [Configuration](#configuration-1)
   - [Methods](#methods-1)
     - [upload](#upload)
     - [download](#download)
     - [delete](#delete)
   - [Error Handling](#error-handling-1)
4. [TypeScript Support](#typescript-support)
5. [Complete Examples](#complete-examples)

## Installation

Install the package using npm:

```bash
npm install nestjs-pos-digicert
```

Or using yarn:

```bash
yarn add nestjs-pos-digicert
```

## POS Digicert Digital Signing Service

The `PosDigicertDigitalSigning` class provides integration with POS Digicert's digital signing service through SOAP API calls.

### Configuration

```javascript
const { PosDigicertDigitalSigning } = require('nestjs-pos-digicert');

const signingService = new PosDigicertDigitalSigning({
  url: 'https://api.digicert-service.com/endpoint', // Required: Service endpoint URL
  projectCode: 'YOUR_PROJECT_CODE',                 // Required: Project code
  organizationId: 'YOUR_ORGANIZATION_ID',           // Optional: Default organization ID
  fileServerId: 'YOUR_FILE_SERVER_ID',              // Optional: Default file server ID
  userId: 'YOUR_USER_ID'                            // Optional: Default user ID
});
```

#### Configuration Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | The endpoint URL for the POS Digicert SOAP service |
| `projectCode` | string | Yes | Your project code provided by POS Digicert |
| `organizationId` | string | No | Default organization ID to use if not provided in method calls |
| `fileServerId` | string | No | Default file server ID to use if not provided in method calls |
| `userId` | string | No | Default user ID to use if not provided in method calls |

### Methods

`verifyRoamingCert()`

Verifies a roaming certificate for a user.

```javascript
const response = await signingService.verifyRoamingCert({
  userId: 'user123',   // Required if not provided in constructor
  orgId: 'org456'      // Required if not provided in constructor
});
```

##### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes* | User ID for certificate verification (*required if not provided in constructor) |
| `orgId` | string | Yes* | Organization ID for certificate verification (*required if not provided in constructor) |

##### Response Object

```javascript
{
  statusCode: '901',
  statusMessage: 'Operation completed successfully',
  certificate: 'BASE64_ENCODED_CERTIFICATE_STRING'
}
```

| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | string | Status code of the operation (see [Status Codes](#status-codes)) |
| `statusMessage` | string | Human-readable status message |
| `certificate` | string | Base64 encoded certificate string (only present if successful) |

`signRoamingPdfConfigD()`

Signs a PDF document using a roaming certificate.

```javascript
const response = await signingService.signRoamingPdfConfigD({
  source: '/path/to/source.pdf',        // Required: Source file path
  dest: '/path/to/signed.pdf',          // Required: Destination file path
  signerXyPage: '1,100,100',            // Required: Page number and coordinates for signature
  successUrl: 'https://example.com/success', // Required: Success callback URL
  cancelUrl: 'https://example.com/cancel',   // Required: Cancel callback URL
  userId: 'user123',                     // Required if not provided in constructor
  orgId: 'org456',                       // Required if not provided in constructor
  fileServerId: 'fs789',                 // Required if not provided in constructor
  
  // Optional parameters
  signerImagePath: '/path/to/signature.png',
  qrValueOnline: 'online_qr_value',
  qrValueOffline: 'offline_qr_value',
  qrPosition: '1,200,200',               // Page number and coordinates for QR code
  qrSize: 100,                           // Size of QR code in pixels
  qrBgSizeX: 120,                        // Background width for QR code
  qrBgSizeY: 120,                        // Background height for QR code
  signerFontSize: 12,                    // Font size for signer information
  signerTextRow: 2,                      // Number of text rows for signer information
  dtsFlag: 1,                            // Digital timestamp flag (0 or 1)
  remark: 'Document signed on March 18, 2025' // Optional remark
});
```

##### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | string | Yes | Source file path on the file server |
| `dest` | string | Yes | Destination file path on the file server |
| `signerXyPage` | string | Yes | Page number and coordinates for signature in format "page,x,y" |
| `successUrl` | string | Yes | URL to redirect after successful signing |
| `cancelUrl` | string | Yes | URL to redirect after cancelled signing |
| `userId` | string | Yes* | User ID (*required if not provided in constructor) |
| `orgId` | string | Yes* | Organization ID (*required if not provided in constructor) |
| `fileServerId` | string | Yes* | File server ID (*required if not provided in constructor) |
| `signerImagePath` | string | No | Path to signature image file |
| `qrValueOnline` | string | No | Online QR code value |
| `qrValueOffline` | string | No | Offline QR code value |
| `qrPosition` | string | No | QR code position in format "page,x,y" |
| `qrSize` | number | No | Size of QR code in pixels |
| `qrBgSizeX` | number | No | Background width for QR code |
| `qrBgSizeY` | number | No | Background height for QR code |
| `signerFontSize` | number | No | Font size for signer information |
| `signerTextRow` | number | No | Number of text rows for signer information |
| `dtsFlag` | number | No | Digital timestamp flag (0 or 1) |
| `remark` | string | No | Optional remark for the document |

##### Response Object

```javascript
{
  statusCode: '901',
  statusMessage: 'Operation completed successfully',
  requestId: 'req123456789',
  spUrl: 'https://signing-service.com/sign/req123456789'
}
```

| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | string | Status code of the operation (see [Status Codes](#status-codes)) |
| `statusMessage` | string | Human-readable status message |
| `requestId` | string | Unique request ID for the signing operation |
| `spUrl` | string | URL for the signing process that should be presented to the user |

`requestBulkId()`

Requests a bulk ID for batch signing operations.

```javascript
const response = await signingService.requestBulkId({
  code: 'BATCH_CODE',                    // Required: Batch code
  successUrl: 'https://example.com/success', // Required: Success callback URL
  cancelUrl: 'https://example.com/cancel',   // Required: Cancel callback URL
  userId: 'user123',                     // Required if not provided in constructor
  orgId: 'org456'                        // Required if not provided in constructor
});
```

##### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `code` | string | Yes | Batch code for the bulk operation |
| `successUrl` | string | Yes | URL to redirect after successful bulk ID request |
| `cancelUrl` | string | Yes | URL to redirect after cancelled bulk ID request |
| `userId` | string | Yes* | User ID (*required if not provided in constructor) |
| `orgId` | string | Yes* | Organization ID (*required if not provided in constructor) |

##### Response Object

```javascript
{
  statusCode: '901',
  statusMessage: 'Operation completed successfully',
  bulkId: 'bulk123456789',
  spUrl: 'https://signing-service.com/bulk/bulk123456789'
}
```

| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | string | Status code of the operation (see [Status Codes](#status-codes)) |
| `statusMessage` | string | Human-readable status message |
| `bulkId` | string | Unique bulk ID for batch signing operations |
| `spUrl` | string | URL for the bulk signing process that should be presented to the user |

`signRoamingPdfConfigDBulk()`

Signs PDF documents in bulk using a previously obtained bulk ID.

```javascript
const response = await signingService.signRoamingPdfConfigDBulk({
  source: '/path/to/source.pdf',        // Required: Source file path
  dest: '/path/to/signed.pdf',          // Required: Destination file path
  signerXyPage: '1,100,100',            // Required: Page number and coordinates for signature
  bulkId: 'bulk123456789',              // Required: Bulk ID from requestBulkId
  dtsFlag: 1,                           // Required: Digital timestamp flag (0 or 1)
  fileServerId: 'fs789',                // Required if not provided in constructor
  
  // Optional parameters
  signerImagePath: '/path/to/signature.png',
  qrValueSegment1: 'qr_segment1',
  qrValueSegment2: 'qr_segment2',
  qrPosition: '1,200,200',               // Page number and coordinates for QR code
  qrSize: 100,                           // Size of QR code in pixels
  qrBgSizeX: 120,                        // Background width for QR code
  qrBgSizeY: 120,                        // Background height for QR code
  signerFontSize: 12,                    // Font size for signer information
  signerTextRow: 2,                      // Number of text rows for signer information
  remark: 'Bulk signed on March 18, 2025' // Optional remark
});
```

##### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | string | Yes | Source file path on the file server |
| `dest` | string | Yes | Destination file path on the file server |
| `signerXyPage` | string | Yes | Page number and coordinates for signature in format "page,x,y" |
| `bulkId` | string | Yes | Bulk ID obtained from requestBulkId |
| `dtsFlag` | number | Yes | Digital timestamp flag (0 or 1) |
| `fileServerId` | string | Yes* | File server ID (*required if not provided in constructor) |
| `signerImagePath` | string | No | Path to signature image file |
| `qrValueSegment1` | string | No | First segment of QR code value |
| `qrValueSegment2` | string | No | Second segment of QR code value |
| `qrPosition` | string | No | QR code position in format "page,x,y" |
| `qrSize` | number | No | Size of QR code in pixels |
| `qrBgSizeX` | number | No | Background width for QR code |
| `qrBgSizeY` | number | No | Background height for QR code |
| `signerFontSize` | number | No | Font size for signer information |
| `signerTextRow` | number | No | Number of text rows for signer information |
| `remark` | string | No | Optional remark for the document |

##### Response Object

```javascript
{
  statusCode: '901',
  statusMessage: 'Operation completed successfully',
  requestId: 'bulkreq123456789'
}
```

| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | string | Status code of the operation (see [Status Codes](#status-codes)) |
| `statusMessage` | string | Human-readable status message |
| `requestId` | string | Unique request ID for the bulk signing operation |

### Status Codes

The POS Digicert service uses the following status codes:

| Code | Constant | Description |
|------|----------|-------------|
| 901 | `SUCCESS` | Operation completed successfully |
| 902 | `INVALID_PARAMETER` | Invalid parameters provided |
| 903 | `INTERNAL_SERVER_ERROR` | Internal server error occurred |
| 904 | `FILE_SERVER_ACCESS_ERROR` | Unable to access file server |
| 905 | `INVALID_SIGNING_PAGE` | Invalid signing page specified |
| 906 | `INVALID_QR_VALUE` | Invalid QR code value |
| 907 | `QR_TRANSACTION_ERROR` | Error processing QR transaction |
| 908 | `FILE_LOCKED` | File is currently locked |
| 800 | `ROAMING_OPERATION_FAILED` | Roaming operation failed |
| 805 | `USER_NOT_FOUND` | User not found in the system |
| 808 | `CERTIFICATE_REVOKED` | Certificate has been revoked |
| 809 | `CERTIFICATE_NOT_FOUND` | Certificate not found |
| 810 | `ORGANIZATION_NOT_FOUND` | Organization ID does not exist |
| 811 | `CERTIFICATE_EXPIRED` | Certificate has expired |
| 703 | `INVALID_BULK_SESSION` | Invalid bulk ID session |
| 802 | `USER_BLOCKED` | User is blocked |

### Error Handling

The POS Digicert service may throw the following error types:

1. `PosDigicertDigitalSigningValidationError`: Thrown when required parameters are missing or invalid.
2. `PosDigicertDigitalSigningError`: Thrown for general digital signing errors, including SOAP errors and status code errors.

```javascript
try {
  const result = await signingService.verifyRoamingCert({
    userId: 'user123',
    orgId: 'org456'
  });
} catch (error) {
  if (error.name === 'PosDigicertDigitalSigningValidationError') {
    console.error('Validation error:', error.message);
    // Handle validation errors (e.g., missing parameters)
  } else if (error.name === 'PosDigicertDigitalSigningError') {
    console.error('Digital signing error:', error.message);
    // Handle digital signing errors (e.g., SOAP errors, invalid status codes)
  } else {
    console.error('Unexpected error:', error);
    // Handle other errors
  }
}
```

## SFTP Service

The `SftpService` class provides methods for interacting with SFTP servers for file operations.

### Configuration

```javascript
const { SftpService } = require('nestjs-pos-digicert');

const sftpService = new SftpService({
  host: 'sftp.example.com',    // Required: SFTP server hostname
  username: 'your_username',   // Required: SFTP username
  password: 'your_password',   // Required: SFTP password
  port: 22                     // Required: SFTP port (typically 22)
});
```

#### Configuration Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `host` | string | Yes | SFTP server hostname or IP address |
| `username` | string | Yes | Username for SFTP authentication |
| `password` | string | Yes | Password for SFTP authentication |
| `port` | number | Yes | SFTP server port (typically 22) |

### Methods

`upload()`

Uploads a file to the SFTP server.

```javascript
const fs = require('fs');

const fileStream = fs.createReadStream('/path/to/local/file.txt');
const result = await sftpService.upload(fileStream, '/remote/path/file.txt');
```

##### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fileStream` | Readable | Yes | Readable stream of the file to upload |
| `destination` | string | Yes | Destination path on the SFTP server |

##### Response

Returns `true` if the upload was successful.

`download()`

Downloads a file from the SFTP server.

```javascript
const fs = require('fs');

const writeStream = fs.createWriteStream('/path/to/local/file.txt');
const result = await sftpService.download('/remote/path/file.txt', writeStream);
```

##### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | string | Yes | Source path on the SFTP server |
| `dst` | Writable | Yes | Writable stream where the file will be downloaded |

##### Response

Returns the file content if the download was successful.

`delete()`

Deletes a file from the SFTP server.

```javascript
const result = await sftpService.delete('/remote/path/file.txt');
```

##### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `remoteFilePath` | string | Yes | Path to the file on the SFTP server |

##### Response

Returns the result of the delete operation.

### Error Handling

The SFTP service throws `SftpError` for any SFTP-related errors:

```javascript
try {
  await sftpService.upload(fileStream, '/remote/path/file.txt');
} catch (error) {
  if (error.name === 'SftpError') {
    console.error('SFTP error:', error.message);
    // Handle SFTP errors (e.g., connection issues, file not found)
  } else {
    console.error('Unexpected error:', error);
    // Handle other errors
  }
}
```

## TypeScript Support

This library includes TypeScript definitions for all classes, methods, and interfaces:

```typescript
import { 
  PosDigicertDigitalSigning, 
  SftpService,
  PosDigicertOptions,
  SftpOptions,
  SigningDocumentStatus,
  SigningDocumentMessages,
  
  // Interfaces for responses
  BaseResponse,
  VerifyRoamingCertResponse,
  SignRoamingPdfConfigDResponse,
  RequestBulkIdResponse,
  SignRoamingPdfConfigDBulkResponse,
  
  // Interfaces for inputs
  SignRoamingPdfConfigDInput,
  SignRoamingPdfConfigDBulkInput,
  RequestBulkInput,
  VerifyCertInput,
  ValidationParameters,
  
  // Error types
  PosDigicertDigitalSigningError,
  PosDigicertDigitalSigningValidationError,
  SftpError
} from 'nestjs-pos-digicert';
```

## Complete Examples

### Digital Signing Workflow Example

```javascript
const { PosDigicertDigitalSigning } = require('nestjs-pos-digicert');

async function completeSigningWorkflow() {
  const signingService = new PosDigicertDigitalSigning({
    url: 'https://api.digicert-service.com/endpoint',
    projectCode: 'PROJ001',
    organizationId: 'ORG001',
    fileServerId: 'FS001',
    userId: 'USER001'
  });

  try {
    // 1. Verify certificate
    console.log('Verifying certificate...');
    const certResult = await signingService.verifyRoamingCert({});
    console.log(`Certificate verified: ${certResult.statusMessage}`);

    // 2. Sign a document
    console.log('Signing document...');
    const signResult = await signingService.signRoamingPdfConfigD({
      source: '/documents/contract.pdf',
      dest: '/documents/signed_contract.pdf',
      signerXyPage: '1,100,100',
      successUrl: 'https://myapp.com/signing/success',
      cancelUrl: 'https://myapp.com/signing/cancel',
      signerImagePath: '/signatures/user001.png',
      qrValueOnline: 'QR_ONLINE_VALUE',
      qrPosition: '1,400,100',
      qrSize: 100,
      dtsFlag: 1,
      remark: 'Contract signed on March 18, 2025'
    });
    
    console.log(`Document signed: ${signResult.statusMessage}`);
    console.log(`Signing request ID: ${signResult.requestId}`);
    console.log(`Signing URL: ${signResult.spUrl}`);

    return signResult;
  } catch (error) {
    console.error('Signing workflow failed:', error.message);
    throw error;
  }
}

// Execute the workflow
completeSigningWorkflow()
  .then(result => console.log('Workflow completed successfully'))
  .catch(error => console.error('Workflow failed:', error));
```

### Bulk Signing Workflow Example

```javascript
const { PosDigicertDigitalSigning } = require('nestjs-pos-digicert');

async function completeBulkSigningWorkflow() {
  const signingService = new PosDigicertDigitalSigning({
    url: 'https://api.digicert-service.com/endpoint',
    projectCode: 'PROJ001',
    organizationId: 'ORG001',
    fileServerId: 'FS001',
    userId: 'USER001'
  });

  try {
    // 1. Request a bulk ID
    console.log('Requesting bulk ID...');
    const bulkResult = await signingService.requestBulkId({
      code: 'BATCH_MAR2025',
      successUrl: 'https://myapp.com/bulk/success',
      cancelUrl: 'https://myapp.com/bulk/cancel'
    });
    
    console.log(`Bulk ID requested: ${bulkResult.statusMessage}`);
    console.log(`Bulk ID: ${bulkResult.bulkId}`);
    console.log(`Bulk signing URL: ${bulkResult.spUrl}`);

    // 2. Sign documents in bulk
    const documents = [
      { source: '/documents/contract1.pdf', dest: '/documents/signed_contract1.pdf' },
      { source: '/documents/contract2.pdf', dest: '/documents/signed_contract2.pdf' },
      { source: '/documents/contract3.pdf', dest: '/documents/signed_contract3.pdf' }
    ];

    console.log('Signing documents in bulk...');
    const bulkSignResults = await Promise.all(documents.map(doc => 
      signingService.signRoamingPdfConfigDBulk({
        source: doc.source,
        dest: doc.dest,
        signerXyPage: '1,100,100',
        bulkId: bulkResult.bulkId,
        dtsFlag: 1,
        signerImagePath: '/signatures/user001.png',
        qrValueSegment1: 'QR_SEGMENT1',
        qrValueSegment2: 'QR_SEGMENT2',
        qrPosition: '1,400,100',
        qrSize: 100,
        remark: 'Bulk signed on March 18, 2025'
      })
    ));
    
    bulkSignResults.forEach((result, index) => {
      console.log(`Document ${index + 1} signed: ${result.statusMessage}`);
      console.log(`Request ID: ${result.requestId}`);
    });

    return bulkSignResults;
  } catch (error) {
    console.error('Bulk signing workflow failed:', error.message);
    throw error;
  }
}

// Execute the workflow
completeBulkSigningWorkflow()
  .then(result => console.log('Bulk workflow completed successfully'))
  .catch(error => console.error('Bulk workflow failed:', error));
```

### SFTP File Operations Example

```javascript
const { SftpService } = require('nestjs-pos-digicert');
const fs = require('fs');
const path = require('path');

async function performFileOperations() {
  const sftpService = new SftpService({
    host: 'sftp.example.com',
    username: 'ftpuser',
    password: 'password123',
    port: 22
  });

  try {
    // 1. Upload a file
    console.log('Uploading file...');
    const localFilePath = path.join(__dirname, 'documents', 'report.pdf');
    const remoteFilePath = '/reports/report_2025_03_18.pdf';
    
    const fileStream = fs.createReadStream(localFilePath);
    await sftpService.upload(fileStream, remoteFilePath);
    console.log('File uploaded successfully');

    // 2. Download a file
    console.log('Downloading file...');
    const downloadPath = path.join(__dirname, 'downloads', 'downloaded_report.pdf');
    const writeStream = fs.createWriteStream(downloadPath);
    
    await sftpService.download(remoteFilePath, writeStream);
    console.log('File downloaded successfully');

    // 3. Delete a file
    console.log('Deleting file...');
    await sftpService.delete(remoteFilePath);
    console.log('File deleted successfully');

    return true;
  } catch (error) {
    console.error('File operations failed:', error.message);
    throw error;
  }
}

// Execute the operations
performFileOperations()
  .then(result => console.log('File operations completed successfully'))
  .catch(error => console.error('File operations failed:', error));
```