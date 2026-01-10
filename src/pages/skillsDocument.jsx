import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import INFO from "../data/user";

import "./styles/skillsDocument.css";

const SkillsDocument = () => {
	const documentApp = INFO.documentsApps?.find((item) => item.key === "skills");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const title = documentApp ? documentApp.title : "Skills";
	const description = documentApp
		? documentApp.description
		: "Placeholder text for a Skills document.";

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${title} | ${INFO.main.title}`}</title>
			</Helmet>
			<div className="page-content">
				<div className="content-wrapper page-shell">
					<div className="skills-document-container">
						<div className="title skills-document-title">{title}</div>
						<div className="subtitle skills-document-subtitle">
							{description}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default SkillsDocument;
