# Go Getter Delivery App

Go Getter is a delivery app built with NestJS and a microservices architecture. It uses a monorepo structure to manage the codebase and a microfrontend approach to deliver the app.

## Getting Started

To get started with Go Getter, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/your-username/go-getter.git
```

2. Install the dependencies:

```bash
$ npm install
```

3. Start the app:

```bash
npm run start
```

This will start the app and all of the microservices. You can access the app at `http://localhost:3000`.

## Architecture

Go Getter is built with a microservices architecture, with each microservice representing a separate domain within the app. The app is divided into the following microservices:

- Users
- Products
- Dashboard Admin
- Orders
- Payment

Each microservice has its own module, controllers, and services, and communicates with the other microservices through APIs.

The app also uses a monorepo structure to manage the codebase, with each microservice in its own directory within the `/src` directory.

## Microfrontend Delivery

Go Getter uses a microfrontend approach to deliver the app, with each microservice being delivered as a separate bundle. The bundles are combined and served to the client through a single entry point.

## Contributing

We welcome contributions to Go Getter! If you have an idea for a new feature or bug fix, please open an issue or pull request.

## License

Go Getter is licensed under the [MIT License](LICENSE).
