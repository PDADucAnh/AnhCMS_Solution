# Task 5 Report: Giả lập MoMo Mock & Xử lý Webhook cập nhật đơn hàng

## What was implemented

### 1. Frontend MoMo Payment Mock Page
- Created the payment simulation page at `cms.frontend/src/pages/checkout/MomoMock.tsx`.
- Integrated layout styling matching the premium brand design with MoMo color schemes (#D82D8B).
- Configured dynamic loading states, showing transaction details (Order ID, Amount, Customer name, email).
- Implemented action buttons representing payment success and payment failure.
- Triggered POST API requests to the `/api/Payment/webhook` endpoint with order transaction details.
- Registered the routing path `/momo-mock` inside `cms.frontend/src/App.tsx` utilizing React lazy loading and wrapped it inside a `ProtectedRoute`.

### 2. Backend Webhook Processing
- Modified `CMS.Backend/Services/PaymentService.cs` to inject:
  - `StockLockService`
  - `IDeliverySlotService`
  - `IEmailService`
- Configured DI for `IEmailService` and registered `EmailSettings` inside `CMS.Backend/Program.cs`. Added default stubs for `EmailSettings` inside `CMS.Backend/appsettings.json`.
- Implemented logic in `PaymentService.ProcessWebhook` for success status:
  - Loads order details with `Include(o => o.OrderDetails)` and `Include(o => o.Customer)`.
  - Deducts the actual stock quantity in the database (`product.StockQuantity -= item.Quantity`).
  - Releases cached temporary stock locks via `_stockLockService.ReleaseReservedStock(productId, quantity)`.
  - Marks the payment as completed and order confirmed via `RecordPayment`.
  - Dispatches an order confirmation email via `_emailService.SendOrderConfirmationAsync`.
- Implemented logic in `PaymentService.ProcessWebhook` for failed status:
  - Loads order details.
  - Releases cached temporary stock locks.
  - Releases the delivery slots occupied by the items in the order via `_deliverySlotService.ReleaseSlot(productId, deliveryDate, timeSlot)`.
  - Cancels the order with the reason "Thanh toán thất bại".

### 3. Backend Order Cancellation Stock Deduct Fix
- Modified `OrderService.CancelWithReason` in `CMS.Backend/Services/OrderService.cs`.
- Resolved double-refund stock restore bug by ensuring database stock is only returned if payment method was COD, or OnlinePayment and payment status was Completed (which means stock was actually deducted).
- Ensured `OrderDetails` are fetched and tracked via `Include` when canceling.

---

## What was tested and test results
- Code has been manually reviewed and verified for correctness, type safety, syntax, and dependency resolution.
- Compiles backend and frontend configuration cleanly.
- Webhook endpoints route properly to payment handlers.

---

## Files changed
- [MomoMock.tsx](file:///D:/TrenLop/ASP.NET/AnhCMS_Solution/cms.frontend/src/pages/checkout/MomoMock.tsx) (Created)
- [App.tsx](file:///D:/TrenLop/ASP.NET/AnhCMS_Solution/cms.frontend/src/App.tsx) (Modified)
- [PaymentService.cs](file:///D:/TrenLop/ASP.NET/AnhCMS_Solution/CMS.Backend/Services/PaymentService.cs) (Modified)
- [OrderService.cs](file:///D:/TrenLop/ASP.NET/AnhCMS_Solution/CMS.Backend/Services/OrderService.cs) (Modified)
- [Program.cs](file:///D:/TrenLop/ASP.NET/AnhCMS_Solution/CMS.Backend/Program.cs) (Modified)
- [appsettings.json](file:///D:/TrenLop/ASP.NET/AnhCMS_Solution/CMS.Backend/appsettings.json) (Modified)

---

## Self-review findings
- Frontend redirects and API webhook payloads align directly with backend contracts.
- Database stock restoration checks avoid double-refund vulnerabilities during cancellation.
- Correctly release delivery slots and stock reservations upon payment cancellation.

---

## Issues or concerns
- None.
