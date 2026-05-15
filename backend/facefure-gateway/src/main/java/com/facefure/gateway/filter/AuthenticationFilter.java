package com.facefure.gateway.filter;

import com.facefure.common.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtUtils jwtUtils;
    
    private static final List<String> WHITELIST = List.of(
            "/api/v1/user/register",
            "/api/v1/user/login",
            "/api/v1/user/phone/code",
            "/api/v1/user/email/code",
            "/api/v1/user/captcha",
            "/swagger-ui",
            "/v3/api-docs"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().value();

        // 检查是否是白名单路径
        if (isWhiteListPath(path)) {
            return chain.filter(exchange);
        }

        // 获取token
        String token = getToken(request);
        if (!StringUtils.hasText(token)) {
            return unauthorized(exchange);
        }

        // 验证token
        try {
            Long userId = jwtUtils.validateAccessToken(token);
            if (userId == null) {
                return unauthorized(exchange);
            }

            // 将用户ID添加到请求头
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Id", String.valueOf(userId))
                    .build();
            
            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        } catch (Exception e) {
            log.error("Token验证失败", e);
            return unauthorized(exchange);
        }
    }

    private boolean isWhiteListPath(String path) {
        return WHITELIST.stream().anyMatch(path::startsWith);
    }

    private String getToken(ServerHttpRequest request) {
        String bearerToken = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
