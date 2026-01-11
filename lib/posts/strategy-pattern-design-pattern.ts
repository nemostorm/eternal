import { BlogPost } from './types';

export const strategyPatternPost: BlogPost = {
  slug: "strategy-pattern-design-pattern",
  title: "The Strategy Pattern: A Design Pattern for Flexible Algorithms",
  excerpt: "Learn how the Strategy Pattern enables you to define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.",
  date: "January 11, 2026",
  author: "Matthew Holmes",
  readTime: "12 min read",
  category: "Design Patterns",
  content: `
# The Strategy Pattern: A Design Pattern for Flexible Algorithms

## What is the Strategy Pattern?

The Strategy Pattern is a behavioral design pattern that enables selecting an algorithm's behavior at runtime. Instead of implementing a single algorithm directly, code receives runtime instructions about which in a family of algorithms to use.

## The Problem It Solves

Imagine you're building a payment processing system. You need to support multiple payment methods: credit card, PayPal, cryptocurrency, and bank transfer. Without the Strategy Pattern, you might end up with code like this:

\`\`\`csharp
public class PaymentProcessor
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
}
\`\`\`

This approach has several problems:
- **Violates Open/Closed Principle**: Adding new payment methods requires modifying existing code
- **Hard to Test**: Each payment method can't be tested in isolation
- **Poor Maintainability**: The class becomes bloated with multiple conditional statements
- **Lack of Flexibility**: Can't easily switch payment strategies at runtime

## The Solution: Strategy Pattern

The Strategy Pattern solves these issues by:
1. Defining a family of algorithms (payment methods)
2. Encapsulating each algorithm in its own class
3. Making them interchangeable through a common interface

### Structure

\`\`\`csharp
// Strategy Interface
public interface IPaymentStrategy
{
    void Pay(decimal amount);
}

// Concrete Strategies
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
}

public class CryptoPayment : IPaymentStrategy
{
    private readonly string _walletAddress;

    public CryptoPayment(string walletAddress)
    {
        _walletAddress = walletAddress;
    }

    public void Pay(decimal amount)
    {
        Console.WriteLine($"Processing crypto payment of {amount}");
        Console.WriteLine($"Wallet: {_walletAddress}");
        // Actual cryptocurrency processing logic
    }
}

public class BankTransferPayment : IPaymentStrategy
{
    private readonly string _accountNumber;
    private readonly string _routingNumber;

    public BankTransferPayment(string accountNumber, string routingNumber)
    {
        _accountNumber = accountNumber;
        _routingNumber = routingNumber;
    }

    public void Pay(decimal amount)
    {
        Console.WriteLine($"Processing bank transfer of {amount}");
        Console.WriteLine($"Account: ****{_accountNumber.Substring(_accountNumber.Length - 4)}");
        // Actual bank transfer logic
    }
}

// Context
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
}
\`\`\`

### Usage Example

\`\`\`csharp
// Client code
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
//         Account: user@example.com

// Use crypto
processor.SetStrategy(new CryptoPayment("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"));
processor.ProcessPayment(200);
// Output: Processing crypto payment of $200
//         Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
\`\`\`

## Real-World Applications

### 1. Sorting Algorithms
\`\`\`csharp
public interface ISortStrategy
{
    int[] Sort(int[] data);
}

public class QuickSort : ISortStrategy
{
    public int[] Sort(int[] data)
    {
        // QuickSort implementation
        Array.Sort(data);
        return data;
    }
}

public class MergeSort : ISortStrategy
{
    public int[] Sort(int[] data)
    {
        // MergeSort implementation
        Array.Sort(data);
        return data;
    }
}

public class Sorter
{
    private ISortStrategy _strategy;

    public Sorter(ISortStrategy strategy)
    {
        _strategy = strategy;
    }

    public int[] SortData(int[] data)
    {
        return _strategy.Sort(data);
    }
}
\`\`\`

### 2. Compression Strategies
\`\`\`csharp
public interface ICompressionStrategy
{
    string Compress(string file);
}

public class ZipCompression : ICompressionStrategy
{
    public string Compress(string file)
    {
        return $"Compressing {file} using ZIP";
    }
}

public class RarCompression : ICompressionStrategy
{
    public string Compress(string file)
    {
        return $"Compressing {file} using RAR";
    }
}

public class FileCompressor
{
    private ICompressionStrategy _strategy;

    public FileCompressor(ICompressionStrategy strategy)
    {
        _strategy = strategy;
    }

    public string CompressFile(string file)
    {
        return _strategy.Compress(file);
    }
}
\`\`\`

### 3. Validation Strategies
\`\`\`csharp
using System.Text.RegularExpressions;

public interface IValidationStrategy
{
    bool Validate(string value);
}

public class EmailValidation : IValidationStrategy
{
    public bool Validate(string value)
    {
        var emailRegex = new Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$");
        return emailRegex.IsMatch(value);
    }
}

public class PhoneValidation : IValidationStrategy
{
    public bool Validate(string value)
    {
        var phoneRegex = new Regex(@"^\+?[1-9]\d{1,14}$");
        return phoneRegex.IsMatch(value);
    }
}

public class Validator
{
    private IValidationStrategy _strategy;

    public Validator(IValidationStrategy strategy)
    {
        _strategy = strategy;
    }

    public bool IsValid(string value)
    {
        return _strategy.Validate(value);
    }
}
\`\`\`

## Benefits

1. **Open/Closed Principle**: Open for extension, closed for modification
2. **Single Responsibility**: Each strategy focuses on one algorithm
3. **Runtime Flexibility**: Switch algorithms dynamically
4. **Testability**: Each strategy can be tested independently
5. **Eliminates Conditionals**: No more long if-else chains
6. **Composition over Inheritance**: More flexible than inheritance-based solutions

## When to Use the Strategy Pattern

✅ **Use when:**
- You have multiple algorithms for a specific task
- You need to switch between algorithms at runtime
- You want to isolate algorithm implementation from the code that uses it
- You have classes that differ only in behavior

❌ **Don't use when:**
- You only have one algorithm that rarely changes
- The algorithms are too simple to warrant separate classes
- The overhead of creating multiple classes outweighs the benefits

## Strategy vs State Pattern

While similar in structure, these patterns have different intents:
- **Strategy**: Focuses on making algorithms interchangeable
- **State**: Focuses on changing object behavior based on internal state

## Conclusion

The Strategy Pattern is a powerful tool for writing flexible, maintainable code. By encapsulating algorithms into separate classes, you create a system that's easy to extend, test, and modify. Whether you're processing payments, sorting data, or validating input, the Strategy Pattern helps you build robust applications that can adapt to changing requirements.

Remember: favor composition over inheritance, and always keep your code open for extension but closed for modification.

---

  `
};
