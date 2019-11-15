package org.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.servlet.DBUtility;
import org.tweet.AcCoordinate;
import org.tweet.TweetRecord;

/**
 * Servlet implementation class DBServlet
 */
@WebServlet("/DBServlet")
public class DBServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DBServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		PrintWriter output = response.getWriter();

		try{	

			DBUtility dr = null ;		
			String jsonString = null;
			JSONObject result = new JSONObject();
			String sql = null;
			String dbName = "madison";
			String tableName = "mt_ultraselected"; 
			dr = new DBUtility(dbName, "postgres", "postgres");
			String user_field = "subid";

			int action = Integer.parseInt(request.getParameter("action"));	
			
			/** update user list*/
			if (action == 1) {
				sql = "SELECT distinct subid  as user_no FROM " +  tableName 
						
						+ " order by user_no";
				
				result  = dr.queryDBAsGeoJsonArray(sql);

				jsonString = result.toString();
				
			}else if(action == 3) {

				String trajectory_id = request.getParameter("user_no");		 					

				String clusterMethod = request.getParameter("clusterMethod");
				
				String nexttime = request.getParameter("nexttime");

				String[] name = clusterMethod.split("_");
				clusterMethod = name[0];

				String eps = null, minpts = null;
				if (name.length>1) {
					eps = name[1];
					minpts = name[2];
				}
				
				//String table_name = " activityzone_uncertainty";
				
				String table_name = " activityzone";
				
			    //String geom = "concave_geom";
			
				//String geom = "geom";
			    String geom = "convex_geom";
				//sql = "select cid, ST_AsGeoJson( " +  geom + " ) as geom,  cluster_size ";
				
				sql = "select cid, ST_AsGeoJson(convex_geom) as geom,"
						+ " ST_AsGeoJson(concave_geom) as concave_geom, "
						+ " cluster_size ";
				sql += ", st_x(mean_geom) as mean_lon,  st_y(mean_geom) as mean_lat  ";
				sql += ", st_x(median_geom) as median_lon,  st_y(median_geom) as median_lat  ";
				
				sql += " from " + table_name + " where " ;
				
				if (clusterMethod.equalsIgnoreCase("DBSCANCluster")){
					sql += geom + " is not null "
						+ " and eps =  " + eps
						+ " and minpts =  " + minpts
						
						+ " and clustername =  '" + clusterMethod +"'"
						;

				}else {
					
					sql += geom + " is not null "
						+ " and clustername =  '" + clusterMethod +"'"
						;
				}
				sql += " and " + user_field + " = " + trajectory_id + " and nexttime = " + nexttime; 
			
				System.out.println("select activityzone: " +  sql);
				//result  = dr.queryDBAsGeoJsonArray(sql);  	
				JSONArray resultArray = dr.queryDBAsJsonArray(sql);  
				jsonString = resultArray.toString();
				
				/** select clustering methods*/
			} else if (action == 2 || action == 4) {
				String trajectory_id = request.getParameter("user_no");		 					

				String clusterMethod = request.getParameter("clusterMethod");
				
				String nexttime = request.getParameter("nexttime");

				sql = "SELECT ST_AsGeoJson(geom) as geom, time as create_at";

				String[] name = clusterMethod.split("_");
				clusterMethod = name[0];
				String eps = null, minpt = null;
				if (name.length>1) {
					eps = name[1];
					minpt = name[2];
				}

				if (clusterMethod.equalsIgnoreCase("DBSCAN")){

					/*					sql += ", dbscaneid_" + eps + "_" + minpt + " as clusterid"
							+ ", dbscanc_" + eps + "_" + minpt 
						   + " as center, eps_" + eps + "_" + minpt + " as eps "
						  	+ " FROM " +  tableName  
						   + " where (dbscaneid_" + eps + "_" + minpt + " is not null or dbscanc_" + eps + "_" 
						   + minpt + " is not null) and user_no = " + trajectory_id;	

					 */

					sql += ", dbscanid_" + eps + "_" + minpt + " as clusterid, dbscanc_" + eps + "_" + minpt + " as center, nextdist, accuracy, nexttime, type, appsource, placetype, zonetype"

						+ " FROM " +  tableName  

						+ " where nexttime > " + nexttime
						
						+ " and " + user_field + " = " + trajectory_id
						
						+ " and (dbscanid_" + eps + "_" + minpt + " is not null)";	

				} else if (clusterMethod.equalsIgnoreCase("STDBSCAN")){

				} else if (clusterMethod.equalsIgnoreCase("STDBSCANNew")){

				} else if (clusterMethod.equalsIgnoreCase("VDBSCAN")){

					sql += ", vdbscanid as clusterid, vdbscanc as center, veps as eps FROM " +  tableName  + " where (vdbscanid is not null or vdbscanc is not null) and user_no = " + trajectory_id;

				} else if (clusterMethod.equalsIgnoreCase("MDBSCAN")){
					
					sql += ", mdbscanid as clusterid, mdbscanc as center, meps as eps, nextdist, accuracy, nexttime, type, appsource, placetype, zonetype FROM " +  tableName 
						
						+ " where nexttime > " +  nexttime
						
						+ " and " + user_field + " = " + trajectory_id
						
						+ " and (mdbscanid is not null)";
					
				} else if (clusterMethod.equalsIgnoreCase("RawData")){

					sql += ", nextdist, accuracy, nexttime, type, appsource, placetype FROM " +  tableName 
						+ " where  nexttime >   " +  nexttime
						+ " and subid = " + trajectory_id;
			
				}

				System.out.println("sql: " + sql);
				result  = dr.queryDBAsGeoJsonArray(sql);  	

				jsonString = result.toString();
				
			} else if (action == 5) {
				sql = "SELECT user_no, content as content, ST_X(geom) as lon, ST_Y(geom) as lat, zone_activitycls_convex as zonetype FROM " +  tableName; 
						
//					+ " order by user_no";
				
				JSONObject pointsObj = dr.queryDBAsGeoJsonArray(sql);
				result.put("points", pointsObj);
				
				
				JSONArray resultArray = new JSONArray();
				sql = "select distinct user_no from "
						+ tableName;
				ResultSet Rset = dr.queryDB(sql);
				List<Integer> users = new ArrayList<>();
				List<AcCoordinate> geomedians = new ArrayList<>();
				while (Rset.next()){
					users.add(Rset.getInt("user_no"));
				}
				for (int i = 0; i < users.size(); i++) {
					int user_no = users.get(i);
					
					sql = "select tweet_id, user_id, user_no, ST_X(geom) as lon, ST_Y(geom) as lat, zone_activitycls_convex as zonetype, smtcid, smtcc from "
						+ tableName
						+ " where smtcid != 0 and smtcc = 1 and user_no = " + user_no
						+ " order by smtcid";
					Rset  = dr.queryDB(sql);
					geomedians = new ArrayList<>();					
					while (Rset.next()) {
//						TweetRecord record = new TweetRecord.TweetRecordBuilder(Rset.getLong("tweet_id"), Rset.getLong("user_id"), Rset.getDouble("lat"), Rset.getDouble("lon"))
//								.build();
						Long tweet_id = Rset.getLong("tweet_id");
						Long user_id = Rset.getLong("user_id");
						double lat = Rset.getDouble("lat");
						double lon = Rset.getDouble("lon");
						AcCoordinate ac = (AcCoordinate) new AcCoordinate.AcCoordinateBuilder(tweet_id, user_id, lat, lon)
								.zonetype(Rset.getString("zonetype"))
								.build();
						geomedians.add(ac);					
					}
					
					sql = "select user_no, smtcid as clusterid from "
						+ tableName
						+ " where smtcid != 0 and user_no = " + user_no
						+ " order by EXTRACT(year FROM create_at), EXTRACT(month FROM create_at), EXTRACT(day FROM create_at)"; 
					Rset  = dr.queryDB(sql);
					while (Rset.next()) {
						JSONObject obj = new JSONObject(); 
						int clusterid = Rset.getInt("clusterid");
						obj.put("originlat", geomedians.get(clusterid - 1).getLatitude());
						obj.put("originlon", geomedians.get(clusterid - 1).getLongitude());
						obj.put("destlat", geomedians.get(clusterid - 1).getLatitude());
						obj.put("destlon", geomedians.get(clusterid - 1).getLongitude());
						obj.put("zonetype", geomedians.get(clusterid - 1).getZoneType());
						obj.put("userno", user_no);
						resultArray.put(obj);
					}
				}
				result.put("transits", resultArray);

				jsonString = result.toString();			
			} 

			//System.out.println(jsonString);
			response.setContentType("text/json"); 	
			output.write(jsonString);
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {	
			output.close();	
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter output = response.getWriter();

		try{	

			DBUtility dr = null ;		
			String jsonString = null;
			JSONObject result = new JSONObject();
			String sql = null;
			String dbName = "madison_gps";
			String tableName = "records_test"; 
			dr = new DBUtility(dbName, "postgres", "postgres");

			String trajectory_id = request.getParameter("user_no");
			int action = Integer.parseInt(request.getParameter("action"));
			if (action == 1) {
				String cluster_id = request.getParameter("clusterId");
				String points = request.getParameter("points");	
				String[] point_list = points.split(",");			

				for (int i=0; i<point_list.length; i++) {
					sql = "update " + tableName + " set labelid = " + cluster_id + " where user_no = " + trajectory_id + " and tweet_no = " + point_list[i];
					dr.modifyDB(sql);
				}			
				System.out.println("update success");
			}
			else if (action == 2) {

				String dbclusterfield = "";
				String zonetypefield = "";
				String clusterMethod = request.getParameter("clusterMethod");
				String nexttime = request.getParameter("nexttime");

				if (clusterMethod.equalsIgnoreCase("DBSCAN_50_4")){
					dbclusterfield = "dbscanid_50_4";
					zonetypefield = "zone_dbscan_50";

				}else if (clusterMethod.equalsIgnoreCase("DBSCAN_100_4")){
					dbclusterfield = "dbscanid_100_4";
					zonetypefield = "zone_dbscan_100";

				}else if (clusterMethod.equalsIgnoreCase("DBSCAN_200_4")){
					dbclusterfield = "dbscanid_200_4";
					zonetypefield = "zone_dbscan_200";

				}else if (clusterMethod.equalsIgnoreCase("DBSCAN_300_4")){
					dbclusterfield = "dbscanid_300_4";
					zonetypefield = "zone_dbscan_300";

				}else if (clusterMethod.equalsIgnoreCase("DBSCAN_20_4")){
					dbclusterfield = "dbscanid_20_4";		
					zonetypefield = "zone_dbscan_20";
					
				}else if (clusterMethod.equalsIgnoreCase("STDBSCANCluster")){

				}else if (clusterMethod.equalsIgnoreCase("STDBSCANClusterNew")){

				}else if (clusterMethod.equalsIgnoreCase("VDBSCAN")){					
					dbclusterfield = "vdbscanid";
					zonetypefield = "zone_vdbscan";

				}else if (clusterMethod.equalsIgnoreCase("MDBSCAN")){					
					dbclusterfield = "mdbscanid";
					zonetypefield = "zone_mdbscan";

				}else {		//RawData			
					dbclusterfield = "labelid";
					zonetypefield = "placetest";
				}
				sql = "select count(*) as all from " + tableName + " where subid = " + trajectory_id + " and nexttime > " + nexttime + " and placetest != 'Others'";
				double all_num = 0, acc_num = 0;
				ResultSet all = dr.queryDB(sql);		 		
				while (all.next()){
					all_num = all.getDouble("all");
				}
				sql = "select count(*) as accurate from " + tableName + " where subid = " + trajectory_id + " and nexttime > " + nexttime + " and placetest = " + zonetypefield + " and placetype != 'Others'";
				ResultSet accurate = dr.queryDB(sql);
				while (accurate.next()){					
					acc_num = accurate.getDouble("accurate");
				}
				double accuracy = acc_num/all_num;
				result.put("accuracy", accuracy);
			}	 		

			jsonString = result.toString();
			System.out.println(jsonString);
			response.setContentType("text/json"); 	
			output.write(jsonString);

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{	
			output.close();	
		}
	}

}
