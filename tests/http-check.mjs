import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const origin = 'http://127.0.0.1:3094';
const key = 'local-test-key-never-use-in-production-123456';
const checks = [];
async function request(path, options = {}) { return fetch('http://localhost:3094' + path, { redirect: 'manual', ...options }); }
async function status(path, expected, options) {
  const response = await request(path, options);
  assert.equal(response.status, expected, `${path}: ${response.status} expected ${expected}`);
  checks.push(`${options?.method ?? 'GET'} ${path}: ${expected}`); return response;
}
await status('/health',200);
for (const path of ['/', '/leads', '/inbox', '/clients', '/automations', '/reviews', '/reports', '/settings']) {
  const response = await request(path); const body = await response.text();
  assert.ok(response.status === 307 || response.status === 302 || (body.includes('/login') && !body.includes('Sofia Green')), `private page ${path}`);
  checks.push(`staff page ${path} excludes private content when signed out`);
}
await status('/api/leads',401);
await status('/api/leads',401,{headers:{cookie:'growthdesk_session=forged','x-middleware-subrequest':'middleware'}});
await status('/api/auth/login',403,{method:'POST',headers:{Origin:'https://wrong.example'},body:new URLSearchParams({key})});
await status('/api/auth/login',401,{method:'POST',headers:{Origin:origin},body:new URLSearchParams({key:'incorrect'})});
const login = await status('/api/auth/login',303,{method:'POST',headers:{Origin:origin},body:new URLSearchParams({key})});
const cookie = login.headers.get('set-cookie');assert.ok(cookie.includes('HttpOnly') && cookie.includes('SameSite=Strict') && cookie.includes('Max-Age=28800'));
const session = cookie.split(';')[0];
const headers = {Cookie:session,Origin:origin,'Content-Type':'application/json'};
await status('/api/leads',200,{headers});
await status('/api/leads',403,{method:'POST',headers:{...headers,Origin:'https://wrong.example'},body:'{}'});
await status('/api/leads',400,{method:'POST',headers,body:'{malformed'});
await status('/api/leads',400,{method:'POST',headers,body:JSON.stringify({name:'Sample audit',email:'sample@example.com',service:'QA',value:'Infinity'})});
const created = await status('/api/leads',201,{method:'POST',headers,body:JSON.stringify({name:'Local readiness test',email:'sample@example.com',service:'QA',value:100})});
const lead = await created.json();
await status(`/api/leads/${lead.id}`,200,{method:'PATCH',headers,body:JSON.stringify({status:'qualified'})});
const data=await(await request('/api/leads',{headers})).json();
assert.equal(data.find(row=>row.id===lead.id).status,'qualified');checks.push('created lead persists and changes stage');
await status('/api/enquiries',400,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({name:'Sample',email:'sample@example.com',service:'QA'})});
await status('/api/enquiries',201,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({name:'Local public enquiry',email:'sample@example.com',service:'QA',consent:true,value:99999,source:'forged'})});
const updated=await(await request('/api/leads',{headers})).json();const enquiry=updated.find(row=>row.name==='Local public enquiry');assert.equal(enquiry.value,0);assert.equal(enquiry.source,'Website enquiry');
checks.push('public enquiry saved without accepting forged internal fields');
await status('/api/settings',400,{method:'PUT',headers,body:JSON.stringify({business_name:'Test',support_email:'test@example.com',booking_url:'javascript:alert(1)',brand_color:'#ffffff'})});
await status('/api/auth/logout',303,{method:'POST',headers});
await status('/api/leads',401);
writeFileSync('tests/http-result.json',JSON.stringify({date:new Date().toISOString(),checks},null,2));
console.log(`${checks.length} HTTP security and workflow checks passed`);
