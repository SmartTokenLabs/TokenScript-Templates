import React from "react";
import "./loader.css";

interface LoaderProps {
	show: boolean;
}

const Loader: React.FC<LoaderProps> = ({ show }) => {
	if (!show) return null;
	return (
		<div className="loader-container">
			<div className="lds-ring">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default Loader;
