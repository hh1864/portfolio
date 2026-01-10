import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import INFO from "../data/user";

import "./styles/workDocument.css";

const WorkDocument = () => {
	const documentApp = INFO.documentsApps?.find((item) => item.key === "work");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const title = documentApp ? documentApp.title : "Work";
	const description = documentApp
		? documentApp.description
		: "Placeholder text for a Work document.";

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${title} | ${INFO.main.title}`}</title>
			</Helmet>
			<div className="page-content">
				<div className="content-wrapper page-shell">
					<div className="work-document-container">
						<div className="title work-document-title">{title}</div>
						<div className="subtitle work-document-subtitle">
							{description}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default WorkDocument;
