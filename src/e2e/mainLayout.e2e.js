import 'regenerator-runtime/runtime';
import { asyncRouteConfig } from '../config/router.config';

const BASE_URL = `http://localhost:${process.env.PORT || 9527}`;

function formatter(routes) {
  return routes.reduce((total, info) => {
    info.routes ? total.push(...formatter(info.routes)) : total.push(info.path);
    return total;
  }, []);
}

describe('mainLayout', () => {
  beforeAll(async () => {
    jest.setTimeout(1000000);
    await page.goto(`${BASE_URL}/#/user/login`);
    await page.type('#normal_login_username', 'admin');
    await page.type('#normal_login_password', '123');
    await page.click('button[type="submit"]');
    await page.waitFor(2000);
  });

  afterEach(async () => {
    await page.waitFor(1500);
  });

  const testPage = path => async () => {
    console.log(`go to ${BASE_URL}/#${path}`);
    await page.goto(`${BASE_URL}/#${path}`);
    await page.waitForSelector('footer', {
      timeout: 2000
    });
    const haveFooter = await page.evaluate(
      () => document.getElementsByTagName('footer').length > 0
    );
    expect(haveFooter).toBeTruthy();
  };

  const routes = formatter(asyncRouteConfig);

  routes.forEach(route => {
    it(`test pages ${route}`, testPage(route));
  });

  // it('test layout header display', async () => {
  //   await page.goto(`${BASE_URL}/#/`);
  //   const havHeader = await page.evaluate(() => document.getElementsByTagName('header').length > 0);
  //   console.log(havHeader);
  //   expect(havHeader).toBeFalsy();
  // });

  // it('test layout menu display', async () => {
  //   await page.goto(`${BASE_URL}/#/`);
  //   const havMenu = await page.evaluate(() => document.getElementsByTagName('aside').length > 0);
  //   console.log(havMenu);
  //   expect(havMenu).toBeFalsy();
  // });
});
