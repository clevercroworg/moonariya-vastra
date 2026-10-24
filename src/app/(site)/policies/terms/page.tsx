import type { Metadata } from "next";
import Link from "next/link";
import { BusinessDetails, PolicyLayout, PolicySection } from "@/components/policies/PolicyLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you browse and shop on the Monaariya Vastra website.",
};

export default function TermsPage() {
  return (
    <PolicyLayout
      current="/policies/terms"
      title="Terms & Conditions"
      intro="Please read these terms carefully. By using this website or placing an order with Monaariya Vastra, you agree to them."
    >
      <PolicySection id="about" title="1. About these terms">
        <p>
          This website is owned and operated by <strong>Monaariya Vastra</strong>. These terms apply to everyone who
          visits the website or buys from us, together with our <Link href="/policies/privacy">Privacy Policy</Link>,{" "}
          <Link href="/policies/refund">Cancellation &amp; Refund Policy</Link> and{" "}
          <Link href="/policies/shipping">Shipping &amp; Delivery Policy</Link>.
        </p>
      </PolicySection>

      <PolicySection id="eligibility" title="2. Using the website">
        <ul>
          <li>You must be at least 18 years old, or use the website under the supervision of a parent or guardian.</li>
          <li>The details you provide — name, phone number, email and address — must be accurate and complete.</li>
          <li>You agree not to misuse the website, attempt to gain unauthorised access, or use it for any unlawful purpose.</li>
        </ul>
      </PolicySection>

      <PolicySection id="products" title="3. Our products">
        <ul>
          <li>We make every effort to show our sarees accurately. Because each saree is woven and finished by hand, small variations in weave, colour and motif are natural and are not defects.</li>
          <li>Colours may look slightly different on your screen because of device and lighting settings.</li>
          <li>Saree length, blouse piece and fabric details are listed on each product page.</li>
          <li>All products are subject to availability. If an item becomes unavailable after you order, we will inform you and refund any amount paid in full.</li>
        </ul>
      </PolicySection>

      <PolicySection id="pricing" title="4. Prices">
        <ul>
          <li>All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise.</li>
          <li>Optional finishing add-ons, such as falls &amp; pico stitching or tassels, are charged as shown on the product page.</li>
          <li>We may change prices at any time. The price shown when you place your order is the price you pay.</li>
          <li>If a product is listed at an obviously incorrect price because of an error, we may cancel the order and refund you in full.</li>
        </ul>
      </PolicySection>

      <PolicySection id="orders" title="5. Orders">
        <p>
          An order is confirmed once payment is received (or, for cash on delivery, once we confirm the order with you).
          We may decline or cancel an order — for example, if an item is out of stock, the address cannot be served, or
          the order appears fraudulent. If we cancel, any amount paid is refunded in full.
        </p>
      </PolicySection>

      <PolicySection id="payments" title="6. Payments">
        <ul>
          <li>Online payments are processed securely by Razorpay. We accept UPI, debit and credit cards, net banking and wallets, as available at checkout.</li>
          <li>Cash on delivery may be offered for selected locations and order values.</li>
          <li>We do not store your card, UPI or banking details. Your payment is also subject to the terms of Razorpay and your bank.</li>
        </ul>
      </PolicySection>

      <PolicySection id="shipping" title="7. Shipping, cancellations and refunds">
        <p>
          Delivery timelines and charges are explained in our <Link href="/policies/shipping">Shipping &amp; Delivery Policy</Link>.
          Cancellations, damaged items and refunds are covered by our{" "}
          <Link href="/policies/refund">Cancellation &amp; Refund Policy</Link>.
        </p>
      </PolicySection>

      <PolicySection id="ip" title="8. Intellectual property">
        <p>
          All content on this website — including photographs, designs, text, logos and the Monaariya Vastra name — belongs
          to Monaariya Vastra and may not be copied, reproduced or used without our written permission.
        </p>
      </PolicySection>

      <PolicySection id="liability" title="9. Limitation of liability">
        <p>
          We are not liable for indirect or consequential losses arising from the use of this website or our products.
          Our total liability for any order is limited to the amount you paid for that order. Nothing in these terms
          limits rights you have under Indian consumer protection law.
        </p>
      </PolicySection>

      <PolicySection id="law" title="10. Governing law">
        <p>
          These terms are governed by the laws of India. Any dispute will be subject to the jurisdiction of the courts
          where Monaariya Vastra’s business is registered. We encourage you to contact us first — most concerns can be
          resolved quickly.
        </p>
      </PolicySection>

      <PolicySection id="changes" title="11. Changes to these terms">
        <p>We may update these terms from time to time. The version on this page at the time of your order applies to that order.</p>
      </PolicySection>

      <PolicySection id="contact" title="12. Contact us">
        <BusinessDetails />
      </PolicySection>
    </PolicyLayout>
  );
}
