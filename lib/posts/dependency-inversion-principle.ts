import { BlogPost } from './types';

export const dependencyInversionPost: BlogPost = {
  slug: "dependency-inversion-principle",
  title: "Dependency Inversion Principle: The 'D' in SOLID",
  excerpt: "Learn how the Dependency Inversion Principle helps create loosely coupled, testable, and maintainable code by depending on abstractions instead of concrete implementations.",
  date: "January 11, 2026",
  author: "Matthew Holmes",
  readTime: "10 min read",
  category: "Design Patterns",
  content: `
# Dependency Inversion Principle: The 'D' in SOLID

## What is the Dependency Inversion Principle?

The Dependency Inversion Principle (DIP) is the fifth and final principle in SOLID. It states:

**"High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions."**

In simpler terms: *Depend on interfaces or abstract classes, not concrete implementations.*

## The Problem Without DIP

Consider an e-commerce application that needs to send notifications:

\`\`\`csharp
public class EmailService
{
    public void SendEmail(string to, string subject, string body)
    {
        Console.WriteLine($"Sending email to {to}");
        Console.WriteLine($"Subject: {subject}");
        Console.WriteLine($"Body: {body}");
    }
}

public class OrderProcessor
{
    private readonly EmailService _emailService;

    public OrderProcessor()
    {
        _emailService = new EmailService();
    }

    public void ProcessOrder(Order order)
    {
        // Process order logic
        Console.WriteLine($"Processing order {order.Id}");
        
        // Send confirmation
        _emailService.SendEmail(
            order.CustomerEmail,
            "Order Confirmation",
            $"Your order {order.Id} has been processed"
        );
    }
}
\`\`\`

Problems with this approach:

- **Tight Coupling**: OrderProcessor directly depends on EmailService
- **Hard to Test**: Can't test OrderProcessor without sending actual emails
- **Inflexible**: Can't switch to SMS, push notifications, or other channels
- **Violates DIP**: High-level module (OrderProcessor) depends on low-level module (EmailService)

## The Solution: Dependency Inversion

### Step 1: Define an Abstraction

\`\`\`csharp
public interface INotificationService
{
    void Send(string recipient, string subject, string message);
}
\`\`\`

### Step 2: Implement Concrete Classes

\`\`\`csharp
public class EmailService : INotificationService
{
    public void Send(string recipient, string subject, string message)
    {
        Console.WriteLine($"Sending email to {recipient}");
        Console.WriteLine($"Subject: {subject}");
        Console.WriteLine($"Message: {message}");
    }
}

public class SmsService : INotificationService
{
    public void Send(string recipient, string subject, string message)
    {
        Console.WriteLine($"Sending SMS to {recipient}");
        Console.WriteLine($"Message: {message}");
    }
}

public class PushNotificationService : INotificationService
{
    public void Send(string recipient, string subject, string message)
    {
        Console.WriteLine($"Sending push notification to {recipient}");
        Console.WriteLine($"Title: {subject}");
        Console.WriteLine($"Message: {message}");
    }
}
\`\`\`

### Step 3: Depend on Abstraction

\`\`\`csharp
public class OrderProcessor
{
    private readonly INotificationService _notificationService;

    // Dependency Injection via constructor
    public OrderProcessor(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public void ProcessOrder(Order order)
    {
        Console.WriteLine($"Processing order {order.Id}");
        
        _notificationService.Send(
            order.CustomerEmail,
            "Order Confirmation",
            $"Your order {order.Id} has been processed"
        );
    }
}

// Usage
var emailProcessor = new OrderProcessor(new EmailService());
emailProcessor.ProcessOrder(order);

var smsProcessor = new OrderProcessor(new SmsService());
smsProcessor.ProcessOrder(order);
\`\`\`

## TypeScript Example

\`\`\`typescript
// Abstraction
interface IDatabase {
  connect(): Promise<void>;
  query(sql: string): Promise<any>;
  disconnect(): Promise<void>;
}

// Concrete Implementations
class PostgresDatabase implements IDatabase {
  async connect(): Promise<void> {
    console.log('Connecting to PostgreSQL...');
  }

  async query(sql: string): Promise<any> {
    console.log(\`Executing PostgreSQL query: \${sql}\`);
    return [];
  }

  async disconnect(): Promise<void> {
    console.log('Disconnecting from PostgreSQL');
  }
}

class MongoDatabase implements IDatabase {
  async connect(): Promise<void> {
    console.log('Connecting to MongoDB...');
  }

  async query(sql: string): Promise<any> {
    console.log(\`Executing MongoDB query: \${sql}\`);
    return [];
  }

  async disconnect(): Promise<void> {
    console.log('Disconnecting from MongoDB');
  }
}

// High-level module depends on abstraction
class UserRepository {
  constructor(private database: IDatabase) {}

  async getUser(id: string): Promise<User | null> {
    await this.database.connect();
    const result = await this.database.query(\`SELECT * FROM users WHERE id = \${id}\`);
    await this.database.disconnect();
    return result[0] || null;
  }

  async saveUser(user: User): Promise<void> {
    await this.database.connect();
    await this.database.query(\`INSERT INTO users VALUES (...)\`);
    await this.database.disconnect();
  }
}

// Usage
const postgresRepo = new UserRepository(new PostgresDatabase());
const mongoRepo = new UserRepository(new MongoDatabase());
\`\`\`

## Dependency Injection Patterns

### Constructor Injection (Recommended)

\`\`\`csharp
public class OrderService
{
    private readonly IPaymentProcessor _paymentProcessor;
    private readonly IInventoryService _inventoryService;
    private readonly INotificationService _notificationService;

    public OrderService(
        IPaymentProcessor paymentProcessor,
        IInventoryService inventoryService,
        INotificationService notificationService)
    {
        _paymentProcessor = paymentProcessor;
        _inventoryService = inventoryService;
        _notificationService = notificationService;
    }
}
\`\`\`

### Property Injection

\`\`\`csharp
public class OrderService
{
    public IPaymentProcessor PaymentProcessor { get; set; }
    public IInventoryService InventoryService { get; set; }
}
\`\`\`

### Method Injection

\`\`\`csharp
public class OrderService
{
    public void ProcessOrder(Order order, IPaymentProcessor paymentProcessor)
    {
        paymentProcessor.ProcessPayment(order.Total);
    }
}
\`\`\`

## Dependency Injection Containers

Modern frameworks provide IoC (Inversion of Control) containers:

### ASP.NET Core

\`\`\`csharp
// Startup.cs or Program.cs
public void ConfigureServices(IServiceCollection services)
{
    // Register dependencies
    services.AddScoped<INotificationService, EmailService>();
    services.AddScoped<IPaymentProcessor, StripePaymentProcessor>();
    services.AddScoped<IOrderRepository, SqlOrderRepository>();
    services.AddScoped<OrderService>();
}

// Controller
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;

    // Dependencies automatically injected
    public OrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }
}
\`\`\`

### TypeScript with InversifyJS

\`\`\`typescript
import { Container, injectable, inject } from 'inversify';

const TYPES = {
  Database: Symbol.for('Database'),
  UserRepository: Symbol.for('UserRepository')
};

@injectable()
class PostgresDatabase implements IDatabase {
  // implementation
}

@injectable()
class UserRepository {
  constructor(@inject(TYPES.Database) private database: IDatabase) {}
}

// Container setup
const container = new Container();
container.bind<IDatabase>(TYPES.Database).to(PostgresDatabase);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);

// Usage
const userRepo = container.get<UserRepository>(TYPES.UserRepository);
\`\`\`

## Benefits of Dependency Inversion

✅ **Loose Coupling**: Modules are independent and interchangeable

✅ **Testability**: Easy to mock dependencies for unit testing

✅ **Flexibility**: Switch implementations without changing high-level code

✅ **Maintainability**: Changes to low-level modules don't affect high-level modules

✅ **Reusability**: Abstractions can be reused across different contexts

## Testing with DIP

\`\`\`csharp
// Test with mock
public class OrderProcessorTests
{
    [Fact]
    public void ProcessOrder_SendsNotification()
    {
        // Arrange
        var mockNotificationService = new Mock<INotificationService>();
        var processor = new OrderProcessor(mockNotificationService.Object);
        var order = new Order { Id = 1, CustomerEmail = "test@example.com" };

        // Act
        processor.ProcessOrder(order);

        // Assert
        mockNotificationService.Verify(
            x => x.Send(
                order.CustomerEmail,
                "Order Confirmation",
                It.IsAny<string>()
            ),
            Times.Once
        );
    }
}
\`\`\`

## Common Pitfalls

### 1. Creating Unnecessary Abstractions

\`\`\`csharp
// BAD - Abstraction without purpose
public interface IMathHelper
{
    int Add(int a, int b);
}

// GOOD - Use concrete class for simple utilities
public class MathHelper
{
    public static int Add(int a, int b) => a + b;
}
\`\`\`

### 2. Leaky Abstractions

\`\`\`csharp
// BAD - Exposes implementation details
public interface IUserRepository
{
    SqlDataReader ExecuteQuery(string sql);
}

// GOOD - Clean abstraction
public interface IUserRepository
{
    User GetById(int id);
    IEnumerable<User> GetAll();
}
\`\`\`

### 3. Over-Engineering

Don't create abstractions for everything. Ask:
- Will this implementation change?
- Do I need to test this in isolation?
- Is there more than one possible implementation?

## When to Use DIP

✅ **Use when:**
- Building libraries or frameworks
- Working with external services (databases, APIs, third-party services)
- Need to support multiple implementations
- Writing testable code
- Building complex business logic

❌ **Don't use when:**
- Implementation is stable and unlikely to change
- Simple utility functions
- Performance-critical code where abstraction overhead matters
- Creating unnecessary complexity

## DIP vs Dependency Injection

**Dependency Inversion Principle (DIP)**: A design principle about depending on abstractions

**Dependency Injection (DI)**: A technique for implementing DIP by providing dependencies from outside

DI is one way to achieve DIP, but not the only way.

## Real-World Example

\`\`\`csharp
// Abstraction
public interface ILogger
{
    void LogInfo(string message);
    void LogError(string message, Exception ex);
}

// Implementations
public class FileLogger : ILogger
{
    private readonly string _filePath;

    public FileLogger(string filePath)
    {
        _filePath = filePath;
    }

    public void LogInfo(string message)
    {
        File.AppendAllText(_filePath, $"[INFO] {DateTime.Now}: {message}\n");
    }

    public void LogError(string message, Exception ex)
    {
        File.AppendAllText(_filePath, $"[ERROR] {DateTime.Now}: {message} - {ex}\n");
    }
}

public class DatabaseLogger : ILogger
{
    private readonly IDbConnection _connection;

    public DatabaseLogger(IDbConnection connection)
    {
        _connection = connection;
    }

    public void LogInfo(string message)
    {
        _connection.Execute("INSERT INTO Logs (Level, Message) VALUES (@Level, @Message)",
            new { Level = "INFO", Message = message });
    }

    public void LogError(string message, Exception ex)
    {
        _connection.Execute("INSERT INTO Logs (Level, Message, Exception) VALUES (@Level, @Message, @Exception)",
            new { Level = "ERROR", Message = message, Exception = ex.ToString() });
    }
}

// Application service depends on abstraction
public class PaymentService
{
    private readonly ILogger _logger;
    private readonly IPaymentGateway _paymentGateway;

    public PaymentService(ILogger logger, IPaymentGateway paymentGateway)
    {
        _logger = logger;
        _paymentGateway = paymentGateway;
    }

    public async Task<PaymentResult> ProcessPayment(Payment payment)
    {
        try
        {
            _logger.LogInfo($"Processing payment {payment.Id}");
            var result = await _paymentGateway.Charge(payment);
            _logger.LogInfo($"Payment {payment.Id} processed successfully");
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Payment {payment.Id} failed", ex);
            throw;
        }
    }
}
\`\`\`

## Conclusion

The Dependency Inversion Principle is fundamental to building maintainable, testable, and flexible software. By depending on abstractions rather than concrete implementations, you create loosely coupled systems that are easier to modify, test, and extend.

Key takeaways:
- Depend on interfaces/abstractions, not concrete classes
- Use dependency injection to provide implementations
- Create abstractions only when they add value
- Focus on testability and flexibility

When combined with the other SOLID principles, DIP helps you build robust, professional-grade applications that stand the test of time.

---

*How do you implement dependency inversion in your projects? Share your experiences with DI containers and testing strategies!*
  `
};
