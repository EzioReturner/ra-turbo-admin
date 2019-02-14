import React, { Component } from 'react';
import { Row, Col, Card, Icon } from 'antd';
import { boxSvg, empolyeesSvg, ordersSvg, salesSvg } from './svgIcon';

class InfoCard extends Component {
	render() {
		const { icon, tips, title, num } = this.props;
		return (
			<Card className="infoCard" bordered={false}>
				<div className="top">
					<Icon component={icon} />
					<div className="rightPart">
						<p className="title">{title}</p>
						<h3 className="num">{num}</h3>
					</div>
				</div>
				<p className="tips">{tips}</p>
			</Card>
		);
	}
}

class RowInfoCard extends Component {
	render() {
		const details = [
			{
				icon: boxSvg,
				tips: '65% lower growth',
				title: 'Total Revenue',
				num: '$65,650'
			},
			{
				icon: empolyeesSvg,
				tips: 'Product-wise sales',
				title: 'Orders',
				num: '3455'
			},
			{
				icon: ordersSvg,
				tips: 'Weekly Sales',
				title: 'Sales',
				num: '5693'
			},
			{
				icon: salesSvg,
				tips: 'Product-wise sales',
				title: 'Employees',
				num: '246'
			}
		];
		return (
			<Row gutter={24} className="rowInfoCard">
				{details.map((dl, index) => (
					<Col span={6} key={index}>
						<InfoCard {...dl} />
					</Col>
				))}
			</Row>
		);
	}
}

export default RowInfoCard;