import React, { useMemo } from 'react';
import classNames from 'classnames';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { observer, inject } from 'mobx-react';
import LayoutStore from '@store/layoutStore';
import { Header, Navigator } from '@components/Layout';
import Loading from '@components/Loading';
import Footer from '@components/Footer';
import ViewContent from './ViewContent';

// 左侧导航栏模式
const VerticalMode: React.FC<{ route: RouteRoot }> = props => {
  const {
    layoutStore: {
      layoutStatus: { collapsed, isMobile, showSiderBar, showHeader, fixSiderBar, fixHeader },
      toggleCollapsed,
      loadingOptions,
      isInlineLayout,
      isDarkTheme
    }
  } = props as { layoutStore: LayoutStore; route: RouteRoot };

  const RANavigator = useMemo(
    () => <Navigator collapsed={collapsed} isMobile={isMobile} toggleCollapsed={toggleCollapsed} />,
    [collapsed, isMobile, toggleCollapsed]
  );

  // 分割模式，菜单切割header
  const splitModeLayout = (
    <>
      {showSiderBar && RANavigator}
      <div
        id="mainContainer"
        className={classNames(
          'RA-basicLayout-wrapper',
          collapsed && 'RA-basicLayout-wrapper-collapsed'
        )}
      >
        {showHeader && <Header />}
        <div className="RA-basicLayout-wrapper-content">
          <ViewContent {...props} />
          <Footer propStyle={{ marginBottom: '16px' }} />
        </div>
      </div>
    </>
  );

  const IconCollapsed = collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;

  // 一体布局模式，菜单不分割header
  const inlineModeLayout = (
    <>
      {showHeader && <Header />}
      <div
        id="mainContainer"
        className={classNames(
          'RA-basicLayout-wrapper',
          collapsed && 'RA-basicLayout-wrapper-collapsed'
        )}
      >
        {showSiderBar && RANavigator}
        <ViewContent {...props} />
      </div>
      <div
        className={classNames(
          'RA-basicLayout-inlineMode-footer',
          isDarkTheme && 'RA-basicLayout-inlineMode-footer-dark'
        )}
      >
        {showSiderBar && (
          <div
            className={classNames(
              'RA-basicLayout-inlineMode-footer-icon',
              collapsed && 'RA-basicLayout-inlineMode-footer-collapsed'
            )}
            onClick={() => toggleCollapsed()}
          >
            {IconCollapsed}
          </div>
        )}
        <Footer propStyle={{ alignSelf: 'flex-end' }} />
      </div>
    </>
  );

  return (
    <div
      className={classNames(
        'RA-basicLayout',
        isInlineLayout ? 'RA-basicLayout-inlineMode' : 'RA-basicLayout-splitMode',
        !showSiderBar && 'RA-basicLayout-hideMenu',
        !showHeader && 'RA-basicLayout-hideHeader',
        fixHeader && 'RA-basicLayout-fixHeader',
        fixSiderBar && 'RA-basicLayout-fixSiderBar',
        isMobile && 'RA-basicLayout-mobile'
      )}
    >
      <Loading {...loadingOptions} collapsed={collapsed} />
      {isInlineLayout ? inlineModeLayout : splitModeLayout}
    </div>
  );
};

export default inject('layoutStore')(observer(VerticalMode));
