
The Checkout Page (`/premium` or similar independent route) MUST remain a separate HTML context from the main Single Page Application (SPA).

1. **Reason**: To prevent Stripe and other payment providers from injecting cookies or scripts that could track users across the main educational application.
2. **Implementation**: 
   - Navigation to the checkout page should use `window.location.href` or an `<a>` tag, causing a full page reload/navigation.
   - Navigation back to the game should also use `window.location.href` to ensure a clean state.
   - Do NOT use `useNavigate`, `Link`, or other client-side routing methods for entering or exiting the checkout flow.
