import React from 'react';
import { Card, Row, Col, Typography, Avatar, Tooltip, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FieldTimeOutlined } from '@ant-design/icons';

import Countdown from './CountdownTimer';
import UserPic from './UserPic';

const { Title } = Typography;
const { REACT_APP_CURRENCY } = process.env;

const NftCard = props => {
	const { t } = useTranslation();

	const { nft } = props;

	let auction = '';
	if (nft && nft.auction) {
		auction = (
			<Row align="middle">
				<Col xs={12}>
					<p>{t('auction.price')}</p>
					<div className="price-label">
						{nft.auction.price} <span className="currency">{REACT_APP_CURRENCY}</span>
					</div>
				</Col>
				<Col xs={12}>
					<p>
						<FieldTimeOutlined /> {t('auction.deadline')}
					</p>
					<div>
						<Countdown eventTime={nft.auction.deadline} />
					</div>
				</Col>
			</Row>
		);
	} else {
		auction = <div className="not-for-sale">{t('auction.no')}</div>;
	}

	return (
		<Col xs={24} sm={12} md={12} lg={8} xl={6} className="nftCard">
			{nft ? (
				<Card
					title={
						<Avatar.Group size={35}>
							<Tooltip title={t('nft.author') + ': ' + nft.author.nickname} placement="top">
								<UserPic user={nft.author} link />
							</Tooltip>
							<Tooltip title={t('nft.owner') + ': ' + nft.owner.nickname} placement="top">
								<UserPic user={nft.owner} link />
							</Tooltip>
						</Avatar.Group>
					}
					cover={
						<Link to={'/nft/' + nft._id}>
							<img alt={nft.title} src={nft.url} />
						</Link>
					}
				>
					<Title level={5} ellipsis>
						<Link to={'/nft/' + nft._id}>{nft.title}</Link>
					</Title>
					{auction}
				</Card>
			) : (
				<Card title={<Skeleton.Avatar active size={35} />} cover={<Skeleton.Image active />}>
					<Skeleton title active paragraph={{ rows: 1 }} />
				</Card>
			)}
		</Col>
	);
};

export default NftCard;
