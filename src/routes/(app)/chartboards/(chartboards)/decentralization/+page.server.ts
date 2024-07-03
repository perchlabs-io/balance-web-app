import { getChartData, getMAVData, getEpochData, getKeffData, getGroupListData } from '$lib/api/balance.server'


export const load = async () => {
	

	const levData = await getChartData()
	const mavData = await getMAVData()
	const epochData = await getEpochData()
	const keffData = await getKeffData()
	const groupData = await getGroupListData()


	return { 
		
		levData : levData, mavData : mavData, epochData : epochData, keffData : keffData, groupData: groupData
	
	}
}