import { BlogPost } from './types';

export const designPatternsAspNetCorePost: BlogPost = {
  slug: "design-patterns-aspnet-core",
  title: "Essential Design Patterns for ASP.NET Core Applications",
  excerpt: "Master the most important design patterns used in modern ASP.NET Core applications, from dependency injection to options pattern, with practical examples and best practices.",
  date: "January 11, 2026",
  author: "nemostorm",
  readTime: "15 min read",
  category: "Design Patterns",
  content: `
# Essential Design Patterns for ASP.NET Core Applications

## Introduction

ASP.NET Core applications face common challenges: tight coupling, difficult testing, inflexible code, and maintenance nightmares. Design patterns provide proven solutions to these problems. This guide focuses on three critical patterns that solve the most pressing issues in modern web development: Repository Pattern, Strategy Pattern, and Dependency Inversion Principle.

## 1. Repository Pattern - Solving Data Access Problems

### The Problem
Without the Repository Pattern, your controllers and services become tightly coupled to data access logic. This leads to:

- **Controllers bloated with SQL/database code**
- **Impossible to unit test business logic** without a database
- **Database changes breaking multiple layers**
- **Inconsistent data access patterns** across the application
- **Difficulty switching databases** or data sources

### The Solution
The Repository Pattern abstracts data access behind interfaces, providing a consistent API for data operations.

**Key Benefits:**
- **Separation of Concerns**: Business logic separated from data access
- **Testability**: Easy to mock repositories for unit testing
- **Maintainability**: Changes to data access don't affect business logic
- **Flexibility**: Can switch databases without changing business code
- **Consistency**: Standardized data access patterns

[INTERACTIVE_CODE_EDITOR]

## 2. Strategy Pattern - Solving Algorithm Selection Problems

### The Problem
Hard-coded conditional logic for different behaviors creates inflexible, hard-to-maintain code:

- **Massive if-else or switch statements** in controllers/services
- **Violation of Open/Closed Principle** - adding new behaviors requires code changes
- **Tight coupling** between algorithm selection and implementation
- **Difficult testing** of individual behaviors
- **Code duplication** when similar logic appears in multiple places

### The Solution
The Strategy Pattern encapsulates algorithms in separate classes and makes them interchangeable at runtime.

**Key Benefits:**
- **Open/Closed Principle**: Add new strategies without modifying existing code
- **Runtime flexibility**: Change behavior without redeployment
- **Testability**: Test each strategy independently
- **Clean separation**: Algorithm logic isolated from client code
- **Reusability**: Strategies can be used across different contexts

## 3. Dependency Inversion Principle - Solving Coupling Problems

### The Problem
High-level modules depending directly on low-level modules creates rigid, hard-to-change systems:

- **Tight coupling** between layers (UI depends on Business depends on Data)
- **Difficult testing** - can't mock dependencies easily
- **Rigid architecture** - changes cascade through all layers
- **Framework lock-in** - hard to switch implementations
- **Maintenance nightmares** - changes in one layer break others

### The Solution
DIP states that high-level modules should not depend on low-level modules. Both should depend on abstractions.

**Key Benefits:**
- **Loose coupling**: Modules depend on interfaces, not implementations
- **Testability**: Easy to inject mocks and stubs
- **Flexibility**: Switch implementations without changing dependent code
- **Maintainability**: Changes isolated to specific implementations
- **Framework independence**: Not locked into specific technologies

## How These Patterns Work Together in ASP.NET Core

### Real-World ASP.NET Core Example

Consider an e-commerce checkout system:

**Without Patterns (The Problem):**
\`\`\`csharp
public class CheckoutController : Controller
{
    [HttpPost]
    public IActionResult ProcessPayment(PaymentRequest request)
    {
        // Tight coupling - direct database access
        using (var conn = new SqlConnection(_connectionString))
        {
            // Hard-coded payment logic
            if (request.Method == "stripe")
            {
                // Stripe-specific code mixed with controller logic
                var stripeService = new StripePaymentService();
                stripeService.Process(request.Amount);
            }
            else if (request.Method == "paypal")
            {
                // PayPal-specific code
                var paypalService = new PayPalPaymentService();
                paypalService.Process(request.Amount);
            }
            
            // Direct email sending
            var emailService = new EmailService();
            emailService.SendConfirmation(request.CustomerEmail);
        }
        
        return View();
    }
}
\`\`\`

**With Patterns (The Solution):**
\`\`\`csharp
public class CheckoutController : Controller
{
    private readonly IPaymentProcessor _paymentProcessor;
    private readonly IOrderRepository _orderRepository;
    private readonly INotificationService _notificationService;

    public CheckoutController(
        IPaymentProcessor paymentProcessor,
        IOrderRepository orderRepository, 
        INotificationService notificationService)
    {
        _paymentProcessor = paymentProcessor;
        _orderRepository = orderRepository;
        _notificationService = notificationService;
    }

    [HttpPost]
    public async Task<IActionResult> ProcessPayment(PaymentRequest request)
    {
        // Strategy Pattern - dynamically select payment method
        var strategy = GetPaymentStrategy(request.Method);
        _paymentProcessor.SetStrategy(strategy);
        
        var result = await _paymentProcessor.ProcessPaymentAsync(request.Amount, request.Details);
        
        if (result.Success)
        {
            // Repository Pattern - abstract data access
            var order = new Order { /* ... */ };
            await _orderRepository.AddAsync(order);
            
            // DIP - depend on abstraction, not concrete implementation
            await _notificationService.SendNotificationAsync(
                request.CustomerEmail, "Payment Confirmed", "...");
                
            return RedirectToAction("Success");
        }
        
        return View("Error");
    }
}
\`\`\`

## Pattern Implementation in ASP.NET Core

### Repository Pattern Implementation
- Define interfaces in a separate layer
- Implement with Entity Framework Core
- Register in Program.cs with appropriate lifetimes
- Inject into controllers/services via constructor

### Strategy Pattern Implementation
- Define strategy interfaces
- Create concrete strategy implementations
- Use dependency injection to register strategies
- Create context class that accepts strategies
- Switch strategies based on runtime conditions

### DIP Implementation
- Define abstractions (interfaces) in domain/core layer
- Implement abstractions in infrastructure layer
- Register implementations in DI container
- Depend on abstractions in application layer
- Use constructor injection throughout

## Testing Benefits

These patterns dramatically improve testability:

**Repository Pattern:**
- Mock IOrderRepository for testing OrderService
- Test business logic without database dependencies
- Verify correct repository method calls

**Strategy Pattern:**
- Test each payment strategy independently
- Mock strategy interfaces for testing context
- Verify correct strategy selection logic

**DIP:**
- Inject mock implementations in tests
- Test modules in isolation
- Verify interface contracts are maintained

## Common Anti-Patterns to Avoid

### Repository Pattern
- **Generic Repository Anti-Pattern**: Don't create IRepository<T> for everything
- **Repository with Business Logic**: Keep repositories focused on data access

### Strategy Pattern
- **Strategy Overkill**: Don't use strategy for simple conditionals
- **God Context Class**: Keep context classes focused

### DIP
- **Interface Segregation Violation**: Keep interfaces focused and small
- **Service Locator**: Don't inject IServiceProvider to manually resolve dependencies

## Performance Considerations

### Repository Pattern
- Use async/await for I/O operations
- Implement proper indexing in database
- Consider caching for frequently accessed data

### Strategy Pattern
- Avoid creating strategies for every request
- Consider object pooling for expensive strategies
- Use lazy loading for strategies not always needed

### DIP
- Register services with appropriate lifetimes
- Avoid captive dependencies (scoped in singleton)
- Use singleton for stateless, thread-safe services

## Conclusion

Design patterns aren't just academic concepts—they solve real problems in ASP.NET Core development:

- **Repository Pattern** solves data access coupling and testing challenges
- **Strategy Pattern** solves algorithm selection and extensibility problems  
- **Dependency Inversion Principle** solves coupling and maintainability issues

Together, these patterns create applications that are:
- **Testable**: Easy to write unit and integration tests
- **Maintainable**: Changes isolated to specific layers
- **Flexible**: Easy to modify and extend functionality
- **Scalable**: Can grow without architectural debt

Start implementing these patterns in your next ASP.NET Core project. The initial investment pays dividends in application quality and developer productivity.
        }
    }
}
```
