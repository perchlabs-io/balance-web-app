import { getStakeFlowData, getDelegationPrctData } from '$lib/api/balance'


export const load = async () => {
    
    const delegationPrctData = await getDelegationPrctData()
    const stakeFlowData = await getStakeFlowData()
	// const keffData = await getKeffData()
    // const mavData = await getMAVData()
    // const epochData = await getEpochData()


    return { 
        
        delegationPrctData : delegationPrctData,
        stakeFlowData : stakeFlowData,
        // keffData : keffData,
        // mavData: mavData,
        // epochData : epochData

    
    }

}