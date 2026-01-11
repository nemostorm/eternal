# Back-End

This is a .NET Core Web API application.

## Prerequisites

- .NET 10.0 SDK

## Running the Application

1. Navigate to the back-end directory:
   ```
   cd back-end
   ```

2. Run the application:
   ```
   dotnet run
   ```

3. The API will be available at `https://localhost:5001` (or similar, check the console output).

## API Endpoints

- GET `/weatherforecast` - Returns a 5-day weather forecast.

## Building

To build the application:
```
dotnet build
```

## Testing

The application includes a basic weather forecast endpoint. You can test it using tools like curl or Postman.

Example:
```
curl https://localhost:5001/weatherforecast
```