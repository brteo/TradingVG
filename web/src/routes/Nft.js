import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Image, Row, Col, Skeleton, Space, Tag, Empty } from 'antd';
import { NotificationOutlined, OrderedListOutlined, TagOutlined } from '@ant-design/icons';
import io from 'socket.io-client';

import Api from '../helpers/api';
import UserPic from '../components/UserPic';
import AuctionBetForm from '../components/AcutionBetForm';
import BetsList from '../components/BetsList';

const { Title } = Typography;
const { REACT_APP_CURRENCY } = process.env;

const Nft = props => {
	const { id: nftID } = props.match.params;
	const { t, i18n } = useTranslation();
	const [nft, setNft] = useState(null);

	const { language } = i18n;

	useEffect(() => {
		let socket;

		Api.get('/nfts/' + nftID)
			.then(res => {
				setNft(res.data);
				if (res.data.auction !== undefined) {
					socket = io(process.env.REACT_APP_ENDPOINT);

					socket.on('auctions/' + res.data.auction._id, data => {
						setNft(prevState => ({
							...prevState,
							auction: {
								...prevState.auction,
								price: data.price,
								lastBets: data.lastBets
							}
						}));
					});
				}
			})
			.catch(err => err.globalHandler && err.globalHandler());

		return () => {
			if (socket) socket.disconnect();
			socket = null;
			setNft(null);
		};
	}, [nftID]);

	return (
		<section className="padded-content nft-page">
			<Row gutter={{ xs: 16, lg: 32 }}>
				<Col xs={24} lg={14} xl={15}>
					<div className="nft-image-box">{!nft ? <Skeleton.Image /> : <Image alt="nft" src={nft.url} />}</div>
				</Col>
				<Col xs={24} lg={10} xl={9}>
					{!nft ? (
						<Skeleton paragraph={{ rows: 4 }} active />
					) : (
						<div className="nft-right-box">
							<div className="nft-info-box">
								<Space direction="vertical">
									<Title level={1}>{nft.title}</Title>
									<div>
										<Tag icon={<TagOutlined />} className="tag-category">
											{nft.category.name[language]}
										</Tag>
										{nft.tags.map(tag => (
											<Tag key={tag}>{tag}</Tag>
										))}
									</div>
									<p className="pre-line">{nft.description}</p>
									<Row>
										<Col xs={12}>
											<div className="nft-label">{t('auction.owner')}</div>
											<Space>
												<UserPic user={nft.owner} link />
												<Link to={'/profile/' + nft.owner._id}>{nft.owner.nickname}</Link>
											</Space>
										</Col>
										<Col xs={12}>
											<div className="nft-label">{t('auction.author')}</div>
											<Space>
												<UserPic user={nft.author} link />
												<Link to={'/profile/' + nft.author._id}>{nft.author.nickname}</Link>
											</Space>
										</Col>
									</Row>
								</Space>
							</div>
							{nft.auction ? (
								<>
									<div className="nft-bet-box">
										<AuctionBetForm auction={nft.auction} />
									</div>
									<div className="nft-auction-box">
										<Space direction="vertical">
											<Space style={{ width: '100%', justifyContent: 'space-between' }}>
												<Title level={2}>
													<NotificationOutlined className="gray-text" /> {t('auction.title')}
												</Title>
												<Tag>
													{t('auction.basePrice')} &raquo; {nft.auction.basePrice} {REACT_APP_CURRENCY}
												</Tag>
											</Space>
											<p className="pre-line">{nft.auction.description}</p>
											<Title level={2}>
												<OrderedListOutlined className="gray-text" /> {t('auction.bets')}
											</Title>
										</Space>
									</div>
									<div className="nft-bets-list-box">
										<BetsList auctionID={nft.auction._id} />
									</div>
								</>
							) : (
								<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('auction.no')} />
							)}
						</div>
					)}
				</Col>
			</Row>
		</section>
	);
};

export default Nft;
