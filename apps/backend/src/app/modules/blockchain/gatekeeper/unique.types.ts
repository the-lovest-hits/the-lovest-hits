import { INamespace } from 'protobufjs';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

export enum CollectionMode {
  Nft = 'Nft',
  Fungible = 'Fungible',
  ReFungible = 'ReFungible',
}

export enum CollectionAccess {
  Normal = 'Normal',
  AllowList = 'AllowList',
}

export enum CollectionSchemaVersion {
  ImageURL = 'ImageURL',
  Unique = 'Unique',
}

export enum MetaUpdatePermission {
  ItemOwner = 'ItemOwner',
  Admin = 'Admin',
  None = 'None',
}

export interface CollectionSponsorship {
  address: string;
  isConfirmed: boolean;
}

export interface CollectionLimits {
  accountTokenOwnershipLimit?: number | null;
  sponsoredDataSize?: number | null;
  sponsoredDataRateLimit?: number | null;
  tokenLimit?: number | null;
  sponsorTransferTimeout?: number | null;
  sponsorApproveTimeout?: number | null;
  ownerCanTransfer?: boolean | null;
  ownerCanDestroy?: boolean | null;
  transfersEnabled?: boolean | null;
}

export interface CollectionInfoBase {
  mode?: CollectionMode | `${CollectionMode}`;
  access?: CollectionAccess | `${CollectionAccess}`;
  schemaVersion?: CollectionSchemaVersion | `${CollectionSchemaVersion}`;
  name: string;
  description: string;
  tokenPrefix: string;
  mintMode?: boolean;
  offchainSchema?: string;
  sponsorship?: CollectionSponsorship | null;
  limits?: CollectionLimits;
  constOnChainSchema?: INamespace | null;
  variableOnChainSchema?: string | null;
  metaUpdatePermission?: MetaUpdatePermission | `${MetaUpdatePermission}`;
  transfersEnabled?: boolean; // todo add to sdk
  owner: string // todo add to sdk
}

export interface CollectionInfo extends CollectionInfoBase {
  id: number;
  owner: string;
  tokensCount: number;
}

export interface TokenInfo {
  id: number;
  collectionId: number;
  url: string | null;
  constData: AnyObject | null;
  variableData: string | null;
  owner: string;
}

export interface CreateCollectionArguments extends CollectionInfoBase {
  address: string;
}

export interface CreateTokenArguments {
  collectionId: number;
  address: string;
  constData: AnyObject;
}

export type TokenPayload =
  | {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  NFT: any;
}
  | {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  Fungible: any;
}
  | {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  ReFungible: any;
};
