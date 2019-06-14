class LoaderRegistry {
  constructor() {
    this.loaders = [];
  }

  registerLoader(loader, rule) {
    this.loaders.push({ loader, rule });
  }

  findLoader(file) {
    for (let i = this.loaders.length; i-- > 0; ) {
      const { loader, rule } = this.loaders[i];
      if (rule(file)) {
        return loader;
      }
    }

    console.warn(
      `Loader not found for file '${file.name}`
    );
  }
}

export default LoaderRegistry;
export {
  LoaderRegistry
}