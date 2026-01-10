import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import INFO from "../data/user";

import "./styles/webpageDocument.css";

const WebpageDocument = () => {
	const documentApp = INFO.documentsApps?.find((item) => item.key === "webpage");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const title = documentApp ? documentApp.title : "Webpage";
	const description = documentApp
		? documentApp.description
		: "Placeholder text for a Webpage document.";

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${title} | ${INFO.main.title}`}</title>
			</Helmet>
			<div className="page-content">
				<div className="content-wrapper page-shell">
					<div className="webpage-document-container">
						<div className="title webpage-document-title">{title}</div>
						<div className="subtitle webpage-document-subtitle">
							{description}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default WebpageDocument;
