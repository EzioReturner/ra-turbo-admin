import { observable, configure, action, computed, autorun } from 'mobx';

configure({ enforceActions: 'always' });
class MainState {
  @observable spinning: boolean = true;
  @observable fixed: boolean = false;
  @observable mountLoading: boolean = true;
  @observable readyInitializers: Array<string> = [];
  timeout: any = null;
  constructor() {
    // autorun(() => this.checkIsInitial(this.componentPath));
  }

  @action stopSpinning(): void {
    this.spinning = false;
    this.timeout && clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.unMountLoading();
    }, 600);
  }

  @action unMountLoading(): void {
    this.mountLoading = false;
  }

  @action addInitializer(initializer: string): void {
    this.readyInitializers.push(initializer);
    this.mountLoading = true;
    this.spinning = true;
  }

  @action checkIsInitial(path: string): void {
    !this.readyInitializers.includes(path) && this.addInitializer(path);
  }
}

const mainState = new MainState();

export default mainState;