package org.tweet;

public class TransferLocation {

	public int fromId;
	public int endId;
	public double orgLat;
	public double orgLon;
	public double destLat;
	public double destLon;
	public String orgType;
	public String destType;
	
	public TransferLocation(int f, int e)
	{
		fromId = f;
		endId = e;
	}
	
	public TransferLocation(double olat, double olon, double dlat, double dlon, String otype, String dtype) {
		orgLat = olat;
		orgLon = olon;
		destLat = dlat;
		destLon = dlon;
		orgType = otype;
		destType = dtype;
	}
	
	public void setFromId(int id)
	{
		fromId = id;
	}
	
	public void setEndId(int id)
	{
		endId = id;
	}
	
	public int GetFromId()
	{
		return fromId;
	}
	
	public int GetEndId()
	{
		return endId;
	}
	
	public String toString()
	{
		return Integer.toString(fromId) + " -> " + Integer.toString(endId);
	}

}
