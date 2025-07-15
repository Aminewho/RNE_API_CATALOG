package com.RNE.RNE.service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class KibanaQueryBuilder {

    public static String buildUserUsageQuery(String applicationName, String createdAt, String last) {
        return buildQuery(applicationName, createdAt, last, null);
    }

    public static String buildUserUsageQueryWithApi(String applicationName, String createdAt, String last, String apiName) {
        return buildQuery(applicationName, createdAt, last, apiName);
    }

    private static String buildQuery(String applicationName, String createdAt, String last, String apiName) {
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
          .append("\"lte\": \"").append(last).append("\"")
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
    public static int extractTotalHitsFromResponse(String json) {
    try {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(json);
        return root.path("hits").path("total").path("value").asInt(0);
    } catch (Exception e) {
        throw new RuntimeException("Failed to parse Kibana response", e);
    }
}
}
