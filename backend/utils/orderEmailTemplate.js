/**
 * Order Confirmation Email Template
 * Generates HTML email for order confirmation
 */

export const generateOrderConfirmationEmail = (order, user, items) => {
  // Safe item handling
  const itemsHtml = items && Array.isArray(items)
    ? items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px;">
          ${item.name || "Product"}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center; font-size: 14px;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-size: 14px;">
          ₹${(item.price || 0).toFixed(2)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-size: 14px;">
          ₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
        </td>
      </tr>
    `
      )
      .join("")
    : "";

  const addressHtml = order.address
    ? `
      <h3 style="color: #5D4037; margin-bottom: 10px; font-size: 16px;">Delivery Address</h3>
      <p style="margin: 0; color: #333; font-size: 14px;">
        ${order.address.name || ""}<br/>
        ${order.address.street || ""}<br/>
        ${order.address.city || ""}, ${order.address.state || ""} ${order.address.pincode || ""}<br/>
        Phone: ${order.address.phone || ""}<br/>
        Email: ${order.address.email || ""}
      </p>
    `
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #5D4037 0%, #3E2723 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 30px 20px;
        }
        .order-number {
          background-color: #F3ECE5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          text-align: center;
        }
        .order-number p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
        .order-number strong {
          display: block;
          font-size: 20px;
          color: #5D4037;
          margin-top: 5px;
          font-weight: 700;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h3 {
          color: #5D4037;
          border-bottom: 2px solid #D4AF76;
          padding-bottom: 10px;
          margin-bottom: 15px;
          font-size: 16px;
          font-weight: 600;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .items-table thead {
          background-color: #F3ECE5;
        }
        .items-table th {
          padding: 12px;
          text-align: left;
          color: #5D4037;
          font-weight: 600;
          font-size: 13px;
          border-bottom: 2px solid #D4AF76;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
          font-size: 14px;
        }
        .summary {
          background-color: #F3ECE5;
          padding: 15px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .summary-row.total {
          border-top: 2px solid #D4AF76;
          padding-top: 12px;
          margin-top: 12px;
          font-weight: 700;
          font-size: 16px;
          color: #5D4037;
        }
        .alert-box {
          background-color: #E8F5E9;
          border-left: 4px solid #4CAF50;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .alert-box h4 {
          margin: 0 0 8px 0;
          color: #2E7D32;
          font-size: 14px;
          font-weight: 600;
        }
        .alert-box p {
          margin: 5px 0;
          color: #333;
          font-size: 13px;
          line-height: 1.6;
        }
        .footer {
          background-color: #F3ECE5;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #ddd;
        }
        .footer p {
          margin: 5px 0;
          font-size: 12px;
          color: #666;
        }
        .footer a {
          color: #B94C63;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #5D4037 0%, #3E2723 100%);
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 15px 0;
          font-size: 14px;
        }
        .cta-button:hover {
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Greeting -->
          <p style="font-size: 16px; color: #333;">
            Hi <strong>${user.name || "Valued Customer"}</strong>,
          </p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            We're thrilled to confirm that we've received your order! Your order has been successfully placed and will be processed shortly.
          </p>

          <!-- Order Number -->
          <div class="order-number">
            <p>Order ID</p>
            <strong>#${order._id.toString().substring(0, 8).toUpperCase()}</strong>
          </div>

          <!-- Order Items -->
          <div class="section">
            <h3>Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <!-- Order Summary -->
          <div class="section">
            <h3>Order Summary</h3>
            <div class="summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${order.subtotal?.toFixed(2) || "0.00"}</span>
              </div>
              <div class="summary-row">
                <span>Delivery Charges:</span>
                <span>₹${order.deliveryCharges?.toFixed(2) || "0.00"}</span>
              </div>
              <div class="summary-row total">
                <span>Total Amount:</span>
                <span>₹${order.total?.toFixed(2) || "0.00"}</span>
              </div>
              <div class="summary-row" style="margin-top: 10px;">
                <span>Payment Status:</span>
                <span style="color: #4CAF50; font-weight: 600;">✓ ${order.paymentStatus || "Pending"}</span>
              </div>
            </div>
          </div>

          <!-- Delivery Address -->
          ${addressHtml ? `<div class="section">${addressHtml}</div>` : ""}

          <!-- Dispatch Timeline -->
          <div class="alert-box">
            <h4>📦 Dispatch Timeline</h4>
            <p>✓ Order confirmed and received</p>
            <p>📋 Will be processed and dispatched within the next <strong>5 days</strong></p>
            <p>🚚 You will receive your <strong>tracking ID</strong> within <strong>5 days</strong></p>
            <p style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #4CAF50; color: #2E7D32;">
              <strong>Keep this email for your reference. You may need your Order ID for tracking.</strong>
            </p>
          </div>

          <!-- Next Steps -->
          <div class="section">
            <h3>What's Next?</h3>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              1. Your order is being prepared for shipment<br/>
              2. We will send you an email with tracking information within 5 days<br/>
              3. You can track your order status using your Order ID<br/>
              4. If you have any questions, feel free to contact our support team
            </p>
          </div>

          <!-- Contact -->
          <div class="section" style="text-align: center; background-color: #F3ECE5; padding: 20px; border-radius: 5px;">
            <h3 style="margin-top: 0;">Need Help?</h3>
            <p style="margin: 5px 0; font-size: 14px; color: #666;">
              📧 Email: support@livique.co.in<br/>
              🌐 Visit: www.livique.co.in<br/>
              💬 Chat with us anytime!
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>Livique</strong> - Your Fashion & Lifestyle Store</p>
          <p>🏠 Premium fashion accessories and lifestyle products</p>
          <p style="margin-top: 15px; font-size: 11px; color: #999;">
            This is an automated email. Please do not reply to this email. If you have any questions, visit our website or contact our support team.
          </p>
          <p style="margin-top: 10px;">
            © 2025 Livique. All rights reserved. | <a href="https://www.livique.co.in">Visit Store</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Owner Order Notification Email Template
 * Generates HTML email for store owner notification of new orders
 */
export const generateOwnerNotificationEmail = (order, user, items) => {
  // Safe item handling for owner view
  const itemsHtml = items && Array.isArray(items)
    ? items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px;">
          ${item.name || "Product"}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center; font-size: 14px;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-size: 14px;">
          ₹${(item.price || 0).toFixed(2)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-size: 14px;">
          ₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
        </td>
      </tr>
    `
      )
      .join("")
    : "";

  const customerDetailsHtml = user ? `
    <h3 style="color: #5D4037; margin-bottom: 10px; font-size: 16px;">👤 Customer Details</h3>
    <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.8;">
      <strong>Name:</strong> ${user.name || "N/A"}<br/>
      <strong>Email:</strong> ${user.email || "N/A"}<br/>
      <strong>Phone:</strong> ${order.address?.phone || "N/A"}
    </p>
  ` : "";

  const deliveryAddressHtml = order.address
    ? `
      <h3 style="color: #5D4037; margin-bottom: 10px; font-size: 16px;">📍 Delivery Address</h3>
      <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.8;">
        <strong>${order.address.name || "N/A"}</strong><br/>
        ${order.address.street || ""}<br/>
        ${order.address.city || ""}, ${order.address.state || ""} ${order.address.pincode || ""}<br/>
        📱 ${order.address.phone || ""}<br/>
        📧 ${order.address.email || ""}
      </p>
    `
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 30px 20px;
        }
        .order-number {
          background-color: #E3F2FD;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          text-align: center;
          border-left: 4px solid #1565C0;
        }
        .order-number p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
        .order-number strong {
          display: block;
          font-size: 20px;
          color: #0D47A1;
          margin-top: 5px;
          font-weight: 700;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h3 {
          color: #1565C0;
          border-bottom: 2px solid #1565C0;
          padding-bottom: 10px;
          margin-bottom: 15px;
          font-size: 16px;
          font-weight: 600;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .items-table thead {
          background-color: #E3F2FD;
        }
        .items-table th {
          padding: 12px;
          text-align: left;
          color: #0D47A1;
          font-weight: 600;
          font-size: 13px;
          border-bottom: 2px solid #1565C0;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
          font-size: 14px;
        }
        .summary {
          background-color: #E3F2FD;
          padding: 15px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .summary-row.total {
          border-top: 2px solid #1565C0;
          padding-top: 12px;
          margin-top: 12px;
          font-weight: 700;
          font-size: 16px;
          color: #0D47A1;
        }
        .payment-status {
          background-color: #C8E6C9;
          color: #2E7D32;
          padding: 8px 12px;
          border-radius: 4px;
          font-weight: 600;
          display: inline-block;
        }
        .payment-status.pending {
          background-color: #FFE0B2;
          color: #E65100;
        }
        .alert-box {
          background-color: #FFF3E0;
          border-left: 4px solid #FF6F00;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .alert-box h4 {
          margin: 0 0 8px 0;
          color: #E65100;
          font-size: 14px;
          font-weight: 600;
        }
        .alert-box p {
          margin: 5px 0;
          color: #333;
          font-size: 13px;
          line-height: 1.6;
        }
        .footer {
          background-color: #E3F2FD;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #ddd;
        }
        .footer p {
          margin: 5px 0;
          font-size: 12px;
          color: #666;
        }
        .footer a {
          color: #1565C0;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🆕 New Order Received!</h1>
          <p>Time to process and dispatch</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Greeting -->
          <p style="font-size: 16px; color: #333;">
            Hello <strong>Livique Team</strong>,
          </p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            A new order has been placed! Please review the details below and process it for dispatch.
          </p>

          <!-- Order Number -->
          <div class="order-number">
            <p>Order ID</p>
            <strong>#${order._id.toString().substring(0, 8).toUpperCase()}</strong>
          </div>

          <!-- Customer Details -->
          ${customerDetailsHtml ? `<div class="section">${customerDetailsHtml}</div>` : ""}

          <!-- Order Items -->
          <div class="section">
            <h3>📦 Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <!-- Order Summary -->
          <div class="section">
            <h3>💰 Payment Summary</h3>
            <div class="summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${order.subtotal?.toFixed(2) || "0.00"}</span>
              </div>
              <div class="summary-row">
                <span>Delivery Charges:</span>
                <span>₹${order.deliveryCharges?.toFixed(2) || "0.00"}</span>
              </div>
              <div class="summary-row total">
                <span>Total Amount:</span>
                <span>₹${order.total?.toFixed(2) || "0.00"}</span>
              </div>
              <div class="summary-row" style="margin-top: 10px;">
                <span>Payment Status:</span>
                <span class="payment-status${order.paymentStatus === "Pending" ? " pending" : ""}">
                  ${order.paymentStatus === "Paid" ? "✓ PAID" : order.paymentStatus || "Pending"}
                </span>
              </div>
              <div class="summary-row" style="margin-top: 8px;">
                <span>Payment Method:</span>
                <span style="font-weight: 500;">${order.paymentMethod || "N/A"}</span>
              </div>
            </div>
          </div>

          <!-- Delivery Address -->
          ${deliveryAddressHtml ? `<div class="section">${deliveryAddressHtml}</div>` : ""}

          <!-- Action Required -->
          <div class="alert-box">
            <h4>⚠️ Action Required</h4>
            <p>✓ Verify order details and customer information</p>
            <p>📦 Prepare items for packing</p>
            <p>🏷️ Generate shipping label with tracking ID</p>
            <p>📧 Send tracking information to customer within 5 days</p>
          </div>

          <!-- Next Steps -->
          <div class="section">
            <h3>Next Steps</h3>
            <p style="color: #666; font-size: 14px; line-height: 1.8;">
              1. Review order details and verify all items in stock<br/>
              2. Prepare items for packaging<br/>
              3. Generate shipping label and tracking ID<br/>
              4. Update order status in system<br/>
              5. Send tracking information to customer<br/>
              6. Keep order confirmation email for records
            </p>
          </div>

          <!-- Admin Dashboard Link -->
          <div class="section" style="text-align: center; background-color: #E3F2FD; padding: 20px; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #1565C0;">Need to Manage Orders?</h3>
            <p style="margin: 5px 0; font-size: 14px; color: #666;">
              Log in to your admin dashboard to view all orders and manage dispatch.<br/>
              🌐 Dashboard: <a href="https://www.livique.co.in/admin" style="color: #1565C0; text-decoration: none;">https://www.livique.co.in/admin</a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>Livique</strong> - Order Management System</p>
          <p>📧 Automated order notification email</p>
          <p style="margin-top: 15px; font-size: 11px; color: #999;">
            This is an automated email from your Livique store management system. Please do not reply to this email.
          </p>
          <p style="margin-top: 10px;">
            © 2025 Livique. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
