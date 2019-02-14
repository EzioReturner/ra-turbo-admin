import React, { Component, Suspense } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import routeConfig from '../config/router.config';
import './routeContent.scss';

class RouteComponent extends Component {
	constructor(props) {
		super(props);
	}

	generateRoute(route) {
		const { path, component: Component, children } = route;
		if (children) {
			return children.map(res => this.generateRoute(res));
		} else {
			return (
				<Route
					exact
					path={path}
					key={path}
					render={props => <Component {...Object.assign(props, this.props)} />}
				/>
			);
		}
	}

	render() {
		return routeConfig.reduce((total, route) => {
			const { redirect, path, component, children } = route;
			const C = redirect ? (
				<Route
					path="/"
					exact
					key={path}
					render={() => <Redirect to={redirect} />}
				/>
			) : (
				this.generateRoute(route)
			);
			return Array.isArray(C) ? [...total, ...C] : [...total, C];
		}, []);
	}
}

class RouteList extends Component {
	render() {
		const { location } = this.props;
		return (
			<div className="routeContent">
				<Switch location={location}>
					<RouteComponent {...this.props} />
				</Switch>
			</div>
		);
	}
}
export default RouteList;