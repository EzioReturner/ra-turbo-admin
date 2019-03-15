import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import routeConfig from '../../config/router.config';
import { intersection } from 'lodash';
import { RLogo } from '@components/SvgIcon';
import classNames from 'classnames';

const { SubMenu } = Menu;
const _routes = routeConfig[1].routes;
@withRouter
@inject('layoutStore', 'userStore')
@observer
class SiderMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openKeys: props.layoutStore.openMenus
		};
	}

	componentDidMount() {
		this.initOpenMenu();
	}

	initOpenMenu() {
		const {
			location: { pathname }
		} = this.props;
		const menuOpen = pathname.split('/').reduce((total, obj) => {
			obj &&
				_routes.some(route => route.path === '/' + obj) &&
				total.push('/' + obj);
			return total;
		}, []);
		this.setState({
			openKeys: [...menuOpen]
		});
	}

	getMenuTitle(iconType, name) {
		return (
			<span>
				{iconType && <Icon type={iconType} />}
				<span>{name}</span>
			</span>
		);
	}

	getNavMenuItem(menuData) {
		if (!menuData.length) {
			return [];
		}
		const { authority: currentAuthority } = this.props.userStore;
		return menuData
			.filter(menu => {
				const { authority, hideMenu } = menu;
				if (!hideMenu) {
					if (!authority) return true;
					const allowed = intersection(currentAuthority, authority);
					return allowed.length > 0;
				}
				return false;
			})
			.map(res => this.getSubMenuOrItem(res));
	}

	getSubMenuOrItem(menu) {
		if (
			menu.routes &&
			!menu.hideMenu &&
			menu.routes.some(child => child.name)
		) {
			const { icon, name, path, routes } = menu;
			return (
				<SubMenu title={this.getMenuTitle(icon, name)} key={path}>
					{this.getNavMenuItem(routes)}
				</SubMenu>
			);
		}
		return <Menu.Item key={menu.path}>{this.getMenuItem(menu)}</Menu.Item>;
	}

	getMenuItem(menu) {
		const { icon: iconType, name, path } = menu;
		return (
			<Link to={path} replace onClick={this.props.layoutStore.toggleCollapsed}>
				{iconType && <Icon type={iconType} />}
				<span>{name}</span>
			</Link>
		);
	}

	handleOpenMenu = openKeys => {
		const moreThanOne =
			openKeys.filter(key => _routes.some(route => route.path === key)).length >
			1;
		if (this.props.layoutStore.collapsed && !openKeys.length) {
			return;
		}
		this.setState({
			openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys]
		});
	};
	handleLinkGithub() {
		window.open('https://github.com/EzioReturner/RATurbo-react-admin');
	}

	render() {
		const {
			location: { pathname }
		} = this.props;
		const { collapsed } = this.props.layoutStore;
		const menuProps = collapsed ? {} : { openKeys: this.state.openKeys };
		return (
			<div
				className={classNames('navigator', {
					collapsed
				})}
				mode="inline"
			>
				<div className="controlBut" onClick={this.handleLinkGithub}>
					<div className="rotateIcon">
						<Icon component={RLogo} className="logoBorder" />
					</div>
					<span className="title ml-3">RA-TURBO</span>
				</div>
				<Menu
					className="myMenu"
					mode="inline"
					inlineCollapsed={collapsed}
					selectedKeys={[pathname]}
					onOpenChange={this.handleOpenMenu}
					{...menuProps}
				>
					{this.getNavMenuItem(_routes)}
				</Menu>
			</div>
		);
	}
}

export default SiderMenu;