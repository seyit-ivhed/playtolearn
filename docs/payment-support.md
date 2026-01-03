# Payment & DLC Support Plan

This document outlines the technical design and implementation strategy for integrating Stripe payments for the Swedish market and establishing a scalable data model for future DLCs.

## Overview
The goal is to provide a seamless "one-time payment" experience for Swedish users (89 SEK) while ensuring the system can handle multiple content packs (DLCs) in the future.

## Payment Strategy (Swedish Market)
- **Currency**: SEK (Swedish Krona)
- **Price**: 89 SEK (VAT inclusive)
- **Payment Methods**: 
  - Credit/Debit Cards
  - **Klarna**: High conversion in Sweden
  - **Swish**: Essential for the Swedish market
- **Tax**: Handled via Stripe Tax (25% VAT for digital services in Sweden)

## Technical Architecture

### 1. Data Model (DLC-Ready)
Instead of a binary `has_premium` flag, we use an entitlement-based system:
- `content_packs`: Definitions of available products (ID, Name, Price, Metadata).
- `player_entitlements`: Junction table linking `player_id` to `content_pack_id`.
- `player_profiles.role`: Added roles (`player`, `tester`, `admin`) to allow playtesters to bypass payment.

### 2. Backend (Supabase Edge Functions)
- **`create-payment-intent`**: Generates Stripe client secret with SEK and Swedish payment methods.
- **`stripe-webhook`**: Authoritative listener for `payment_intent.succeeded` to grant entitlements.
- **`access-middleware`**: Utility to check if a user owns specific content or has a `tester` role.

### 3. Frontend Gating Logic
- **`premium.store`**: Centralized Zustand store for ownership state.
- **`AdventurePage`**: Dynamic UI updates (lock icons, paywall triggers) based on the entitlement store.

## Playtesting & Internal Access
To enable testing without actual payments:
- Set `player_profiles.role = 'tester'` for internal accounts.
- The system will bypass all content gates for users with this role.

## Refund Policy & Logic
- **Policy**: Full refund if requested early (e.g., before Adventure 3).
- **Automation**: Manual processing via Stripe dashboard for MVP.
- **Verification**: Check `game_states` before approving refunds to ensure content wasn't "excessively consumed".

## Security Best Practices
- **No Client-Side Writes**: Only the webhook can grant entitlements.
- **Identity Verification**: Webhook signatures are mandatory.
- **Account Linking**: Require account upgrade (linking email) before purchase to ensure persistence.
