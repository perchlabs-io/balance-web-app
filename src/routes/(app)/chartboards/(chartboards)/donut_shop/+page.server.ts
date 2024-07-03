import { getGroupStakeDonutData, getMAVData, getEpochData } from '$lib/api/balance.server'


export const load = async () => {
    
    const groupStakeDonutData = await getGroupStakeDonutData()
    const mavData = await getMAVData()
    const epochData = await getEpochData()


    return { 
        
        groupStakeDonutData: groupStakeDonutData,
        mavData: mavData,
        epochData : epochData
    
    }

}