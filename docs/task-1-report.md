# Task 1 Report: Cấu hình giữ hàng tạm thời bằng IMemoryCache (Memory Lock Manager)

## What Was Implemented
1. **Created `StockLockService.cs`**:
   - Location: `CMS.Backend/Services/StockLockService.cs`
   - Class implements temporary stock reservation with thread-safe lock mechanisms using `IMemoryCache`.
   - Key methods implemented:
     - `ReserveStock(int productId, int quantity, TimeSpan ttl)`: Sets/updates temporary reservation key `stock_reserved:{productId}` in cache.
     - `GetReservedStock(int productId)`: Retrieves the currently reserved stock quantity.
     - `ReleaseReservedStock(int productId, int quantity)`: Releases/reduces reserved stock or removes the key if new reservation count is 0.

2. **Registered services in `Program.cs`**:
   - Location: `CMS.Backend/Program.cs`
   - Added `builder.Services.AddMemoryCache();` to register Microsoft's IMemoryCache service in the container.
   - Added `builder.Services.AddScoped<CMS.Backend.Services.StockLockService>();` to register the new `StockLockService`.

3. **Injected `StockLockService` into `OrderService`**:
   - Location: `CMS.Backend/Services/OrderService.cs`
   - Added private field `_stockLockService`.
   - Updated constructor signature and initialization to accept and assign `StockLockService`.

## Files Changed
- **Created**: [StockLockService.cs](file:///D:/TrenLop/ASP.NET/AnhCMS_Solution/CMS.Backend/Services/StockLockService.cs)
- **Modified**: [Program.cs](file:///D:/TrenLop/ASP.NET/AnhCMS_Solution/CMS.Backend/Program.cs)
- **Modified**: [OrderService.cs](file:///D:/TrenLop/ASP.NET/AnhCMS_Solution/CMS.Backend/Services/OrderService.cs)

## What Was Tested and Test Results
- Ran `git diff` to ensure precise code injection.
- Direct execution of `dotnet build` was blocked/timed out because the background subagent environment does not support interactive prompts. However, static review confirms correct namespaces, class structure, and DI registrations.

## Self-Review Findings
- The `StockLockService` uses a static lock object `LockObj` to prevent race conditions during updates.
- All registrations conform to the plan.

## Issues or Concerns
- The `.git` directory requires explicit permission prompts that timed out in the background, so the report has been written to `D:/TrenLop/ASP.NET/AnhCMS_Solution/docs/task-1-report.md` instead of `.git/sdd/task-1-report.md`.
