#!/usr/bin/env node
import assert from "node:assert/strict";
import {
  PVP_ONE_ROOM_HOST_MESSAGE,
  PVP_ACTIVE_MATCH_BLOCK_MESSAGE,
  PVP_JOIN_WHILE_HOSTING_MESSAGE,
  resolveOpenRoomBlock,
  resolveJoinRoomBlock,
} from "../js/pvpErrors.js";

assert.equal(resolveOpenRoomBlock(), null);
assert.equal(resolveJoinRoomBlock(), null);

assert.equal(
  resolveOpenRoomBlock({ waitingCount: 1 }),
  PVP_ONE_ROOM_HOST_MESSAGE
);
assert.equal(
  resolveOpenRoomBlock({ hasActiveMatch: true }),
  PVP_ACTIVE_MATCH_BLOCK_MESSAGE
);
assert.equal(
  resolveOpenRoomBlock({ waitingCount: 1, hasActiveMatch: true }),
  PVP_ACTIVE_MATCH_BLOCK_MESSAGE
);

assert.equal(
  resolveJoinRoomBlock({ waitingCount: 1 }),
  PVP_JOIN_WHILE_HOSTING_MESSAGE
);
assert.equal(
  resolveJoinRoomBlock({ hasActiveMatch: true }),
  PVP_ACTIVE_MATCH_BLOCK_MESSAGE
);

console.log("test-pvp-one-room-limit: ok");
