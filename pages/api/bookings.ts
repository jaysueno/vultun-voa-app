export default async function handler(req: any, res: any) {
    const token = process.env.AIRTABLE_TOKEN
    const baseId = process.env.AIRTABLE_BASE_ID
    const tableName = process.env.AIRTABLE_TABLE_NAME
    const maxRecords = 50 // limit what we pull during dev

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?pageSize=${maxRecords}`
  
    try {
        const airtableRes = await fetch(url, {
            headers: {
              Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
              'Content-Type': 'application/json'
            }
          })
          
  
      const data = await airtableRes.json()
      res.status(200).json(data)

  
      if (!data.records) {
        return res.status(500).json({ error: 'No records found or access denied' })
      }
  
      res.status(200).json(data)
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Unknown error' })
    }
  }
  