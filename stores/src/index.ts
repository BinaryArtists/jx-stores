import Store from './viewmodel';
import { Plugin } from './index.prot';

export default class Icestore {
  /** Stores registered */
  private stores: {[namespace: string]: Store} = {};

  /** Global middlewares applied to all stores */
  private plugins: Plugin[] = [];

  /** middleware applied to single store */
  private pluginMap: {[namespace: string]: Plugin[]} = {};

  /**
   * Register and init store
   * @param {string} namespace - unique name of store
   * @param {object} bindings - object of state and actions used to init store
   * @return {object} store instance
   */
  public use(namespace: string, bindings: object): Store {
    if (this.stores[namespace]) {
      throw new Error(`Namespace have been used: ${namespace}.`);
    }

    const storePlugins = this.pluginMap[namespace] || [];
    const plugins = this.plugins.concat(storePlugins);

    // Bindings ==> ViewModel
    this.stores[namespace] = new Store(namespace, bindings, plugins);
    return this.stores[namespace];
  }

  /**
   * Apply middleware to stores
   * @param {array} middlewares - middlewares queue of store
   * @param {string} namespace - unique name of store
   */
  public mix(plugins: Plugin[], namespace: string): void {
    if (namespace !== undefined) {
      this.pluginMap[namespace] = plugins;
    } else {
      this.plugins = plugins;
    }
  }

  /**
   * Find store by namespace
   * @param {string} namespace - unique name of store
   * @return {object} store instance
   */
  private getViewModel(namespace: string): Store {
    const store: Store = this.stores[namespace];
    if (!store) {
      throw new Error(`Not found namespace: ${namespace}.`);
    }
    return store;
  }

  /**
   * Get state of store by namespace
   * @param {string} namespace - unique name of store
   * @return {object} store's state
   */
  public getState(namespace: string): object {
    return this.getViewModel(namespace).getState();
  }

  /**
   * Hook of using store
   * @param {string} namespace - unique name of store
   * @return {object} store's bindings
   */
  public useStore(namespace: string): object {
    return this.getViewModel(namespace).useStore();
  }

  /**
   * Hook of using multiple stores
   * @param {string} namespace - unique name of store
   * @return {array} array of store's bindings
   */
  public useStores(namespaces: string[]): object[] {
    return namespaces.map(namespace => this.useStore(namespace));
  }
}

