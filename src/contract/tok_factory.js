/**
 * token module provides factory methods to create a token contract(NFT included) instance.
 * @module contract/tok_ctrt
 */

'use strict';

import * as ctrt from './ctrt.js';
import * as acnt from '../account.js';
import * as md from '../model.js';
import * as tx from '../tx_req.js';
import * as de from '../data_entry.js';
import * as en from '../utils/enum.js';
import * as tok_ctrt_no_split from './tok_ctrt_no_split.js';
import * as tok_ctrt_split from './tok_ctrt_split.js';
import * as tok_ctrt_v2 from './tok_ctrt_v2.js';
import * as nft_ctrt from './nft_ctrt.js';
import * as nft_ctrt_v2 from './nft_ctrt_v2.js';
import * as sys_ctrt from './sys_ctrt.js';

export class TokCtrtType extends en.Enum {
  static elems = {
    NFT : "NonFungibleContract",
    NFT_V2_BLACKLIST : "NFTContractWithBlacklist",
    NFT_V2_WHITELIST : "NFTContractWithWhitelist",
    TOK_NO_SPLIT : "TokenContract",
    TOK_WITH_SPLIT : "TokenContractWithSplit",
    TOK_V2_WHITELIST : "TokenContractWithWhitelist",
    TOK_V2_BLACKLIST : "TokenContractWithBlacklist",
  }
  static _ = this.createElems();
}

function Map() {
    this.keys = new Array();
    this.values= new Array();


}

export class TokCtrtMap{

    static MAP = new Map([
        [TokCtrtType.NFT, nft_ctrt.NFTCtrt],
        [TokCtrtType.NFT_V2_BLACKLIST, nft_ctrt_v2.NFTCtrtV2Blacklist],
        [TokCtrtType.NFT_V2_WHITELIST, nft_ctrt_v2.NFTCtrtV2Whitelist],
        [TokCtrtType.TOK_NO_SPLIT, tok_ctrt_no_split.TokCtrt],
        [TokCtrtType.TOK_WITH_SPLIT, tok_ctrt_split.TokCtrtWithSplit],
        [TokCtrtType.TOK_V2_WHITELIST, tok_ctrt_v2.TokCtrtV2Whitelist],
        [TokCtrtType.TOK_V2_BLACKLIST, tok_ctrt_v2.TokCtrtV2Blacklist],
    ]);

    static get_tok_ctrt_cls(type) {
        return this.MAP[type];
    }
}

async function fromTokId(tokId,chain) {
  if(tokId.isMainnetVsysTok) {
    return sys_ctrt.SysCtrt.forMainnet(chain);
  }
  if(tokId.isTestnetVsysTok) {
    return sys_ctrt.SysCtrt.forTestnet(chain);
  }

  tokInfo = await chain.api.ctrt.getTokInfo(tokId.data);
  ctrtId = tokInfo["contractId"];

  ctrtInfo = await chain.api.ctrt.getCtrtInfo(ctrtId);
  ctrtType = tokInfo["type"];
  type = TokCtrtType(ctrtType);

  cls = TokCtrtMap.get_tok_ctrt_cls(type);
  return cls(ctrtId, chain);
}