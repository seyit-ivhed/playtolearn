-- Seed initial data
INSERT INTO public.content_packs (id) VALUES ('premium_base') ON CONFLICT DO NOTHING;
INSERT INTO public.content_pack_prices (content_pack_id, currency, amount_cents)
VALUES ('premium_base', 'SEK', 8900)
ON CONFLICT (content_pack_id, currency) DO UPDATE SET amount_cents = EXCLUDED.amount_cents;
