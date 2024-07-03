import { getStakeFlowData, getGroupStakeDonutData, getMAVData, getEpochData } from '$lib/api/balance.server'


export const load = async () => {
    
    const groupStakeDonutData = await getGroupStakeDonutData()
    const mavData = await getMAVData()
    const epochData = await getEpochData()
    const stakeFlowData = await getStakeFlowData()


    return { 
        
        groupStakeDonutData: groupStakeDonutData,
        mavData: mavData,
        epochData : epochData,
        stakeFlowData : stakeFlowData
    
    }

}