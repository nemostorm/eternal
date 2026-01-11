'use client';

import { useParams } from 'next/navigation';
import { useMemo, useEffect, JSX } from 'react';
import hljs from 'highlight.js';
import csharp from 'highlight.js/lib/languages/csharp';
import '../../purple-green-dark.css';
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { InteractiveCodeEditor } from "../../components/InteractiveCodeEditor";
import Link from 'next/link';
import { blogPosts, BlogPost } from '@/lib/posts';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const post = blogPosts.find(p => p.slug === slug);

  // Register C# language
  hljs.registerLanguage('csharp', csharp);

  // Helper function to convert markdown to HTML
  const convertMarkdownToHtml = (text: string): string => {
    // First, unescape backticks for code blocks
    let result = text.replace(/\\`/g, '`');

    // Handle headers
    result = result.replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-white mt-8 mb-4">$1</h3>');
    result = result.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-white mt-8 mb-4">$1</h2>');
    result = result.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1>');

    // Handle bold and italic
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');
    result = result.replace(/\*(.+?)\*/g, '<em class="text-gray-300">$1</em>');

    // Handle lists
    result = result.replace(/^- (.*$)/gm, '<li class="text-gray-300 ml-4">$1</li>');
    result = result.replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc list-inside mb-4">$&</ul>');

    // Handle code blocks
    result = result.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, language, code) => {
      const lang = language || '';
      return `<pre class="bg-neutral-900 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang} text-sm">${code.trim()}</code></pre>`;
    });

    // Handle paragraphs
    result = result.replace(/\n\n/g, '</p><p class="text-gray-300 leading-relaxed mb-4">');
    result = '<p class="text-gray-300 leading-relaxed mb-4">' + result + '</p>';

    return result;
  };

  const renderContent = useMemo(() => {
    if (!post) return [];

    const contentParts = post.content.split('[INTERACTIVE_CODE_EDITOR]');
    const elements: JSX.Element[] = [];

    contentParts.forEach((part, index) => {
      // Add the text content (converted to HTML)
      if (part.trim()) {
        elements.push(
          <div
            key={`text-${index}`}
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(part) }}
          />
        );
      }

      // Add the interactive code editor between text parts
      if (index < contentParts.length - 1) {
        const getTabsForPost = (slug: string) => {
          switch (slug) {
            case 'design-patterns-aspnet-core':
              return [
                {
                  id: 'repository-pattern',
                  title: 'Repository Pattern',
                  code: `// Interfaces/IOrderRepository.cs
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(int id);
    Task<IEnumerable<Order>> GetAllAsync();
    Task<IEnumerable<Order>> GetByCustomerIdAsync(int customerId);
    Task<Order> AddAsync(Order order);
    Task UpdateAsync(Order order);
    Task DeleteAsync(int id);
}

// Repositories/OrderRepository.cs
public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;

    public OrderRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<IEnumerable<Order>> GetByCustomerIdAsync(int customerId)
    {
        return await _context.Orders
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order> AddAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task UpdateAsync(Order order)
    {
        _context.Orders.Update(order);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order != null)
        {
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }
    }
}

// Program.cs - Register repository
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));`
                },
                {
                  id: 'strategy-pattern',
                  title: 'Strategy Pattern',
                  code: `// Interfaces/IPaymentStrategy.cs
public interface IPaymentStrategy
{
    Task<PaymentResult> ProcessPaymentAsync(decimal amount, PaymentDetails details);
}

// Strategies/StripePaymentStrategy.cs
public class StripePaymentStrategy : IPaymentStrategy
{
    private readonly IConfiguration _config;
    private readonly ILogger<StripePaymentStrategy> _logger;

    public StripePaymentStrategy(IConfiguration config, ILogger<StripePaymentStrategy> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(decimal amount, PaymentDetails details)
    {
        _logger.LogInformation("Processing Stripe payment of {Amount}", amount);
        
        // Stripe payment processing logic
        // var stripeClient = new StripeClient(_config["Stripe:SecretKey"]);
        // var paymentIntent = await stripeClient.PaymentIntents.CreateAsync(...);
        
        return new PaymentResult 
        { 
            Success = true, 
            TransactionId = $"stripe_{Guid.NewGuid()}", 
            Amount = amount 
        };
    }
}

// Strategies/PayPalPaymentStrategy.cs
public class PayPalPaymentStrategy : IPaymentStrategy
{
    private readonly IConfiguration _config;
    private readonly ILogger<PayPalPaymentStrategy> _logger;

    public PayPalPaymentStrategy(IConfiguration config, ILogger<PayPalPaymentStrategy> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(decimal amount, PaymentDetails details)
    {
        _logger.LogInformation("Processing PayPal payment of {Amount}", amount);
        
        // PayPal payment processing logic
        return new PaymentResult 
        { 
            Success = true, 
            TransactionId = $"paypal_{Guid.NewGuid()}", 
            Amount = amount 
        };
    }
}

// Context/PaymentProcessor.cs
public class PaymentProcessor
{
    private IPaymentStrategy _strategy;

    public PaymentProcessor(IPaymentStrategy strategy)
    {
        _strategy = strategy;
    }

    public void SetStrategy(IPaymentStrategy strategy)
    {
        _strategy = strategy;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(decimal amount, PaymentDetails details)
    {
        return await _strategy.ProcessPaymentAsync(amount, details);
    }
}

// Controllers/PaymentController.cs
[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly PaymentProcessor _paymentProcessor;

    public PaymentController(PaymentProcessor paymentProcessor)
    {
        _paymentProcessor = paymentProcessor;
    }

    [HttpPost("process")]
    public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequest request)
    {
        IPaymentStrategy strategy = request.PaymentMethod switch
        {
            "stripe" => HttpContext.RequestServices.GetRequiredService<StripePaymentStrategy>(),
            "paypal" => HttpContext.RequestServices.GetRequiredService<PayPalPaymentStrategy>(),
            _ => throw new ArgumentException("Invalid payment method")
        };

        _paymentProcessor.SetStrategy(strategy);
        var result = await _paymentProcessor.ProcessPaymentAsync(request.Amount, request.Details);

        return result.Success ? Ok(result) : BadRequest(result);
    }
}`
                },
                {
                  id: 'dependency-inversion',
                  title: 'Dependency Inversion Principle',
                  code: `// DIP: High-level modules should not depend on low-level modules.
// Both should depend on abstractions.

// Abstraction/INotificationService.cs
public interface INotificationService
{
    Task SendNotificationAsync(string recipient, string subject, string message);
}

// Low-level implementations
public class EmailService : INotificationService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendNotificationAsync(string recipient, string subject, string message)
    {
        _logger.LogInformation("Sending email to {Recipient}", recipient);
        
        // Email sending logic using SMTP
        using var client = new SmtpClient(_config["Smtp:Server"], int.Parse(_config["Smtp:Port"]));
        var mailMessage = new MailMessage(_config["Smtp:From"], recipient, subject, message);
        await client.SendMailAsync(mailMessage);
    }
}

public class SmsService : INotificationService
{
    private readonly IConfiguration _config;
    private readonly ILogger<SmsService> _logger;

    public SmsService(IConfiguration config, ILogger<SmsService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendNotificationAsync(string recipient, string subject, string message)
    {
        _logger.LogInformation("Sending SMS to {Recipient}", recipient);
        
        // SMS sending logic using Twilio or similar
        // var twilioClient = new TwilioRestClient(_config["Twilio:AccountSid"], _config["Twilio:AuthToken"]);
        // await twilioClient.SendMessageAsync(_config["Twilio:FromNumber"], recipient, message);
    }
}

// High-level module/OrderService.cs
public class OrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly INotificationService _notificationService; // Depends on abstraction
    private readonly ILogger<OrderService> _logger;

    // Constructor injection - DIP in action
    public OrderService(
        IOrderRepository orderRepository,
        INotificationService notificationService, // Not concrete EmailService
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task<OrderResult> ProcessOrderAsync(CreateOrderDto dto)
    {
        _logger.LogInformation("Processing order for customer {CustomerId}", dto.CustomerId);

        var order = new Order
        {
            CustomerId = dto.CustomerId,
            TotalAmount = dto.Items.Sum(i => i.Quantity * i.UnitPrice),
            Status = OrderStatus.Processing,
            CreatedAt = DateTime.UtcNow
        };

        await _orderRepository.AddAsync(order);

        // Send notification using abstracted service
        await _notificationService.SendNotificationAsync(
            dto.CustomerEmail,
            "Order Confirmation",
            $"Your order #{order.Id} has been processed successfully."
        );

        return new OrderResult { Success = true, OrderId = order.Id };
    }
}

// Program.cs - Dependency registration
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<INotificationService, EmailService>(); // Can easily switch to SmsService
builder.Services.AddScoped<OrderService>();

// Controllers/OrderController.cs
[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrderController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var result = await _orderService.ProcessOrderAsync(dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}`
                },
                {
                  id: 'complete-example',
                  title: 'Complete ASP.NET Core Example',
                  code: `// Program.cs - Combining Repository, Strategy, and DIP
var builder = WebApplication.CreateBuilder(args);

// Register repositories (Repository Pattern)
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// Register strategies (Strategy Pattern)
builder.Services.AddScoped<StripePaymentStrategy>();
builder.Services.AddScoped<PayPalPaymentStrategy>();
builder.Services.AddScoped<PaymentProcessor>();

// Register services with DIP (Dependency Inversion)
builder.Services.AddScoped<INotificationService, EmailService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IProductService, ProductService>();

// Database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

var app = builder.Build();

// Controllers/ECommerceController.cs - Using all patterns
[ApiController]
[Route("api/[controller]")]
public class ECommerceController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IProductService _productService;
    private readonly PaymentProcessor _paymentProcessor;
    private readonly IServiceProvider _serviceProvider;

    public ECommerceController(
        IOrderService orderService,
        IProductService productService,
        PaymentProcessor paymentProcessor,
        IServiceProvider serviceProvider)
    {
        _orderService = orderService;
        _productService = productService;
        _paymentProcessor = paymentProcessor;
        _serviceProvider = serviceProvider;
    }

    [HttpPost("purchase")]
    public async Task<IActionResult> Purchase([FromBody] PurchaseRequest request)
    {
        // Get product using Repository Pattern
        var product = await _productService.GetProductByIdAsync(request.ProductId);
        if (product == null) return NotFound();

        // Calculate total
        var total = product.Price * request.Quantity;

        // Select payment strategy dynamically
        IPaymentStrategy strategy = request.PaymentMethod.ToLower() switch
        {
            "stripe" => _serviceProvider.GetRequiredService<StripePaymentStrategy>(),
            "paypal" => _serviceProvider.GetRequiredService<PayPalPaymentStrategy>(),
            _ => throw new ArgumentException("Invalid payment method")
        };

        _paymentProcessor.SetStrategy(strategy);
        var paymentResult = await _paymentProcessor.ProcessPaymentAsync(total, request.PaymentDetails);

        if (!paymentResult.Success)
            return BadRequest("Payment failed");

        // Create order using DIP (OrderService depends on abstractions)
        var orderDto = new CreateOrderDto
        {
            CustomerId = request.CustomerId,
            CustomerEmail = request.CustomerEmail,
            Items = new[] { new OrderItemDto { ProductId = product.Id, Quantity = request.Quantity, UnitPrice = product.Price } }
        };

        var orderResult = await _orderService.CreateOrderAsync(orderDto);

        return orderResult.Success ? Ok(new { OrderId = orderResult.OrderId, TransactionId = paymentResult.TransactionId }) : BadRequest();
    }
}

app.MapControllers();
app.Run();`
                }
              ];
            case 'aspnet-core-middleware-pattern':
              return [
                {
                  id: 'basic-middleware',
                  title: 'Basic Middleware',
                  code: `// Simple inline middleware in Program.cs
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Inline middleware
app.Use(async (context, next) =>
{
    // Before next middleware
    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
    
    await next(context);  // Call next middleware
    
    // After next middleware
    Console.WriteLine($"Response: {context.Response.StatusCode}");
});

app.MapGet("/", () => "Hello World!");
app.Run();`
                },
                {
                  id: 'custom-middleware-class',
                  title: 'Custom Middleware Class',
                  code: `// RequestLoggingMiddleware.cs
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(
        RequestDelegate next, 
        ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var startTime = DateTime.UtcNow;
        var requestId = Guid.NewGuid().ToString();
        
        _logger.LogInformation(
            "Request {RequestId}: {Method} {Path} started at {StartTime}",
            requestId, 
            context.Request.Method, 
            context.Request.Path, 
            startTime);

        try
        {
            // Call the next middleware in the pipeline
            await _next(context);
        }
        finally
        {
            var duration = DateTime.UtcNow - startTime;
            _logger.LogInformation(
                "Request {RequestId}: {Method} {Path} completed in {Duration}ms with status {StatusCode}",
                requestId,
                context.Request.Method,
                context.Request.Path,
                duration.TotalMilliseconds,
                context.Response.StatusCode);
        }
    }
}`
                },
                {
                  id: 'middleware-extension',
                  title: 'Extension Method',
                  code: `// RequestLoggingMiddlewareExtensions.cs
public static class RequestLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestLogging(
        this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RequestLoggingMiddleware>();
    }
}

// Usage in Program.cs
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Now you can use it cleanly
app.UseRequestLogging();

app.MapGet("/api/users", () => new[] { "Alice", "Bob" });
app.Run();`
                },
                {
                  id: 'api-key-middleware',
                  title: 'API Key Validation',
                  code: `// ApiKeyMiddleware.cs
public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;
    private const string API_KEY_HEADER = "X-API-Key";

    public ApiKeyMiddleware(
        RequestDelegate next, 
        IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip authentication for certain paths
        if (context.Request.Path.StartsWithSegments("/health"))
        {
            await _next(context);
            return;
        }

        if (!context.Request.Headers.TryGetValue(API_KEY_HEADER, out var apiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new 
            { 
                error = "API Key is missing" 
            });
            return; // Short-circuit the pipeline
        }

        var validApiKey = _configuration["ApiKey"];
        if (apiKey != validApiKey)
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsJsonAsync(new 
            { 
                error = "Invalid API Key" 
            });
            return; // Short-circuit the pipeline
        }

        // API key is valid, continue to next middleware
        await _next(context);
    }
}

// Extension method
public static class ApiKeyMiddlewareExtensions
{
    public static IApplicationBuilder UseApiKeyAuth(
        this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ApiKeyMiddleware>();
    }
}`
                },
                {
                  id: 'complete-pipeline',
                  title: 'Complete Pipeline',
                  code: `// Program.cs - Complete middleware pipeline
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

var app = builder.Build();

// Configure middleware pipeline (order matters!)

// 1. Exception handling (should be first)
app.UseExceptionHandler("/error");

// 2. HTTPS redirection
app.UseHttpsRedirection();

// 3. Static files
app.UseStaticFiles();

// 4. Routing
app.UseRouting();

// 5. CORS (if needed)
app.UseCors();

// 6. Custom request logging
app.UseRequestLogging();

// 7. Custom API key authentication
app.UseApiKeyAuth();

// 8. Built-in authentication
app.UseAuthentication();

// 9. Built-in authorization
app.UseAuthorization();

// 10. Endpoint mapping
app.MapControllers();
app.MapGet("/", () => "API is running");
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.Run();`
                }
              ];
            case 'strategy-pattern-design-pattern':
              return [
                {
                  id: 'bad-approach',
                  title: 'Bad Approach',
                  code: `public class PaymentProcessor
{
    public void ProcessPayment(decimal amount, string method)
    {
        if (method == "credit-card")
        {
            // Credit card logic
            Console.WriteLine("Processing credit card payment...");
        }
        else if (method == "paypal")
        {
            // PayPal logic
            Console.WriteLine("Processing PayPal payment...");
        }
        else if (method == "crypto")
        {
            // Cryptocurrency logic
            Console.WriteLine("Processing crypto payment...");
        }
        else if (method == "bank-transfer")
        {
            // Bank transfer logic
            Console.WriteLine("Processing bank transfer...");
        }
    }
}`
                },
                {
                  id: 'strategy-interface',
                  title: 'Strategy Interface',
                  code: `// Strategy Interface
public interface IPaymentStrategy
{
    void Pay(decimal amount);
}`
                },
                {
                  id: 'concrete-strategies',
                  title: 'Concrete Strategies',
                  code: `// Concrete Strategies
public class CreditCardPayment : IPaymentStrategy
{
    private readonly string _cardNumber;
    private readonly string _cvv;
    private readonly string _expiryDate;

    public CreditCardPayment(string cardNumber, string cvv, string expiryDate)
    {
        _cardNumber = cardNumber;
        _cvv = cvv;
        _expiryDate = expiryDate;
    }

    public void Pay(decimal amount)
    {
        Console.WriteLine($"Processing credit card payment of {amount}");
        Console.WriteLine($"Card: ****{_cardNumber.Substring(_cardNumber.Length - 4)}");
        // Actual credit card processing logic
    }
}

public class PayPalPayment : IPaymentStrategy
{
    private readonly string _email;

    public PayPalPayment(string email)
    {
        _email = email;
    }

    public void Pay(decimal amount)
    {
        Console.WriteLine($"Processing PayPal payment of {amount}");
        Console.WriteLine($"Account: {_email}");
        // Actual PayPal processing logic
    }
}`
                },
                {
                  id: 'context-class',
                  title: 'Context Class',
                  code: `// Context
public class PaymentProcessor
{
    private IPaymentStrategy _strategy;

    public PaymentProcessor(IPaymentStrategy strategy)
    {
        _strategy = strategy;
    }

    public void SetStrategy(IPaymentStrategy strategy)
    {
        _strategy = strategy;
    }

    public void ProcessPayment(decimal amount)
    {
        _strategy.Pay(amount);
    }
}`
                },
                {
                  id: 'usage-example',
                  title: 'Usage Example',
                  code: `// Client code
var processor = new PaymentProcessor(
    new CreditCardPayment("1234567890123456", "123", "12/28")
);

processor.ProcessPayment(100);
// Output: Processing credit card payment of $100
//         Card: ****3456

// Switch strategy at runtime
processor.SetStrategy(new PayPalPayment("user@example.com"));
processor.ProcessPayment(50);
// Output: Processing PayPal payment of $50
//         Account: user@example.com`
                }
              ];
            case 'dependency-inversion-principle':
              return [
                {
                  id: 'tight-coupling',
                  title: 'Tight Coupling (Bad)',
                  code: `public class EmailService
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
}`
                },
                {
                  id: 'abstraction',
                  title: 'Define Abstraction',
                  code: `public interface INotificationService
{
    void Send(string recipient, string subject, string message);
}`
                },
                {
                  id: 'concrete-implementations',
                  title: 'Concrete Implementations',
                  code: `public class EmailService : INotificationService
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
}`
                },
                {
                  id: 'dependency-injection',
                  title: 'Dependency Injection',
                  code: `public class OrderProcessor
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
smsProcessor.ProcessOrder(order);`
                }
              ];
            case 'repository-pattern':
              return [
                {
                  id: 'tight-coupling',
                  title: 'Tight Coupling (Bad)',
                  code: `public class OrderService
{
    private readonly SqlConnection _connection;

    public OrderService(string connectionString)
    {
        _connection = new SqlConnection(connectionString);
    }

    public Order GetOrder(int orderId)
    {
        var command = new SqlCommand("SELECT * FROM Orders WHERE Id = @Id", _connection);
        command.Parameters.AddWithValue("@Id", orderId);
        
        _connection.Open();
        var reader = command.ExecuteReader();
        // Manual mapping logic...
        _connection.Close();
        
        return order;
    }
}`
                },
                {
                  id: 'repository-interface',
                  title: 'Repository Interface',
                  code: `public interface IOrderRepository
{
    Order GetById(int id);
    IEnumerable<Order> GetAll();
    void Add(Order order);
    void Update(Order order);
    void Delete(int id);
}`
                },
                {
                  id: 'concrete-repository',
                  title: 'Concrete Repository',
                  code: `public class SqlOrderRepository : IOrderRepository
{
    private readonly string _connectionString;

    public SqlOrderRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public Order GetById(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            var command = new SqlCommand("SELECT * FROM Orders WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            
            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return new Order
                    {
                        Id = (int)reader["Id"],
                        CustomerId = (int)reader["CustomerId"],
                        Total = (decimal)reader["Total"],
                        Status = (string)reader["Status"]
                    };
                }
            }
        }
        return null;
    }

    public IEnumerable<Order> GetAll()
    {
        var orders = new List<Order>();
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            var command = new SqlCommand("SELECT * FROM Orders", connection);
            
            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    orders.Add(new Order
                    {
                        Id = (int)reader["Id"],
                        CustomerId = (int)reader["CustomerId"],
                        Total = (decimal)reader["Total"],
                        Status = (string)reader["Status"]
                    });
                }
            }
        }
        return orders;
    }

    public void Add(Order order)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            var command = new SqlCommand(
                "INSERT INTO Orders (CustomerId, Total, Status) VALUES (@CustomerId, @Total, @Status)",
                connection);
            command.Parameters.AddWithValue("@CustomerId", order.CustomerId);
            command.Parameters.AddWithValue("@Total", order.Total);
            command.Parameters.AddWithValue("@Status", order.Status);
            command.ExecuteNonQuery();
        }
    }

    public void Update(Order order)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            var command = new SqlCommand(
                "UPDATE Orders SET CustomerId = @CustomerId, Total = @Total, Status = @Status WHERE Id = @Id",
                connection);
            command.Parameters.AddWithValue("@Id", order.Id);
            command.Parameters.AddWithValue("@CustomerId", order.CustomerId);
            command.Parameters.AddWithValue("@Total", order.Total);
            command.Parameters.AddWithValue("@Status", order.Status);
            command.ExecuteNonQuery();
        }
    }

    public void Delete(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            var command = new SqlCommand("DELETE FROM Orders WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            command.ExecuteNonQuery();
        }
    }
}`
                },
                {
                  id: 'service-layer',
                  title: 'Service Layer',
                  code: `public class OrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public Order GetOrder(int orderId)
    {
        return _orderRepository.GetById(orderId);
    }

    public IEnumerable<Order> GetAllOrders()
    {
        return _orderRepository.GetAll();
    }

    public void CreateOrder(Order order)
    {
        // Business logic validation
        if (order.Total <= 0)
            throw new ArgumentException("Order total must be greater than zero");

        _orderRepository.Add(order);
    }

    public void UpdateOrder(Order order)
    {
        // Business logic validation
        if (order.Total <= 0)
            throw new ArgumentException("Order total must be greater than zero");

        _orderRepository.Update(order);
    }

    public void CancelOrder(int orderId)
    {
        var order = _orderRepository.GetById(orderId);
        if (order != null)
        {
            order.Status = "Cancelled";
            _orderRepository.Update(order);
        }
    }
}`
                },
                {
                  id: 'usage-example',
                  title: 'Usage Example',
                  code: `// In Startup.cs or Program.cs
services.AddScoped<IOrderRepository, SqlOrderRepository>();
services.AddScoped<OrderService>();

// In controller or service
public class OrderController
{
    private readonly OrderService _orderService;

    public OrderController(OrderService orderService)
    {
        _orderService = orderService;
    }

    public IActionResult GetOrder(int id)
    {
        var order = _orderService.GetOrder(id);
        if (order == null)
            return NotFound();
        
        return Ok(order);
    }

    public IActionResult CreateOrder(CreateOrderRequest request)
    {
        var order = new Order
        {
            CustomerId = request.CustomerId,
            Total = request.Total,
            Status = "Pending"
        };

        _orderService.CreateOrder(order);
        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }
}`
                }
              ];
            case 'singleton-design-pattern':
              return [
                {
                  id: 'thread-safe-singleton',
                  title: 'Thread-Safe Singleton (C#)',
                  code: `public sealed class ConfigurationManager
{
    private static readonly Lazy<ConfigurationManager> _instance = 
        new Lazy<ConfigurationManager>(() => new ConfigurationManager());

    private Dictionary<string, string> _settings;

    private ConfigurationManager()
    {
        // Private constructor prevents external instantiation
        _settings = new Dictionary<string, string>();
        LoadConfiguration();
    }

    public static ConfigurationManager Instance => _instance.Value;

    private void LoadConfiguration()
    {
        // Load configuration from file or environment
        _settings["AppName"] = "My Application";
        _settings["Version"] = "1.0.0";
    }

    public string GetSetting(string key)
    {
        return _settings.ContainsKey(key) ? _settings[key] : null;
    }

    public void SetSetting(string key, string value)
    {
        _settings[key] = value;
    }
}

// Usage
var config = ConfigurationManager.Instance;
Console.WriteLine(config.GetSetting("AppName"));`
                },
                {
                  id: 'module-pattern-js',
                  title: 'Module Pattern (JavaScript)',
                  code: `class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {
    // Private constructor
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = \`\${timestamp}: \${message}\`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }
}

// Usage
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

console.log(logger1 === logger2); // true

logger1.log("Application started");
logger2.log("User logged in");

console.log(logger1.getLogs());`
                },
                {
                  id: 'double-checked-locking',
                  title: 'Double-Checked Locking',
                  code: `public sealed class Singleton
{
    private static Singleton _instance;
    private static readonly object _lock = new object();

    private Singleton()
    {
        // Private constructor
    }

    public static Singleton Instance
    {
        get
        {
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new Singleton();
                    }
                }
            }
            return _instance;
        }
    }

    public void DoSomething()
    {
        Console.WriteLine("Singleton instance doing something");
    }
}

// Usage (thread-safe)
var singleton1 = Singleton.Instance;
var singleton2 = Singleton.Instance;
Console.WriteLine(singleton1 == singleton2); // true`
                },
                {
                  id: 'static-initialization',
                  title: 'Static Initialization',
                  code: `public sealed class Singleton
{
    private static readonly Singleton _instance = new Singleton();

    private Singleton()
    {
        // Private constructor
    }

    public static Singleton Instance
    {
        get { return _instance; }
    }

    public void DoSomething()
    {
        Console.WriteLine("Singleton instance doing something");
    }
}

// Usage (thread-safe by CLR)
var singleton1 = Singleton.Instance;
var singleton2 = Singleton.Instance;
Console.WriteLine(singleton1 == singleton2); // true`
                },
                {
                  id: 'anti-patterns',
                  title: 'Common Anti-Patterns',
                  code: `// Anti-pattern 1: Not thread-safe
public class NotThreadSafeSingleton
{
    private static NotThreadSafeSingleton _instance;

    private NotThreadSafeSingleton() { }

    public static NotThreadSafeSingleton Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = new NotThreadSafeSingleton(); // Race condition!
            }
            return _instance;
        }
    }
}

// Anti-pattern 2: Overly complex
public class OverlyComplexSingleton
{
    private static volatile OverlyComplexSingleton _instance;
    private static object _lock = new object();

    private OverlyComplexSingleton()
    {
        // Complex initialization
        Thread.Sleep(1000); // Simulate slow initialization
    }

    public static OverlyComplexSingleton Instance
    {
        get
        {
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new OverlyComplexSingleton();
                    }
                }
            }
            return _instance;
        }
    }
}`
                }
              ];
            default:
              return [];
          }
        };

        elements.push(
          <InteractiveCodeEditor
            key={`editor-${index}`}
            tabs={getTabsForPost(post.slug)}
            defaultTab={getTabsForPost(post.slug)[0]?.id || ''}
          />
        );
      }
    });

    return elements;
  }, [post]);

  // Apply syntax highlighting to code blocks after render
  useEffect(() => {
    hljs.highlightAll();
  }, [renderContent]);

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-light text-white mb-4">Post Not Found</h1>
            <Link href="/blog" className="text-purple-400 hover:text-purple-300">
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Left side SVG pattern */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-48 opacity-30 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="left-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="#a855f7" />
              <circle cx="0" cy="0" r="1" fill="#a855f7" opacity="0.5" />
              <circle cx="60" cy="0" r="1" fill="#a855f7" opacity="0.5" />
              <circle cx="0" cy="60" r="1" fill="#a855f7" opacity="0.5" />
              <path d="M30 0 L30 60" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
              <path d="M0 30 L60 30" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#left-pattern)" />
        </svg>
      </div>

      {/* Right side SVG pattern */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-48 opacity-30 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="right-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="#a855f7" />
              <circle cx="0" cy="0" r="1" fill="#a855f7" opacity="0.5" />
              <circle cx="60" cy="0" r="1" fill="#a855f7" opacity="0.5" />
              <circle cx="0" cy="60" r="1" fill="#a855f7" opacity="0.5" />
              <path d="M30 0 L30 60" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
              <path d="M0 30 L60 30" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#right-pattern)" />
        </svg>
      </div>

      <Navbar />
      <main className="flex-1 pt-16 relative z-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/blog" className="text-purple-400 hover:text-purple-300 mb-8 inline-block">
            ← Back to Blog
          </Link>
          
          <article className="prose prose-invert prose-purple max-w-none">
            <div className="mb-8">
              <span className="text-xs text-purple-400 uppercase tracking-wider">{post.category}</span>
              <h1 className="text-5xl font-light text-white mt-4 mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-12"></div>

            <article className="text-gray-300 leading-relaxed space-y-6">
              {renderContent}
            </article>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
