import React, { useState } from "react";

export const ShareToEarn: React.FC = () => {

	const [url, setUrl] = useState();

	const generateUrl = () => {
		setUrl('https://twitter.com/intent/tweet?text=Your%20Message%20Here');
	};

	return (
		<div style={{ margin: '0 auto', padding: "0px 40px" }}>
			
			<p>Generate a referral link to earn a portion from the share-to-earn pool.</p>
			<div style={{ fontSize: '14px', color: '#444', margin: '12px 0', padding: '14px' }}>
				<p style={{ textAlign: 'center' }}>Pool Share per transation via referral link:</p>
				<p style={{ fontStyle: 'italic', textAlign: 'center' }}>50% goes to you, 50% goes to the share-to-earn pool</p>
			</div>

			<div style={{ marginTop: '20px', marginBottom: '7px' }}>
				<button style={{ width: '380px', marginBottom: '12px', backgroundColor: '#237fff' }} onClick={() => generateUrl()}>Generate Referral URL</button>
				{url && 
					<button style={{ position: 'relative', width: '380px', height: '40px', marginBottom: '12px', backgroundColor: '#000' }}>
						<a style={{ position: 'absolute', left: 0, color: 'white', width: '380px', top: '9px', height: '40px', }} href={url} target="_blank">Share via X</a>
					</button>
				}
			</div>

			{url && 
				<div style={{ fontSize: '14px', margin: '4px 0', color: '#444', padding: '14px', textAlign: 'center' }}>
				 	{url}
				</div>
			}
			
		</div>
	);

};
