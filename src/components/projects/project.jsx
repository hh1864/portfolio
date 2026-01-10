import React from "react";

import "./styles/project.css";

const Project = (props) => {
	const { logo, title, description, linkText, link } = props;
	const linkLabel = linkText || "Repository";
	const linkPath = link ? link.replace(/^https?:\/\//, "") : "";

	return (
		<React.Fragment>
			<div className="project">
				<div className="project-container">
					<div className="project-image">
						<img src={logo} alt={`${title} preview`} />
					</div>
					<div className="project-body">
						<div className="project-title">{title}</div>
						<div className="project-description">{description}</div>
					</div>
					<a
						className="project-folder"
						href={link}
						target="_blank"
						rel="noreferrer"
					>
						<div className="project-folder-icon" />
						<div className="project-folder-text">
							<div className="project-folder-name">{linkLabel}</div>
							<div className="project-folder-path">{linkPath}</div>
						</div>
					</a>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Project;
