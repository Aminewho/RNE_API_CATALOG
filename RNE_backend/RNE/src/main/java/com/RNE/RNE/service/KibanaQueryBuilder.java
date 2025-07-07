package com.RNE.RNE.service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class KibanaQueryBuilder {

    public static String buildUserUsageQuery(String applicationName, String createdAt, String now) {
        return buildQuery(applicationName, createdAt, now, null);
    }

    public static String buildUserUsageQueryWithApi(String applicationName, String createdAt, String now, String apiName) {
        return buildQuery(applicationName, createdAt, now, apiName);
    }

    private static String buildQuery(String applicationName, String createdAt, String now, String apiName) {
        StringBuilder sb = new StringBuilder();
        sb.append("{")
          .append("\"aggs\": {")
          .append("\"0\": {")
          .append("\"date_histogram\": {")
          .append("\"field\": \"requestTimestamp\",")
          .append("\"calendar_interval\": \"1d\",")
          .append("\"time_zone\": \"Africa/Tunis\"")
          .append("},")
          .append("\"aggs\": {")
          .append("\"1-bucket\": {")
          .append("\"filter\": {")
          .append("\"match_phrase\": {\"apiCreatorTenantDomain.keyword\": \"carbon.super\"}")
          .append("}")
          .append("}")
          .append("}")
          .append("}")
          .append("},")
          .append("\"size\": 0,")
          .append("\"script_fields\": {},")
          .append("\"stored_fields\": [\"*\"],")
          .append("\"runtime_mappings\": {},")
          .append("\"query\": {")
          .append("\"bool\": {")
          .append("\"must\": [],")
          .append("\"filter\": [")
          .append("{\"match_phrase\": {\"applicationName.keyword\": \"").append(applicationName).append("\"}}");
        if (apiName != null) {
            sb.append(",{\"match_phrase\": {\"apiName.keyword\": \"").append(apiName).append("\"}}");
        }
        sb.append(",{")
          .append("\"range\": {")
          .append("\"requestTimestamp\": {")
          .append("\"format\": \"strict_date_optional_time\",")
          .append("\"gte\": \"").append(createdAt).append("\",")
          .append("\"lte\": \"").append(now).append("\"")
          .append("}")
          .append("}")
          .append("}")
          .append("],")
          .append("\"should\": [],")
          .append("\"must_not\": []")
          .append("}")
          .append("}")
          .append("}");

        return sb.toString();
    }
}
