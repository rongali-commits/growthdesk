import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const leads = sqliteTable('leads', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull().default(''),
  service: text('service').notNull(),
  source: text('source').notNull().default('Website assistant'),
  status: text('status').notNull().default('new'),
  value: integer('value').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

export const conversations = sqliteTable('conversations', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  preview: text('preview').notNull(),
  channel: text('channel').notNull(),
  intent: text('intent').notNull(),
  unread: integer('unread', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),
  client: text('client').notNull(),
  project: text('project').notNull(),
  progress: integer('progress').notNull(),
  status: text('status').notNull(),
  nextAction: text('next_action').notNull(),
  invoiceStatus: text('invoice_status').notNull(),
  value: integer('value').notNull(),
  deliverables: integer('deliverables').notNull().default(0),
});

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  customer: text('customer').notNull(),
  service: text('service').notNull(),
  rating: integer('rating').notNull(),
  quote: text('quote').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
});

export const automations = sqliteTable('automations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  trigger: text('trigger').notNull(),
  description: text('description').notNull(),
  runs: integer('runs').notNull().default(0),
  conversion: integer('conversion').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
