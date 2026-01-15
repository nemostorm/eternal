import { BlogPost } from './types';

export const rabbitMqDotnetPost: BlogPost = {
  slug: "rabbitmq-dotnet-message-queues",
  title: "Using RabbitMQ with .NET: Message Queues, Producers, and Consumers",
  excerpt: "Learn how to integrate RabbitMQ with .NET: core concepts, raw RabbitMQ.Client examples, MassTransit integration, and best practices for reliable messaging.",
  date: "January 15, 2026",
  author: "nemostorm",
  readTime: "8 min read",
  category: "Backend Development",
  content: `
# Using RabbitMQ with .NET: Message Queues, Producers, and Consumers

## Introduction

RabbitMQ is a battle-tested message broker used to decouple services, smooth traffic spikes, and enable asynchronous processing. This article shows the core concepts and practical examples for using RabbitMQ in .NET applications — both with the low-level \`rabbitmq.client\` library and an example using MassTransit.

## Core Concepts

- Exchange: receives messages from producers and routes them to queues.
- Queue: stores messages until consumers process them.
- Binding: link between an exchange and a queue, possibly with a routing key.
- Routing Key: used by exchanges (direct, topic) to route messages.

Use durable exchanges/queues and persistent messages for reliability.

## Quick setup

Install the official client:

\`\`\`bash
dotnet add package RabbitMQ.Client
\`\`\`

Or use MassTransit for higher-level abstractions:

\`\`\`bash
dotnet add package MassTransit
dotnet add package MassTransit.RabbitMQ
\`\`\`

## Basic producer (RabbitMQ.Client)

\`\`\`csharp
using RabbitMQ.Client;
using System.Text;

var factory = new ConnectionFactory() { HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.ExchangeDeclare("my-exchange", ExchangeType.Direct, durable: true);
channel.QueueDeclare("my-queue", durable: true, exclusive: false, autoDelete: false);
channel.QueueBind("my-queue", "my-exchange", "my-key");

var message = "Hello RabbitMQ from .NET";
var body = Encoding.UTF8.GetBytes(message);

var props = channel.CreateBasicProperties();
props.Persistent = true; // mark message persistent

channel.BasicPublish(exchange: "my-exchange", routingKey: "my-key", basicProperties: props, body: body);
Console.WriteLine("[x] Sent {0}", message);
\`\`\`

## Basic consumer (RabbitMQ.Client) - with manual acks

\`\`\`csharp
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

var factory = new ConnectionFactory() { HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.QueueDeclare("my-queue", durable: true, exclusive: false, autoDelete: false);

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    try
    {
        Console.WriteLine("[x] Received {0}", message);
        // process message

        // ack after successful processing
        channel.BasicAck(ea.DeliveryTag, multiple: false);
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine("Processing failed: " + ex.Message);
        // optionally reject and requeue or send to DLX
        channel.BasicNack(ea.DeliveryTag, multiple: false, requeue: false);
    }
};

// limit unacked messages to improve fairness
channel.BasicQos(prefetchSize: 0, prefetchCount: 10, global: false);
channel.BasicConsume(queue: "my-queue", autoAck: false, consumer: consumer);

Console.WriteLine("Consumer started. Press [enter] to exit.");
Console.ReadLine();
\`\`\`

## Using MassTransit for simplicity

MassTransit provides a friendly abstraction over transports and message contracts.

\`\`\`csharp
// Program.cs
builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("rabbitmq://localhost", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });

        cfg.ReceiveEndpoint("orders-queue", e =>
        {
            e.PrefetchCount = 16;
            e.ConfigureConsumer<OrderConsumer>(context);
        });
    });
    x.AddConsumer<OrderConsumer>();
});

// consumer
public class OrderConsumer : IConsumer<OrderMessage>
{
    public async Task Consume(ConsumeContext<OrderMessage> context)
    {
        var msg = context.Message;
        // handle message
        await Task.CompletedTask;
    }
}
\`\`\`

MassTransit handles retries, middleware, and sagas out of the box which reduces boilerplate.

## Best practices

- Use durable exchanges/queues and persistent messages for durability.
- Set proper QoS/prefetch to limit unacknowledged messages.
- Implement idempotent consumers to handle redelivery.
- Use dead-letter exchanges (DLX) for poison messages and retries.
- Keep message sizes small; store large payloads in object storage and send references.
- Monitor connection/channel health and use automatic recovery or reconnection strategies.
- Prefer using a framework like MassTransit or EasyNetQ if you want higher-level patterns (retries, outbox, sagas).

## Troubleshooting and monitoring

- Use rabbitmqctl and management UI for queue states and consumers.
- Watch for high ready/unaligned message counts — indicates slow consumers.
- Track message rates, connection churn, and resource usage (memory, disk).

## Conclusion

RabbitMQ is a powerful tool for building resilient distributed systems. In .NET, you can start with the official client for complete control or use MassTransit for productivity and advanced patterns. Pay attention to durability, acknowledgements, prefetch, and idempotency to build reliable message-driven systems.

[INTERACTIVE_CODE_EDITOR]
`
};

export default rabbitMqDotnetPost;
