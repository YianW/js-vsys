'use strict'

import assert from 'assert/strict';
import * as ut from './utils.js';

beforeAll(function() {
  this.HOST = process.env.JS_VSYS_HOST;
  // The time in seconds it takes for a block to be packed.
  this.AVG_BLOCK_DELAY = process.env.JS_VSYS_AVG_BLOCK_DELAY;
  this.SEED = process.env.JS_VSYS_SEED;
  this.SUPERNODE_ADDR = process.env.JS_VSYS_SUPERNODE_ADDR;

  this.api = jv.NodeAPI.new(this.HOST);
  this.chain = jv.Chain(this.api);
  this.seed = jv.Seed(this.SEED);
  this.wallet = jv.Wallet(this.seed);
  this.acnt0 = this.wallet.getAccount(this.chain, 0);
  this.acnt1 = this.wallet.getAccount(this.chain, 1);
  this.acnt2 = this.wallet.getAccount(this.chain, 2);

  /**
   * waitForBlock waits for the transaction to be packed into a block.
   */
  this.waitForBlock = async function() {
    await ut.sleep(this.AVG_BLOCK_DELAY * 1000);
  };

  /**
   * assertTxStatus asserts the status of the transaction of the given ID matches the given status.
   * @param {string} txId - The transaction ID.
   * @param {string} status - The status of the transaction.
   */
  this.assertTxStatus = async function(txId, status) {
    resp = await this.api.tx.getInfo(txId);
    assert.deepEqual(resp.status, status);
  };

  /**
   * assertTxSuccess asserts the status of the transaction of the given ID is success.
   * @param {string} txId - The transaction ID.
   */
  this.assertTxSuccess = async function(txId) {
    await this.assertTxStatus(txId, 'Success');
  };

  /**
   * getTokBal gets the token balance of the given token ID.
   * @param {string} addr - The account address.
   * @param {string} tokId - The token ID.
   * @returns {number} The raw value of the token balance.
   */
  this.getTokBal = async function(addr, tokId) {
    const resp = await this.api.ctrt.getTokBal(addr, tokId);
    return resp.balance;
  };
});