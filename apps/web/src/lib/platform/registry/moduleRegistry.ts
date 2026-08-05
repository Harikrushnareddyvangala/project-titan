export interface PlatformModule {

  id: string;

  name: string;

  category: string;

  version: string;

}

export class ModuleRegistry {

  private readonly modules:

    PlatformModule[] = [];

  register(

    module: PlatformModule,

  ) {

    this.modules.push(

      module,

    );

  }

  getModules() {

    return [...this.modules];

  }

}