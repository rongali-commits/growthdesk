export function cleanLead(body: Record<string, unknown> | null, publicForm = false) {
  if (!body) return null;
  const field = (key: string, max: number) => typeof body[key] === 'string' && body[key].length <= max ? body[key].trim() : '';
  const name = field('name', 120); const email = field('email', 254); const service = field('service', 300);
  const value = publicForm ? 0 : Number(body.value ?? 0);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !service || !Number.isFinite(value) || value < 0 || value > 1000000000) return null;
  return { name, email, service, phone: field('phone', 40), source: publicForm ? 'Website enquiry' : field('source', 100) || 'Manual', value };
}
