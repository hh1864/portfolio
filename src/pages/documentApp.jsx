import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import INFO from "../data/user";

import "./styles/documentApp.css";

const DocumentApp = () => {
	const { slug } = useParams();
	const documentApp =
		INFO.documentsApps?.find((item) => item.key === slug) || null;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const title = documentApp ? documentApp.title : "Document";
	const description = documentApp
		? documentApp.description
		: "This document does not exist yet.";

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${title} | ${INFO.main.title}`}</title>
			</Helmet>
			<div className="page-content">
				<div className="content-wrapper page-shell">
					<div className="document-app-container">
						<div className="title document-app-title">{title}</div>
						<div className="subtitle document-app-subtitle">
							{description}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default DocumentApp;
