import { BlogPost } from './types';

export const singletonPatternPost: BlogPost = {
  slug: "singleton-design-pattern",
  title: "The Singleton Pattern: Ensuring Single Instance Control",
  excerpt: "Learn how the Singleton Pattern guarantees that a class has only one instance while providing global access to that instance.",
  date: "January 11, 2026",
  author: "Matthew Holmes",
  readTime: "10 min read",
  category: "Design Patterns",
  content: `
# The Singleton Pattern: Ensuring Single Instance Control

## What is the Singleton Pattern?

The Singleton Pattern is a creational design pattern that restricts the instantiation of a class to a single instance and provides a global point of access to that instance. It's one of the most well-known design patterns, yet also one of the most controversial.

## The Problem It Solves

Imagine you're building an application that needs to manage configuration settings, logging, or database connections. You want to ensure that:
- Only one instance of the configuration manager exists throughout the application
- All parts of your application access the same configuration object
- The instance is created lazily (only when needed)
- Thread-safe access in multi-threaded environments

Without the Singleton Pattern, you might accidentally create multiple instances, leading to inconsistent state and wasted resources.

## Implementation Approaches

### 1. Thread-Safe Singleton (C#)

\`\`\`csharp
public sealed class ConfigurationManager
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
Console.WriteLine(config.GetSetting("AppName"));
\`\`\`

### 2. Module Pattern (JavaScript/TypeScript)

\`\`\`typescript
class Logger {
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
    this.logs.push(\`[\${timestamp}] \${message}\`);
    console.log(\`[\${timestamp}] \${message}\`);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

// Usage
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

logger1.log("First message");
logger2.log("Second message");

console.log(logger1 === logger2); // true - same instance
console.log(logger1.getLogs()); // Both messages appear
\`\`\`

### 3. Double-Checked Locking (Java)

\`\`\`java
public class DatabaseConnection {
    private static volatile DatabaseConnection instance;
    private Connection connection;

    private DatabaseConnection() {
        try {
            connection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/mydb",
                "username",
                "password"
            );
        } catch (SQLException e) {
            throw new RuntimeException("Failed to create connection", e);
        }
    }

    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }

    public Connection getConnection() {
        return connection;
    }
}

// Usage
DatabaseConnection db = DatabaseConnection.getInstance();
Connection conn = db.getConnection();
\`\`\`

### 4. Bill Pugh Singleton (Java)

\`\`\`java
public class CacheManager {
    private Map<String, Object> cache;

    private CacheManager() {
        cache = new ConcurrentHashMap<>();
    }

    private static class SingletonHelper {
        private static final CacheManager INSTANCE = new CacheManager();
    }

    public static CacheManager getInstance() {
        return SingletonHelper.INSTANCE;
    }

    public void put(String key, Object value) {
        cache.put(key, value);
    }

    public Object get(String key) {
        return cache.get(key);
    }

    public void clear() {
        cache.clear();
    }
}
\`\`\`

## Real-World Use Cases

### 1. Application Configuration

\`\`\`csharp
public sealed class AppConfig
{
    private static readonly Lazy<AppConfig> _instance = 
        new Lazy<AppConfig>(() => new AppConfig());

    private readonly IConfiguration _configuration;

    private AppConfig()
    {
        _configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddEnvironmentVariables()
            .Build();
    }

    public static AppConfig Instance => _instance.Value;

    public string ConnectionString => 
        _configuration.GetConnectionString("DefaultConnection");

    public string ApiKey => 
        _configuration["ApiSettings:ApiKey"];

    public int MaxRetries => 
        int.Parse(_configuration["AppSettings:MaxRetries"]);
}

// Usage throughout the application
var connectionString = AppConfig.Instance.ConnectionString;
\`\`\`

### 2. Logging System

\`\`\`typescript
enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR
}

class ApplicationLogger {
  private static instance: ApplicationLogger;
  private logLevel: LogLevel = LogLevel.INFO;
  private logFile: string = 'app.log';

  private constructor() {}

  public static getInstance(): ApplicationLogger {
    if (!ApplicationLogger.instance) {
      ApplicationLogger.instance = new ApplicationLogger();
    }
    return ApplicationLogger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public debug(message: string): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      this.writeLog('DEBUG', message);
    }
  }

  public info(message: string): void {
    if (this.logLevel <= LogLevel.INFO) {
      this.writeLog('INFO', message);
    }
  }

  public warn(message: string): void {
    if (this.logLevel <= LogLevel.WARN) {
      this.writeLog('WARN', message);
    }
  }

  public error(message: string): void {
    if (this.logLevel <= LogLevel.ERROR) {
      this.writeLog('ERROR', message);
    }
  }

  private writeLog(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(\`[\${timestamp}] [\${level}] \${message}\`);
    // Also write to file in production
  }
}

// Usage
const logger = ApplicationLogger.getInstance();
logger.setLogLevel(LogLevel.DEBUG);
logger.debug("Application started");
logger.info("User logged in");
logger.error("Database connection failed");
\`\`\`

### 3. Thread Pool Manager

\`\`\`csharp
public sealed class ThreadPoolManager
{
    private static readonly Lazy<ThreadPoolManager> _instance = 
        new Lazy<ThreadPoolManager>(() => new ThreadPoolManager());

    private readonly int _maxThreads;
    private readonly SemaphoreSlim _semaphore;

    private ThreadPoolManager()
    {
        _maxThreads = Environment.ProcessorCount * 2;
        _semaphore = new SemaphoreSlim(_maxThreads, _maxThreads);
    }

    public static ThreadPoolManager Instance => _instance.Value;

    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)
    {
        await _semaphore.WaitAsync();
        try
        {
            return await operation();
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public int AvailableThreads => _semaphore.CurrentCount;
}

// Usage
var result = await ThreadPoolManager.Instance.ExecuteAsync(async () =>
{
    // Perform expensive operation
    await Task.Delay(1000);
    return "Result";
});
\`\`\`

## Benefits

1. **Controlled Access**: Single point of access to the instance
2. **Lazy Initialization**: Instance created only when needed
3. **Global Access**: Available throughout the application
4. **Memory Efficiency**: Only one instance in memory
5. **State Consistency**: Shared state across the application

## Common Pitfalls

### 1. Testing Difficulties

\`\`\`csharp
// Hard to test
public class OrderService
{
    public void ProcessOrder(Order order)
    {
        // Tightly coupled to singleton
        var logger = Logger.Instance;
        logger.Log("Processing order: " + order.Id);
    }
}

// Better approach: Dependency Injection
public class OrderService
{
    private readonly ILogger _logger;

    public OrderService(ILogger logger)
    {
        _logger = logger;
    }

    public void ProcessOrder(Order order)
    {
        _logger.Log("Processing order: " + order.Id);
    }
}
\`\`\`

### 2. Thread Safety Issues

\`\`\`csharp
// NOT thread-safe
public class UnsafeSingleton
{
    private static UnsafeSingleton _instance;

    public static UnsafeSingleton Instance
    {
        get
        {
            if (_instance == null) // Race condition!
            {
                _instance = new UnsafeSingleton();
            }
            return _instance;
        }
    }
}

// Thread-safe version
public sealed class SafeSingleton
{
    private static readonly Lazy<SafeSingleton> _instance = 
        new Lazy<SafeSingleton>(() => new SafeSingleton());

    public static SafeSingleton Instance => _instance.Value;
}
\`\`\`

### 3. Hidden Dependencies

Singletons create hidden dependencies that make code harder to understand and maintain.

## When to Use the Singleton Pattern

✅ **Use when:**
- You need exactly one instance of a class
- The instance must be accessible from multiple points in the application
- You're managing shared resources (connection pools, caches, configuration)
- Lazy initialization is beneficial

❌ **Don't use when:**
- You can use dependency injection instead
- You need multiple instances in the future
- It makes testing more difficult
- It creates tight coupling in your codebase

## Modern Alternatives

### Dependency Injection Container

\`\`\`csharp
// Instead of Singleton
services.AddSingleton<ILogger, Logger>();
services.AddSingleton<IConfiguration, Configuration>();

// Usage via constructor injection
public class MyService
{
    private readonly ILogger _logger;
    private readonly IConfiguration _config;

    public MyService(ILogger logger, IConfiguration config)
    {
        _logger = logger;
        _config = config;
    }
}
\`\`\`

### Module Pattern (JavaScript)

\`\`\`javascript
// ES6 modules are singletons by default
export const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

export function getApiUrl() {
  return config.apiUrl;
}
\`\`\`

## Singleton vs Static Classes

| Feature | Singleton | Static Class |
|---------|-----------|--------------|
| Instantiation | Controlled instance creation | No instantiation |
| Inheritance | Can implement interfaces | Cannot be inherited |
| Polymorphism | Supports polymorphism | No polymorphism |
| Lazy Loading | Supports lazy initialization | All members loaded immediately |
| State | Can maintain state | Can maintain state (static fields) |
| Testability | Difficult but possible | Very difficult to test |

## Best Practices

1. **Make the constructor private** to prevent external instantiation
2. **Use thread-safe initialization** in multi-threaded environments
3. **Seal the class** (C#) to prevent inheritance
4. **Consider lazy initialization** for resource-intensive objects
5. **Prefer dependency injection** over direct singleton access when possible
6. **Document the singleton** behavior clearly
7. **Be cautious with serialization** - it can break singleton guarantee

## Conclusion

The Singleton Pattern is a powerful tool for ensuring single-instance control, but it should be used judiciously. While it solves specific problems elegantly, it can also introduce tight coupling and testing challenges.

In modern applications, dependency injection containers often provide a better alternative, offering the same single-instance behavior with improved testability and flexibility. However, for scenarios like logging, configuration management, and resource pooling, a well-implemented Singleton remains a valid and effective solution.

Remember: the goal is not to avoid Singletons entirely, but to use them thoughtfully where they provide genuine value without compromising code quality and maintainability.

---

*Do you use Singletons in your projects? What alternatives have you found effective? Share your thoughts in the comments below!*
  `
};
