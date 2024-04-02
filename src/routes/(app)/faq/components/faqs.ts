
export default	{
		
    "general": [
                {
                    "question": "What does it cost?",
                    "answer": "Balance is available Free to the Cardano Community and we intend to keep it that way. If you enjoy Balance and would like to help support the initiative, please delegate to our stake pool - Balance Stake Pool - Ticker: [BALNC]",
                    "link1url": "",
                    "link1text": ""
                },
                {
                    "question": "Why is the app named BALANCE?",
                    "answer": "The name “BALANCE“ originated from the core principal in which every transaction in double entry accounting must “balance“ ( debit / credit ). This might seem like a simple concept, but in reality is quite complex and often times does not balance. The idea of creating a system which does not allow unbalanced transactions, is what initially drew my attention towards blockchain as this would change how the world processes / audits business transaction records. Luca Pacioli is identified as the creator of the double entry accounting standards that we know and use today. His collaboration with da Vinci on polyhedron paintings is what inspired the current logo and other similar images on the web app.",
                    "link1url": "",
                    "link1text": ""
                },
                {
                    "question": "What is the Mission?",
                    "answer": "The core mission of BALANCE is to provide deep insights into the decentralization of the Cardano blockchain ecosystem. We aim to acheive this mission by creating impactful data visualizations developed through strong collabotration with community members dedicated to imporving decentralization within the Cardano blockchian ecosystem.",
                    "link1url": "",
                    "link1text": ""
                }
            ],

    "dataBrowsing": [
                {
                    "question": "Where does the data come from?",
                    "answer": "Balance utilizes the Cardano DB Sync utility to serve real-time blockchain data to the platform. We operate enterprise grade infrastructure and security, ensuring stability and scalability.",
                    "link1url": "",
                    "link1text": ""
                },
                {
                    "question": "Which browsers are supported?",
                    "answer": "At this time, we are supporting Balance on Google Chrome only for both desktop and mobile devices. We apologize for any inconvenience this may cause and will work to include additional broswer support per user demand.",
                    "link1url": "",
                    "link1text": ""
                }
            ],
    
    "groupStakeVLev": [
                {
                    "question": "What is the group stake vs leverage chart?",
                    "answer": "Group Stake vs Leverage provides detailed historical analysis of stake pool groups and individual stake pools as they have formed over time (epoch 210 through current). The chart also highlights MAV count per epoch along with the pool groups which make up the MAV. Drag the epoch slider to epoch 210, then click “Play“ to watch the ecosystem evolve. Special thanks to Dr. Michael Liesenfelt and Christophe Garant for their work on CIP-50. Please be sure to visit the link below to read more on CIP-50",
                    "link1url": "https://github.com/michael-liesenfelt/CIPs/blob/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/README.md",
                    "link1text": "CIP-50 - Stake vs Leverage"
                },
                {
                    "question": "What is a pool group?",
                    "answer": "Pool group is a collection of stake pools operated by the same entity. BALANCE utilizes pool group data previously produced by Daniel Ribar, Head of IOG Community and Product for Project Catalyst and Governance. Since deprecated by ceexplorer.io, BALANCE has picked maintaining the pool group dataset and offers public use via JSON API.",
                    "link1url": "https://www.balanceanalytics.io/api/groupdata.json",
                    "link1text": "BALANCE - Pool Group API"
                },
                {
                    "question": "What is leverage?",
                    "answer": "The ratio between pool stake and pledge defined by the parameter L. A leverage-based stake pool saturation is based on pledge rather than a fixed size driven by k-parameter. An entity having high leverage means its total stake is much higher than its pledge.",
                    "link1url": "https://github.com/michael-liesenfelt/CIPs/blob/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/README.md",
                    "link1text": "CIP-50 - Leverage"
                },
                {
                    "question": "What is group stake?",
                    "answer": "Group stake is the total ADA delegated and pledged to all pools that are part of the same group per epoch.",
                    "link1url": "",
                    "link1text": ""
                },
                {
                    "question": "What is MAV?",
                    "answer": "The minimum number of entities in a given subsystem required to get to 51% of the total capacity, or more simply, how many stake pool groups it would take to gain 51% control of the blockchain. This is a simple yet decisive decentralization measurement. It is not limited to pools, but any attack vector. However, for the scope of this paper it is assumed to be pools only. The Nakamoto Coefficient is approximately half of k-effective rounded up to the nearest integer.",
                    "link1url": "https://github.com/michael-liesenfelt/CIPs/blob/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/README.md",
                    "link1text": "CIP-50 - Nakamoto Coefficient, Minimum Attack Vector (MAV)"
                }
            ],

    "avgResultDec": [
                {
                    "question": "What is the Average Resulting Decentralization Chart?",
                    "answer": "The Average Resulting Decentralization chart provides summary analysis of network decentralization history from epoch 210 through current. Special thanks to Dr. Michael Liesenfelt and Christophe Garant for their work on CIP-50. Please be sure to visit the link below to read more on CIP-50.",
                    "link1url": "https://github.com/michael-liesenfelt/CIPs/blob/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/README.md",
                    "link1text": "CIP-50 - Average Resulting Decentralization"
                },
                {
                    "question": "What is k-effective?",
                    "answer": "The “average resulting decentralization” or “effective decentralization“ taking into account groups or entities of stake pools. One group could be running multiple stake pools, which lowers the realistic, effective decentralization.",
                    "link1url": "https://github.com/michael-liesenfelt/CIPs/blob/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/README.md",
                    "link1text": "CIP-50 - k-effective"
                },
                {
                    "question": "What is k-effective / 2.0 ?",
                    "answer": "K-effective / 2.0 represents k-effective halved rounded up to the nearest integer. K-effective provides a higher resolution quantification of network decentralization compared to the Nakamoto Coefficient.",
                    "link1url": "https://github.com/michael-liesenfelt/CIPs/blob/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/README.md",
                    "link1text": "CIP-50 - k-effective / 2.0"
                },
                {
                    "question": "What is MAV?",
                    "answer": "The minimum number of entities in a given subsystem required to get to 51% of the total capacity, or more simply, how many stake pool groups it would take to gain 51% control of the blockchain. This is a simple yet decisive decentralization measurement. It is not limited to pools, but any attack vector. However, for the scope of this paper it is assumed to be pools only. The Nakamoto Coefficient is approximately half of k-effective rounded up to the nearest integer.",
                    "link1url": "https://github.com/michael-liesenfelt/CIPs/blob/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/CIP-Liesenfelt-Shelleys_Voltaire_decentralization_update/README.md",
                    "link1text": "CIP-50 - Nakamoto Coefficient, Minimum Attack Vector (MAV)"
                }
            ]
};