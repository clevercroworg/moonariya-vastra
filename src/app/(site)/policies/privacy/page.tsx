import type { Metadata } from "next";
import Link from "next/link";
import { BusinessDetails, PolicyLayout, PolicySection } from "@/components/policies/PolicyLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Monaariya Vastra collects, uses and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      current="/policies/privacy"
      title="Privacy Policy"
      intro="Your trust matters to us. This policy explains what information we collect when you shop with Monaariya Vastra, how we use it and how we keep it safe."
    >
      <PolicySection id="who-we-are" title="1. Who we are">
        <p>
          This website is operated by <strong>Monaariya Vastra</strong> (“we”, “us”, “our”). By using this website or
          placing an order, you agree to the practices described in this policy.
        </p>
      </PolicySection>

      <PolicySection id="information" title="2. Information we collect">
        <ul>
          <li><strong>Details you give us</strong> — your name, phone number, email address, and billing and delivery address when you place an order or contact us.</li>
          <li><strong>Order details</strong> — the sarees and add-ons you buy, order value and order history.</li>
          <li><strong>Payment information</strong> — payments are processed by our payment partner, Razorpay. We do not see or store your full card number, CVV, UPI PIN or net-banking password.</li>
          <li><strong>Messages</strong> — conversations with us on WhatsApp, phone or email about your order.</li>
          <li><strong>Device and usage data</strong> — basic technical information such as browser type and pages visited, used to keep the website secure and working well.</li>
        </ul>
      </PolicySection>

      <PolicySection id="use" title="3. How we use your information">
        <ul>
          <li>To process, pack, ship and deliver your order, and to keep you updated about it.</li>
          <li>To process payments, refunds and cancellations.</li>
          <li>To answer your questions and provide customer support.</li>
          <li>To prevent fraud and keep our website and customers safe.</li>
          <li>To meet our legal, tax and accounting obligations.</li>
          <li>To share new arrivals and offers — only if you have chosen to receive them. You can opt out at any time.</li>
        </ul>
      </PolicySection>

      <PolicySection id="sharing" title="4. Who we share it with">
        <p>We never sell or rent your personal information. We share only what is needed with trusted partners who help us run the shop:</p>
        <ul>
          <li><strong>Payment partner</strong> — Razorpay, to process online payments securely.</li>
          <li><strong>Courier and logistics partners</strong> — your name, phone number and address, to deliver your order.</li>
          <li><strong>Technology providers</strong> — website hosting and messaging services that store or transmit data on our behalf.</li>
          <li><strong>Authorities</strong> — when required by law, or to protect our rights and prevent fraud.</li>
        </ul>
      </PolicySection>

      <PolicySection id="cookies" title="5. Cookies and local storage">
        <p>
          Your shopping bag, wishlist and recently viewed sarees are saved in your own browser so they are still there
          when you return. This information stays on your device. You can clear it at any time from your browser
          settings; the website will still work, but your saved items will be removed.
        </p>
      </PolicySection>

      <PolicySection id="security" title="6. How we protect your information">
        <p>
          The website uses secure, encrypted connections (HTTPS). Online payments are handled on Razorpay’s PCI-DSS
          compliant platform. Access to customer information is limited to the people who need it to fulfil your order.
        </p>
      </PolicySection>

      <PolicySection id="retention" title="7. How long we keep it">
        <p>
          We keep order and payment records for as long as needed to serve you and as required by Indian tax and
          accounting laws. Other information is deleted when it is no longer needed.
        </p>
      </PolicySection>

      <PolicySection id="rights" title="8. Your choices and rights">
        <ul>
          <li>Ask for a copy of the personal information we hold about you.</li>
          <li>Ask us to correct or update your details.</li>
          <li>Ask us to delete your information, unless we must keep it by law.</li>
          <li>Stop receiving promotional messages at any time.</li>
        </ul>
        <p>To make a request, contact us using the details below. We will respond within 30 days.</p>
      </PolicySection>

      <PolicySection id="children" title="9. Children">
        <p>Our website is intended for adults. We do not knowingly collect information from anyone under 18.</p>
      </PolicySection>

      <PolicySection id="changes" title="10. Changes to this policy">
        <p>
          We may update this policy from time to time. The latest version is always on this page, with the date it was
          last updated. Please also read our <Link href="/policies/terms">Terms &amp; Conditions</Link>.
        </p>
      </PolicySection>

      <PolicySection id="contact" title="11. Contact us">
        <p>For any privacy question or request, please reach us at:</p>
        <BusinessDetails />
      </PolicySection>
    </PolicyLayout>
  );
}
