import assert from 'node:assert/strict';
import test from 'node:test';
import { createSession, validSession, equalSecret, SESSION_SECONDS, sessionFromHeaders } from '../lib/auth-core.ts';
import { cleanLead } from '../lib/lead-input.ts';

const secret = 'local-test-key-never-use-in-production-123456';
test('sessions verify, expire, reject tampering, and invalidate on key rotation', async () => {
  const now = Date.now(); const token = await createSession(secret, now);
  assert.ok(await validSession(token, secret, now));
  assert.equal(await validSession(token, secret, now + SESSION_SECONDS * 1000), false);
  assert.equal(await validSession(token + '0', secret, now), false);
  assert.equal(await validSession(token.replace(/^\d/, '9'), secret, now), false);
  assert.equal(await validSession(token, secret + 'rotated', now), false);
  assert.equal(await validSession(token, 'short', now), false);
  assert.equal(await equalSecret(secret, secret), true);
  assert.equal(await equalSecret(secret, 'incorrect'), false);
});
test('cookie parser selects only the named session', () => {
  assert.equal(sessionFromHeaders(new Headers({cookie: 'other=1; growthdesk_session=value; another=2'})), 'value');
  assert.equal(sessionFromHeaders(new Headers({cookie: 'fake_growthdesk_session=value'})), '');
});
test('lead validation bounds input and prevents public revenue/source spoofing', () => {
  const lead = {name:' Test ',email:'test@example.com',service:' Setup ',value:99,source:'Manual'};
  assert.equal(cleanLead(lead).name,'Test');
  assert.equal(cleanLead({...lead,email:'wrong'}),null);
  assert.equal(cleanLead({...lead,name:'x'.repeat(121)}),null);
  for(const value of ['Infinity',NaN,-1,1000000001]) assert.equal(cleanLead({...lead,value}),null);
  assert.equal(cleanLead({...lead,value:Infinity},true).value,0);
  assert.equal(cleanLead(lead,true).source,'Website enquiry');
  assert.equal(cleanLead(null),null);
});
