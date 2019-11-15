package org.tweet;

public class TweetRecord {

	final long id; // required, and immutable
	final long user_id;
	final double latitude; // required, and immutable
    final double longitude; // required, and immutable
	double x;
	double y;
	int day;
	int month;
	int year;
	int second;
	int minute;
	int hour;
	int dow;
	String create_at;
	long time;
	public int place_id;
	double distance;
	int cluster_label;
	
	TweetRecord(TweetRecordBuilder builder) {
		this.id = builder.id;
		this.user_id = builder.user_id;
		this.latitude = builder.latitude;
		this.longitude = builder.longitude;
		this.x = builder.x;
		this.y = builder.y;
		this.day = builder.day;
		this.month = builder.month;
		this.year = builder.year;
		this.second = builder.second;
		this.minute = builder.minute;
		this.hour = builder.hour;
		this.create_at = builder.create_at;
		this.time = builder.time;
		this.place_id = builder.place_id;
		this.distance = builder.distance;
		this.dow = builder.dow;
	}
	
	public TweetRecord copy() {
		return new TweetRecordBuilder(id, user_id, latitude, longitude)
				.x(x).y(y).day(day).month(month).year(year).dow(dow)
				.second(second).minute(minute).hour(hour).create_at(create_at).time(time)
				.placeId(place_id).distance(distance).build();
	}
	
	public long getTweetID() {
		return id;
	}
	
	public int getDow() {
		return dow;
	}
	
	public long getUserID() {
		return user_id;
	}
	
	public double getLatitude() {
		return latitude;
	}
	
	public double getLongitude() {
		return longitude;
	}
	
	public double getX() {
		return x;
	}
	
	public double getY() {
		return y;
	}
	
	public int getDay() {
		return day;
	}
	
	public int getMonth() {
		return month;
	}
	
	public int getYear() {
		return year;
	}
	
	public double getSecondTime() {
		return hour * 3600 + minute*60 + second;
	}
	
	public double getMinuteTime() {
		return hour * 60 + minute + second / 60.0;
	}
	
	public double getHourTime() {
		return hour + minute / 60.0  ;
	}
	
	public long getFullTime() {
		return time ;
	}
	public double getTime()
	{
		return hour + minute / 60.0  ;
	}
	
	public String getCreateTime() {
		return create_at;
	}
	
	public int getPlaceID() {
		return place_id;
	}
	
	public void setPlaceID(int place_id) {
		this.place_id = place_id;
	}
	
	public double getDistance() {
		return distance;
	}
	
	public int getClusterLabel() {
		return cluster_label;
	}
	
	public void setClusterLabel(int cluster_label) {
		this.cluster_label = cluster_label;
	}
	
	@Override
	public boolean equals(Object v) {
	    boolean retVal = false;
	    if (v instanceof TweetRecord){
	    	TweetRecord ptr = (TweetRecord) v;
	        retVal = Long.compare(ptr.getTweetID(), this.getTweetID()) == 0;
	    }
	    return retVal;
	}
	
	public String toString() {
		return Double.toString(x) + " " + Double.toString(y) + " " + 
			   Double.toString(year) + " " + Double.toString(month) + " " + 
			   Double.toString(day) + " " + Double.toString(this.getHourTime()) + " " + 
			   Integer.toString(place_id) + " + " + Double.toString(distance); 
	}
	
	public static class TweetRecordBuilder {
		final long id;
		final long user_id;
		final double latitude;
		final double longitude;
		double x = 0;
		double y = 0;
		int day = 0;
		int month = 0;
		int year = 0;
		int second = 0;
		int minute = 0;
		int hour = 0;
		String create_at = null;
		long time = 0;
		int place_id = -1;
		double distance = 0; 
		int cluster_label = -1;		
		int dow = -1;
		
		public TweetRecordBuilder(long id, long user_id, double lat, double lon) {
			this.id = id;
			this.user_id = user_id;
			this.latitude = lat;
			this.longitude = lon;
			
			
		}
		
		// all the following methods are used to set values for optional fields
		public TweetRecordBuilder x(double x) {
			this.x = x;
			return this;
		}
		
		public TweetRecordBuilder y(double y) {
			this.y = y;
			return this;
		}
		
		public TweetRecordBuilder day(int day) {
			this.day = day;
			return this;
		}
		
		public TweetRecordBuilder month(int month) {
			this.month = month;
			return this;
		}
		
		public TweetRecordBuilder year(int year) {
			this.year = year;
			return this;
		}
		
		public TweetRecordBuilder second(int second) {
			this.second = second;
			return this;
		}
		
		public TweetRecordBuilder minute(int minute) {
			this.minute = minute;
			return this;
		}
		
		public TweetRecordBuilder hour(int hour) {
			this.hour = hour;
			return this;
		}
		
		public TweetRecordBuilder dow(int dow) {
			this.dow = dow;
			return this;
		}
		public TweetRecordBuilder create_at(String create_at) {
			this.create_at = create_at;
			return this;
		}
		
		public TweetRecordBuilder time(long time) {
			this.time = time;
			return this;
		}
		
		public TweetRecordBuilder placeId(int place_id) {
			this.place_id = place_id;
			return this;
		}
		
		public TweetRecordBuilder distance(double distance) {
			this.distance = distance;
			return this;
		}
		
		public TweetRecordBuilder cluster_label(int cluster_label) {
			this.cluster_label = cluster_label;
			return this;
		}
		
		public TweetRecord build() {
			return new TweetRecord(this);
		}
	}
}
