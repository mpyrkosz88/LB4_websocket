import { Constructor } from "@loopback/context";
import { ApplicationConfig } from '@loopback/core';
import { HttpServer } from '@loopback/http-server';
import { RestApplication } from '@loopback/rest';
import { Namespace } from "socket.io";
import { WebSocketServer } from "./websocket.server";

export { ApplicationConfig };

export class WebsocketApplication extends RestApplication {
  readonly httpServer: HttpServer;
  readonly wsServer: WebSocketServer;

  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.httpServer = new HttpServer(this.requestHandler, options.rest);
    this.wsServer = new WebSocketServer(this, this.httpServer);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public websocketRoute(controllerClass: Constructor<any>, namespace?: string | RegExp): Namespace {
    return this.wsServer.route(controllerClass, namespace) as Namespace;
  }

  public async start(): Promise<void> {
    await this.wsServer.start();
  }

  public async stop(): Promise<void> {
    await this.wsServer.stop();
  }
}
