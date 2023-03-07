import {ArtifactOptions, BaseArtifactBooter, BootBindings, booter} from "@loopback/boot";
import {config, CoreBindings, inject} from '@loopback/core';
import {WebsocketApplication} from "./websocket.application";

/**
 * A class that extends BaseArtifactBooter to boot the 'WebsocketController' artifact type.
 * Discovered controllers are bound using `app.controller()`.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param websocketControllerConfig - Controller Artifact Options Object
 */
@booter('websocketControllers')
export class WebsocketControllerBooter extends BaseArtifactBooter {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: WebsocketApplication,
    @inject(BootBindings.PROJECT_ROOT) projectRoot: string,
    @config()
    public websocketControllerConfig: ArtifactOptions = {},
  ) {
    super(
      projectRoot,
      // Set Controller Booter Options if passed in via bootConfig
      Object.assign({}, WebsocketControllerDefaults, websocketControllerConfig),
    );
  }

  /**
   * Uses super method to get a list of Artifact classes. Boot each class by
   * binding it to the application using `app.controller(controller);`.
   */
  async load() {
    await super.load();
    this.classes.forEach(cls => {
      this.app.websocketRoute(cls);
    });
  }
}

/**
 * Default ArtifactOptions for WebsocketControllerBooter.
 */
export const WebsocketControllerDefaults: ArtifactOptions = {
  dirs: ['ws-controllers'],
  extensions: ['.controller.ws.js'],
  nested: true,
};

