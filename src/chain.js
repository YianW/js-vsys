/**
 * Chain module provides functionalities for the chain in VSYS blockchain network..
 * @module chain
 */

'use strict';

import * as api from './api.js';
import * as en from './utils/enum.js';

/** ChainID is the Enum class for chain ID */
export class ChainID extends en.Enum {
  static elems = {
    MAIN_NET: 'M',
    TEST_NET: 'T',
  };
  static _ = this.createElems();

  /**
   * fromStr returns a ChainID instance by the given string.
   * @param {string} s - The string for chain ID.
   * @returns {ChainID} The ChainID instance.
   */
  static fromStr(s) {
    for (const [k, v] of Object.entries(this.elems)) {
      if (v === s) {
        return this[k];
      }
    }
    throw new Error('Invalid chain ID string');
  }
}

/** Chain is the class for chain in VSYS blockchain network */
export class Chain {
  /**
   * @param {api.NodeAPI} nodeApi - The NodeAPI instance.
   * @param {ChainID} chainId=ChainID.TEST_NET
   */
  constructor(nodeApi, chainId = ChainID.TEST_NET) {
    this.api = nodeApi;
    this.chainId = chainId;
  }

  /**
   * getHeight gets the height of the current chain.
   * @returns {number} The height of the chain.
   */
  async getHeight() {
    const data = await this.api.blocks.getHeight();
    return data['height'];
  }
}