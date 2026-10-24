import type { Metadata } from "next";
import { BusinessDetails, PolicyLayout, PolicySection } from "@/components/policies/PolicyLayout";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description: "How cancellations, damaged items and refunds work at Monaariya Vastra.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyLayout
      current="/policies/refund"
      title="Cancellation & Refund Policy"
      intro="We check every saree carefully before it leaves us. If something isn’t right, here is exactly how cancellations and refunds work."
    >
      <PolicySection id="summary" title="At a glance">
        <ul>
          <li><strong>Cancel</strong> within 24 hours of ordering, before dispatch, for a full refund.</li>
          <li><strong>Damaged, defective or wrong item?</strong> Tell us within 48 hours of delivery, with a complete unboxing video.</li>
          <li><strong>No returns or exchanges</strong> for change of mind, colour preference or other personal reasons.</li>
          <li><strong>Refunds</strong> are credited to your original payment method within 5–7 working days of approval.</li>
        </ul>
      </PolicySection>

      <PolicySection id="cancellation" title="1. Cancelling an order">
        <ul>
          <li>You can cancel within <strong>24 hours</strong> of placing your order, as long as it has not been dispatched. Contact us on WhatsApp, phone or email with your order details.</li>
          <li>Orders that have already been dispatched cannot be cancelled.</li>
          <li>If you chose a finishing add-on (falls &amp; pico stitching, tassels and similar), the order cannot be cancelled once the stitching work has started.</li>
          <li>We may cancel an order if an item is unavailable or cannot be delivered to your address. In that case you receive a full refund.</li>
        </ul>
      </PolicySection>

      <PolicySection id="returns" title="2. Returns and exchanges">
        <p>
          Because our sarees are handcrafted and carefully inspected before dispatch, we do not accept returns or exchanges
          for change of mind, colour or size preference, or minor variations in weave and colour that are natural to
          handmade products.
        </p>
      </PolicySection>

      <PolicySection id="damaged" title="3. Damaged, defective or wrong items">
        <p>If your saree arrives damaged or defective, or you received the wrong item:</p>
        <ul>
          <li>Contact us within <strong>48 hours</strong> of delivery.</li>
          <li>Share a <strong>complete, unedited unboxing video</strong>, starting from the sealed package. A full unboxing video is mandatory for any damage claim.</li>
          <li>Keep the saree unused and unwashed, with all tags and the original packaging.</li>
        </ul>
        <p>
          Once we verify the issue, we will offer a replacement (subject to availability) or a full refund, including any
          add-on charges. If we ask you to send the item back, we will arrange the pickup or reimburse the shipping cost.
        </p>
      </PolicySection>

      <PolicySection id="refunds" title="4. Refund timelines">
        <ul>
          <li>Approved refunds are initiated within <strong>2 working days</strong>.</li>
          <li>Online payments are refunded to the <strong>original payment method</strong> (UPI, card, net banking or wallet) through Razorpay. The amount usually reaches your account within <strong>5–7 working days</strong>, depending on your bank.</li>
          <li>Cash on delivery orders are refunded by bank transfer or UPI to the account details you share with us.</li>
          <li>We will keep you informed by WhatsApp or email at every step.</li>
        </ul>
      </PolicySection>

      <PolicySection id="non-refundable" title="5. Not eligible for a refund">
        <ul>
          <li>Claims made more than 48 hours after delivery, or without an unboxing video.</li>
          <li>Sarees that have been used, washed, altered or damaged after delivery.</li>
          <li>Natural variations of handmade products, or slight colour differences caused by screens and lighting.</li>
        </ul>
      </PolicySection>

      <PolicySection id="contact" title="6. How to reach us">
        <p>Please include your order details and photos or video when you contact us:</p>
        <BusinessDetails />
      </PolicySection>
    </PolicyLayout>
  );
}
