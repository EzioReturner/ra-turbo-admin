import { getUserInfo, postLogin } from '@api/user';
import { action, configure, observable, computed } from 'mobx';

type IdentifyStatus = 'identifying' | 'identifyPass' | 'unauthorized';

configure({ enforceActions: 'observed' });
class UserStore {
  // 用户信息
  @observable userInfo: any = {};
  // 用户权限码
  @observable authority: string[] = [];
  // 当前的验证状态
  @observable identifyStatus: IdentifyStatus = 'identifying';

  constructor() {
    this.initUserInfo();
  }

  // 获取用户权限
  getAuthority = (str?: undefined | string): string[] => {
    const authorityString: string | null =
      typeof str === 'undefined' ? localStorage.getItem('ra-authority') : str;
    let authority: string[];
    authority = authorityString ? JSON.parse(authorityString) : [];
    return authority;
  };

  // 设置用户权限
  @action setAuthority = (authority: string | string[]): void => {
    const raAuthority: string[] = typeof authority === 'string' ? [authority] : authority;
    localStorage.setItem('ra-authority', JSON.stringify(raAuthority));
    this.authority = raAuthority;
  };

  // 用户登录事件
  @action handleUserLogin(name: string, password: number): Promise<boolean> {
    this.identifyStatus = 'identifying';
    return postLogin(name, password)
      .then((res: any) => {
        const { message, userInfo } = res;
        if (message === 'ok') {
          const data = userInfo.data[0];
          this.setUserInfo(data);
          this.setAuthority(name);
          this.identifyStatus = 'identifyPass';
          return true;
        }
        return false;
      })
      .catch(err => {
        this.identifyStatus = 'unauthorized';
        this.setAuthority([]);
        return false;
      });
  }

  // 设置用户信息
  @action setUserInfo(userInfo: object): void {
    this.userInfo = userInfo;
    localStorage.setItem('ra-user', JSON.stringify(userInfo));
  }

  // 用户登出，重置信息
  @action userLogout = (): void => {
    this.userInfo = {};
    this.authority = [];
    localStorage.removeItem('ra-authority');
    localStorage.removeItem('ra-user');
  };

  // 重新拉取用户信息
  @action initUserInfo = async (): Promise<any> => {
    const localUserInfo: string | null = localStorage.getItem('ra-user');
    const userAuthority: string[] = this.getAuthority();
    // 存在权限和用户信息
    if (userAuthority.length && localUserInfo) {
      this.setUserInfo(JSON.parse(localUserInfo));
      this.identifyStatus = 'identifyPass';
      this.setAuthority(userAuthority);
    } else {
      this.identifyStatus = 'unauthorized';
      this.setAuthority([]);
    }
  };
}
export const userStore = new UserStore();
export default UserStore;
