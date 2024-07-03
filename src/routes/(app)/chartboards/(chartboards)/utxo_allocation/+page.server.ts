import { getUTxOAllocationData, getUTxOAllocationDeltaData, getUTxOAllocationTotalData, getEpochData } from '$lib/api/balance'


export const load = async () => {
    
    const utxoStackData = await getUTxOAllocationData()
    const utxoDeltaData = await getUTxOAllocationDeltaData()
    const utxoTotalData = await getUTxOAllocationTotalData()
    const epochData = await getEpochData()

    return { 
        
        utxoStackData: utxoStackData,
        utxoDeltaData: utxoDeltaData,
        utxoTotalData: utxoTotalData,
        epochData : epochData
    
    }

}