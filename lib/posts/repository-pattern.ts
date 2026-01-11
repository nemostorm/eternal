import { BlogPost } from './types';

export const repositoryPatternPost: BlogPost = {
  slug: "repository-pattern",
  title: "The Repository Pattern: Abstracting Data Access Logic",
  excerpt: "Discover how the Repository Pattern provides a clean separation between your business logic and data access layer, making your code more maintainable and testable.",
  date: "January 11, 2026",
  author: "Matthew Holmes",
  readTime: "11 min read",
  category: "Design Patterns",
  content: `
# The Repository Pattern: Abstracting Data Access Logic

## What is the Repository Pattern?

The Repository Pattern is a design pattern that mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects. It acts as an abstraction layer between your business logic and data access code, making your application more maintainable, testable, and flexible.

## The Problem It Solves

Imagine you're building an e-commerce application. Without the Repository Pattern, your business logic might be tightly coupled to your database:

\`\`\`csharp
public class OrderService
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
}
\`\`\`

This approach has several problems:
- **Tight Coupling**: Business logic is directly tied to SQL Server
- **Hard to Test**: Requires a real database for unit tests
- **Code Duplication**: Data access logic repeated across services
- **Difficult to Switch**: Can't easily change to a different database
- **Violates SRP**: Service handles both business logic and data access

## The Solution: Repository Pattern

The Repository Pattern solves these issues by creating an abstraction layer:

### Basic Implementation (C#)

\`\`\`csharp
// Domain Model
public class Order
{
    public int Id { get; set; }
    public string CustomerName { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime OrderDate { get; set; }
    public List<OrderItem> Items { get; set; }
}

// Repository Interface
public interface IOrderRepository
{
    Order GetById(int id);
    IEnumerable<Order> GetAll();
    IEnumerable<Order> GetByCustomer(string customerName);
    void Add(Order order);
    void Update(Order order);
    void Delete(int id);
}

// Concrete Repository Implementation
public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;

    public OrderRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Order GetById(int id)
    {
        return _context.Orders
            .Include(o => o.Items)
            .FirstOrDefault(o => o.Id == id);
    }

    public IEnumerable<Order> GetAll()
    {
        return _context.Orders
            .Include(o => o.Items)
            .ToList();
    }

    public IEnumerable<Order> GetByCustomer(string customerName)
    {
        return _context.Orders
            .Include(o => o.Items)
            .Where(o => o.CustomerName == customerName)
            .ToList();
    }

    public void Add(Order order)
    {
        _context.Orders.Add(order);
        _context.SaveChanges();
    }

    public void Update(Order order)
    {
        _context.Orders.Update(order);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var order = _context.Orders.Find(id);
        if (order != null)
        {
            _context.Orders.Remove(order);
            _context.SaveChanges();
        }
    }
}

// Service using Repository
public class OrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public void ProcessOrder(int orderId)
    {
        var order = _orderRepository.GetById(orderId);
        
        // Business logic here
        order.TotalAmount = CalculateTotal(order);
        
        _orderRepository.Update(order);
    }

    private decimal CalculateTotal(Order order)
    {
        return order.Items.Sum(i => i.Price * i.Quantity);
    }
}
\`\`\`

### TypeScript/Node.js Implementation

\`\`\`typescript
// Domain Model
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Repository Interface
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

// MongoDB Implementation
class MongoUserRepository implements IUserRepository {
  private collection: Collection<User>;

  constructor(db: Db) {
    this.collection = db.collection<User>('users');
  }

  async findById(id: string): Promise<User | null> {
    return await this.collection.findOne({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.collection.findOne({ email });
  }

  async findAll(): Promise<User[]> {
    return await this.collection.find({}).toArray();
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: new ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.collection.insertOne(user);
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const result = await this.collection.findOneAndUpdate(
      { id },
      { $set: { ...userData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return result.value;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

// PostgreSQL Implementation
class PostgresUserRepository implements IUserRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async findAll(): Promise<User[]> {
    const result = await this.pool.query('SELECT * FROM users');
    return result.rows;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const result = await this.pool.query(
      \`INSERT INTO users (email, name, created_at, updated_at) 
       VALUES ($1, $2, NOW(), NOW()) 
       RETURNING *\`,
      [userData.email, userData.name]
    );
    return result.rows[0];
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const fields = Object.keys(userData).map((key, index) => \`\${key} = $\${index + 2}\`).join(', ');
    const values = Object.values(userData);
    
    const result = await this.pool.query(
      \`UPDATE users SET \${fields}, updated_at = NOW() WHERE id = $1 RETURNING *\`,
      [id, ...values]
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

// Service using Repository
class UserService {
  constructor(private userRepository: IUserRepository) {}

  async registerUser(email: string, name: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    return await this.userRepository.create({ email, name });
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
\`\`\`

## Generic Repository Pattern

\`\`\`csharp
// Generic Repository Interface
public interface IRepository<T> where T : class
{
    T GetById(int id);
    IEnumerable<T> GetAll();
    IEnumerable<T> Find(Expression<Func<T, bool>> predicate);
    void Add(T entity);
    void AddRange(IEnumerable<T> entities);
    void Update(T entity);
    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);
}

// Generic Repository Implementation
public class Repository<T> : IRepository<T> where T : class
{
    protected readonly DbContext Context;

    public Repository(DbContext context)
    {
        Context = context;
    }

    public T GetById(int id)
    {
        return Context.Set<T>().Find(id);
    }

    public IEnumerable<T> GetAll()
    {
        return Context.Set<T>().ToList();
    }

    public IEnumerable<T> Find(Expression<Func<T, bool>> predicate)
    {
        return Context.Set<T>().Where(predicate).ToList();
    }

    public void Add(T entity)
    {
        Context.Set<T>().Add(entity);
    }

    public void AddRange(IEnumerable<T> entities)
    {
        Context.Set<T>().AddRange(entities);
    }

    public void Update(T entity)
    {
        Context.Set<T>().Update(entity);
    }

    public void Remove(T entity)
    {
        Context.Set<T>().Remove(entity);
    }

    public void RemoveRange(IEnumerable<T> entities)
    {
        Context.Set<T>().RemoveRange(entities);
    }
}

// Usage
public class ProductRepository : Repository<Product>
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
    }

    public IEnumerable<Product> GetExpensiveProducts(decimal minPrice)
    {
        return Find(p => p.Price >= minPrice);
    }

    public Product GetWithCategory(int id)
    {
        return Context.Products
            .Include(p => p.Category)
            .FirstOrDefault(p => p.Id == id);
    }
}
\`\`\`

## Unit of Work Pattern

The Repository Pattern is often combined with the Unit of Work pattern:

\`\`\`csharp
public interface IUnitOfWork : IDisposable
{
    IOrderRepository Orders { get; }
    IProductRepository Products { get; }
    ICustomerRepository Customers { get; }
    
    int Complete();
}

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        Orders = new OrderRepository(_context);
        Products = new ProductRepository(_context);
        Customers = new CustomerRepository(_context);
    }

    public IOrderRepository Orders { get; private set; }
    public IProductRepository Products { get; private set; }
    public ICustomerRepository Customers { get; private set; }

    public int Complete()
    {
        return _context.SaveChanges();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}

// Usage
public class OrderService
{
    private readonly IUnitOfWork _unitOfWork;

    public OrderService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public void CreateOrder(Order order)
    {
        // Validate product availability
        foreach (var item in order.Items)
        {
            var product = _unitOfWork.Products.GetById(item.ProductId);
            if (product.Stock < item.Quantity)
            {
                throw new Exception("Insufficient stock");
            }
            
            product.Stock -= item.Quantity;
            _unitOfWork.Products.Update(product);
        }

        // Add order
        _unitOfWork.Orders.Add(order);

        // Save all changes in a single transaction
        _unitOfWork.Complete();
    }
}
\`\`\`

## Specification Pattern with Repository

\`\`\`csharp
// Specification Interface
public interface ISpecification<T>
{
    Expression<Func<T, bool>> Criteria { get; }
    List<Expression<Func<T, object>>> Includes { get; }
}

// Base Specification
public abstract class BaseSpecification<T> : ISpecification<T>
{
    protected BaseSpecification(Expression<Func<T, bool>> criteria)
    {
        Criteria = criteria;
    }

    public Expression<Func<T, bool>> Criteria { get; }
    public List<Expression<Func<T, object>>> Includes { get; } = new();

    protected void AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Includes.Add(includeExpression);
    }
}

// Concrete Specification
public class OrdersWithItemsSpecification : BaseSpecification<Order>
{
    public OrdersWithItemsSpecification(string customerName) 
        : base(o => o.CustomerName == customerName)
    {
        AddInclude(o => o.Items);
    }
}

// Repository with Specification Support
public interface IRepository<T> where T : class
{
    T GetById(int id);
    IEnumerable<T> GetAll();
    IEnumerable<T> Find(ISpecification<T> specification);
    void Add(T entity);
    void Update(T entity);
    void Remove(T entity);
}

// Usage
var specification = new OrdersWithItemsSpecification("John Doe");
var orders = _orderRepository.Find(specification);
\`\`\`

## Benefits

1. **Separation of Concerns**: Business logic separated from data access
2. **Testability**: Easy to mock repositories for unit tests
3. **Flexibility**: Can switch between different data sources
4. **Centralized Logic**: Data access logic in one place
5. **Maintainability**: Changes to data access don't affect business logic
6. **Query Reusability**: Common queries defined once

## Testing with Repository Pattern

\`\`\`csharp
// Unit Test Example
public class OrderServiceTests
{
    [Fact]
    public void ProcessOrder_ValidOrder_UpdatesTotal()
    {
        // Arrange
        var mockRepository = new Mock<IOrderRepository>();
        var order = new Order 
        { 
            Id = 1, 
            Items = new List<OrderItem>
            {
                new OrderItem { Price = 10, Quantity = 2 },
                new OrderItem { Price = 15, Quantity = 1 }
            }
        };
        
        mockRepository.Setup(r => r.GetById(1)).Returns(order);
        
        var service = new OrderService(mockRepository.Object);

        // Act
        service.ProcessOrder(1);

        // Assert
        Assert.Equal(35, order.TotalAmount);
        mockRepository.Verify(r => r.Update(order), Times.Once);
    }
}
\`\`\`

## Common Pitfalls

### 1. Over-Abstraction

\`\`\`csharp
// TOO GENERIC - Loses type safety
public interface IRepository
{
    object GetById(int id);
    IEnumerable<object> GetAll();
}

// BETTER - Strongly typed
public interface IRepository<T> where T : class
{
    T GetById(int id);
    IEnumerable<T> GetAll();
}
\`\`\`

### 2. Leaky Abstraction

\`\`\`csharp
// BAD - Exposes IQueryable
public interface IRepository<T>
{
    IQueryable<T> GetAll(); // Allows LINQ in business layer
}

// GOOD - Returns concrete collection
public interface IRepository<T>
{
    IEnumerable<T> GetAll();
}
\`\`\`

### 3. Repository Explosion

Don't create a repository for every entity. Focus on aggregate roots.

## When to Use the Repository Pattern

✅ **Use when:**
- You need to abstract data access logic
- You want to improve testability
- You might switch data sources in the future
- You have complex data access logic
- You're working with Domain-Driven Design

❌ **Don't use when:**
- You're using an ORM that already provides abstraction (like Entity Framework with DbContext)
- Your application is simple with basic CRUD operations
- You're creating unnecessary layers of abstraction
- Performance is critical and abstraction adds overhead

## Modern Alternatives

### Using EF Core Directly

\`\`\`csharp
// DbContext is already a repository/unit of work
public class OrderService
{
    private readonly ApplicationDbContext _context;

    public OrderService(ApplicationDbContext context)
    {
        _context = context;
    }

    public Order GetOrder(int id)
    {
        return _context.Orders
            .Include(o => o.Items)
            .FirstOrDefault(o => o.Id == id);
    }
}
\`\`\`

### CQRS Pattern

Separate read and write operations instead of using repositories.

## Conclusion

The Repository Pattern provides a clean abstraction between your business logic and data access layer. It improves testability, maintainability, and flexibility by isolating data access code.

However, modern ORMs like Entity Framework Core already provide many repository-like features through DbContext. Before implementing the Repository Pattern, consider whether the added abstraction provides real value for your specific use case, or if it's creating unnecessary complexity.

When used appropriately, the Repository Pattern is a powerful tool for building maintainable, testable applications with clean architecture.

---

*How do you handle data access in your applications? Do you use the Repository Pattern or prefer other approaches? Share your thoughts below!*
  `
};
