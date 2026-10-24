import type { Metadata } from "next";
import Link from "next/link";
import { BusinessDetails, PolicyLayout, PolicySection } from "@/components/policies/PolicyLayout";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "Delivery areas, timelines and charges for Monaariya Vastra orders.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      current="/policies/shipping"
      title="Shipping & Delivery Policy"
      intro="Every saree is checked, folded with care and packed securely before it travels to you."
    >
      <PolicySection id="where" title="1. Where we deliver">
        <p>
          We deliver across India through trusted courier partners. We do not ship internationally at the moment — please
          contact us if you would like to order from outside India.
        </p>
      </PolicySection>

      <PolicySection id="charges" title="2. Shipping charges">
        <p>
          Shipping is <strong>free on all orders within India</strong>. Any change to this will be shown clearly at checkout
          before you pay.
        </p>
      </PolicySection>

      <PolicySection id="timelines" title="3. Delivery timelines">
        <ul>
          <li>Orders are usually delivered within <strong>7–15 working days</strong> of order confirmation, depending on your location.</li>
          <li>Orders with finishing add-ons (falls &amp; pico stitching, tassels and similar) include the time needed for this work within the same timeline.</li>
          <li>Delivery may take longer during festivals, sales, extreme weather or other events beyond our control. We will keep you informed of any delay.</li>
        </ul>
      </PolicySection>

      <PolicySection id="tracking" title="4. Tracking your order">
        <p>
          Once your order is dispatched, we share the courier name and tracking details by WhatsApp, SMS or email, so you
          can follow your parcel until it arrives.
        </p>
      </PolicySection>

      <PolicySection id="cod" title="5. Cash on delivery">
        <p>Cash on delivery is available for selected pin codes and order values. Availability is confirmed when you place your order.</p>
      </PolicySection>

      <PolicySection id="address" title="6. Delivery address">
        <ul>
          <li>Please make sure your address, pin code and phone number are complete and correct. We cannot be responsible for delays caused by incorrect details.</li>
          <li>If a delivery fails because the address is wrong or nobody is available after the courier’s attempts, we will contact you to arrange re-delivery. Additional courier charges may apply.</li>
        </ul>
      </PolicySection>

      <PolicySection id="receiving" title="7. Receiving your parcel">
        <p>
          Please do not accept a parcel that looks opened or tampered with. Record a complete unboxing video when you open
          your package — it is required for any damage claim under our{" "}
          <Link href="/policies/refund">Cancellation &amp; Refund Policy</Link>.
        </p>
      </PolicySection>

      <PolicySection id="contact" title="8. Questions about delivery">
        <BusinessDetails />
      </PolicySection>
    </PolicyLayout>
  );
}
